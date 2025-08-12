import * as express from 'express';
import cors = require('cors');
import helmet from 'helmet';
import { WorkoutService } from './services/WorkoutService';
import { ExerciseDatabase } from './data/ExerciseDatabase';
import { Set } from './models/Set';
import * as path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Services
const workoutService = new WorkoutService();
const exerciseDB = new ExerciseDatabase();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Fitness Tracker API is running!' });
});

// Exercise endpoints
app.get('/exercises', (req, res) => {
  try {
    const exercises = exerciseDB.getAllExercises();
    res.json(exercises.map(ex => ex.toJSON()));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

app.get('/exercises/search', (req, res) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }
    
    const exercises = exerciseDB.searchExercises(query);
    res.json(exercises.map(ex => ex.toJSON()));
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

app.get('/exercises/category/:category', (req, res) => {
  try {
    const category = req.params.category;
    const exercises = exerciseDB.findExercisesByCategory(category as any);
    res.json(exercises.map(ex => ex.toJSON()));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exercises by category' });
  }
});

// Workout endpoints
app.post('/workouts', async (req, res) => {
  try {
    const { name, userId, notes } = req.body;
    
    if (!name || !userId) {
      return res.status(400).json({ error: 'Name and userId are required' });
    }
    
    const workout = await workoutService.createWorkout(name, userId, notes);
    res.status(201).json(workout.toJSON());
  } catch (error) {
    res.status(500).json({ error: 'Failed to create workout' });
  }
});

app.get('/workouts/:id', async (req, res) => {
  try {
    const workout = await workoutService.getWorkoutById(req.params.id);
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    res.json(workout.toJSON());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workout' });
  }
});

app.get('/users/:userId/workouts', async (req, res) => {
  try {
    const workouts = await workoutService.getUserWorkouts(req.params.userId);
    res.json(workouts.map(w => w.toJSON()));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user workouts' });
  }
});

app.put('/workouts/:id/start', async (req, res) => {
  try {
    const workout = await workoutService.startWorkout(req.params.id);
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    res.json(workout.toJSON());
  } catch (error) {
    res.status(500).json({ error: 'Failed to start workout' });
  }
});

app.put('/workouts/:id/complete', async (req, res) => {
  try {
    const workout = await workoutService.completeWorkout(req.params.id);
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    res.json(workout.toJSON());
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete workout' });
  }
});

app.post('/workouts/:id/exercises', async (req, res) => {
  try {
    const { exerciseId, notes } = req.body;
    
    if (!exerciseId) {
      return res.status(400).json({ error: 'exerciseId is required' });
    }
    
    const exercise = exerciseDB.findExerciseById(exerciseId);
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    
    const workout = await workoutService.addExerciseToWorkout(req.params.id, exercise, notes);
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    
    res.json(workout.toJSON());
  } catch (error) {
    res.status(500).json({ error: 'Failed to add exercise to workout' });
  }
});

app.post('/workouts/:id/exercises/:exerciseIndex/sets', async (req, res) => {
  try {
    const { reps, weight, restTime, rpe, notes } = req.body;
    const exerciseIndex = parseInt(req.params.exerciseIndex);
    
    if (!reps || weight === undefined) {
      return res.status(400).json({ error: 'reps and weight are required' });
    }
    
    const workout = await workoutService.addSetToWorkoutExercise(
      req.params.id,
      exerciseIndex,
      reps,
      weight,
      restTime,
      rpe,
      notes
    );
    
    if (!workout) {
      return res.status(404).json({ error: 'Workout or exercise not found' });
    }
    
    res.json(workout.toJSON());
  } catch (error) {
    res.status(500).json({ error: 'Failed to add set' });
  }
});

// Analytics endpoints
app.get('/users/:userId/analytics', async (req, res) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const analytics = await workoutService.getWorkoutAnalytics(req.params.userId, days);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

app.get('/users/:userId/personal-records', async (req, res) => {
  try {
    const prs = await workoutService.getPersonalRecords(req.params.userId);
    res.json(prs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch personal records' });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Fitness Tracker API running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Endpoints:`);
  console.log(`   GET    /exercises`);
  console.log(`   GET    /exercises/search?q=chest`);
  console.log(`   GET    /exercises/category/chest`);
  console.log(`   POST   /workouts`);
  console.log(`   GET    /workouts/:id`);
  console.log(`   GET    /users/:userId/workouts`);
  console.log(`   PUT    /workouts/:id/start`);
  console.log(`   PUT    /workouts/:id/complete`);
  console.log(`   POST   /workouts/:id/exercises`);
  console.log(`   POST   /workouts/:id/exercises/:index/sets`);
  console.log(`   GET    /users/:userId/analytics`);
  console.log(`   GET    /users/:userId/personal-records`);
});

export default app;
