# Fitness Tracker API

A professional fitness tracking application built with TypeScript, designed to be scalable and production-ready.

## 🚀 Features

- **Exercise Management**: Pre-loaded exercise database with categorization
- **Workout Tracking**: Create and track complete workouts with sets, reps, and weight
- **Progress Analytics**: View workout statistics and personal records
- **RPE Tracking**: Rate of Perceived Exertion for each set
- **RESTful API**: Complete REST API for frontend integration
- **TypeScript**: Full type safety throughout the application
- **Scalable Architecture**: Clean separation of concerns with models, services, and repositories

## 🏗️ Architecture

```
src/
├── models/          # Data models (Exercise, Set, Workout)
├── services/        # Business logic layer
├── repositories/    # Data access layer
├── data/           # Static data and databases
├── server.ts       # Express API server
└── index.ts        # Demo application
```

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Run the demo application
npm run dev

# Run the API server
npm run dev:server
```

## 📊 Models

### Exercise
- Categories: Chest, Back, Legs, Shoulders, Arms, Core, Cardio
- Muscle groups targeting
- Equipment requirements
- Instructions

### Set
- Reps and weight tracking
- Rest time monitoring
- RPE (Rate of Perceived Exertion) scoring
- Volume calculation (reps × weight)
- One-rep max estimation

### Workout
- Multiple exercises per workout
- Start/end time tracking
- Duration calculation
- Total volume and rep counting
- Progress analytics

## 🔌 API Endpoints

### Exercises
- `GET /exercises` - Get all exercises
- `GET /exercises/search?q={query}` - Search exercises
- `GET /exercises/category/{category}` - Get exercises by category

### Workouts
- `POST /workouts` - Create new workout
- `GET /workouts/{id}` - Get specific workout
- `GET /users/{userId}/workouts` - Get user's workouts
- `PUT /workouts/{id}/start` - Start workout timer
- `PUT /workouts/{id}/complete` - Complete workout
- `POST /workouts/{id}/exercises` - Add exercise to workout
- `POST /workouts/{id}/exercises/{index}/sets` - Add set to exercise

### Analytics
- `GET /users/{userId}/analytics` - Get workout analytics
- `GET /users/{userId}/personal-records` - Get personal records

## 📈 Analytics Features

- Total workouts completed
- Total volume lifted
- Average workout duration
- Most frequent exercises
- Personal record tracking
- Progress over time

## 🎯 Usage Example

```typescript
// Create a workout
const workout = await workoutService.createWorkout("Push Day", "user123");

// Add exercises
const pushUps = exerciseDB.findExerciseByName("Push-ups");
await workoutService.addExerciseToWorkout(workout.id, pushUps);

// Add sets
await workoutService.addSetToWorkoutExercise(
  workout.id, 0, 15, 0, 60, 7  // 15 reps, bodyweight, 60s rest, RPE 7
);

// Complete workout
await workoutService.completeWorkout(workout.id);
```

## 🚢 Deployment Ready

This application is structured for easy deployment to:
- **Heroku**: Ready with proper package.json scripts
- **AWS Lambda**: Serverless deployment possible
- **Docker**: Containerization ready
- **Vercel/Netlify**: API deployment ready

## 🔮 Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- User authentication & authorization
- Real-time workout sharing
- Progressive overload recommendations
- Workout template system
- Mobile app integration
- Social features

## 📝 TypeScript Learning

This project demonstrates key TypeScript concepts:
- Classes and inheritance
- Interfaces and types
- Enums for categorization
- Generic types
- Async/await patterns
- Modular architecture
- Error handling

Built with ❤️ and TypeScript
