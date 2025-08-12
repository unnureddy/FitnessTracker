import { Workout, WorkoutExercise } from '../models/Workout';
import { Exercise } from '../models/Exercise';
import { Set } from '../models/Set';
import { WorkoutRepository } from '../repositories/WorkoutRepository';

export class WorkoutService {
  private workoutRepository: WorkoutRepository;

  constructor() {
    this.workoutRepository = new WorkoutRepository();
  }

  public async createWorkout(name: string, userId: string, notes?: string): Promise<Workout> {
    const workout = new Workout(name, userId, notes);
    return this.workoutRepository.save(workout);
  }

  public async getWorkoutById(id: string): Promise<Workout | null> {
    return this.workoutRepository.findById(id);
  }

  public async getUserWorkouts(userId: string): Promise<Workout[]> {
    return this.workoutRepository.findByUserId(userId);
  }

  public async startWorkout(workoutId: string): Promise<Workout | null> {
    const workout = await this.workoutRepository.findById(workoutId);
    if (!workout) return null;

    workout.startWorkout();
    return this.workoutRepository.save(workout);
  }

  public async addExerciseToWorkout(
    workoutId: string, 
    exercise: Exercise, 
    notes?: string
  ): Promise<Workout | null> {
    const workout = await this.workoutRepository.findById(workoutId);
    if (!workout) return null;

    const workoutExercise = new WorkoutExercise(exercise, [], notes);
    workout.addExercise(workoutExercise);
    
    return this.workoutRepository.save(workout);
  }

  public async addSetToWorkoutExercise(
    workoutId: string,
    exerciseIndex: number,
    reps: number,
    weight: number,
    restTime?: number,
    rpe?: number,
    notes?: string
  ): Promise<Workout | null> {
    const workout = await this.workoutRepository.findById(workoutId);
    if (!workout || !workout.exercises[exerciseIndex]) return null;

    const set = new Set(reps, weight, restTime, rpe, notes);
    workout.exercises[exerciseIndex].addSet(set);
    
    return this.workoutRepository.save(workout);
  }

  public async completeWorkout(workoutId: string): Promise<Workout | null> {
    const workout = await this.workoutRepository.findById(workoutId);
    if (!workout) return null;

    workout.endWorkout();
    return this.workoutRepository.save(workout);
  }

  public async deleteWorkout(workoutId: string): Promise<boolean> {
    return this.workoutRepository.delete(workoutId);
  }

  public async getWorkoutAnalytics(userId: string, days: number = 30) {
    const workouts = await this.workoutRepository.findUserWorkoutsInDateRange(
      userId, 
      new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      new Date()
    );

    const completedWorkouts = workouts.filter(w => w.endTime);

    return {
      totalWorkouts: workouts.length,
      completedWorkouts: completedWorkouts.length,
      totalVolume: workouts.reduce((sum, w) => sum + w.getTotalVolume(), 0),
      totalSets: workouts.reduce((sum, w) => sum + w.getTotalSets(), 0),
      totalReps: workouts.reduce((sum, w) => sum + w.getTotalReps(), 0),
      averageWorkoutDuration: completedWorkouts.length > 0 ? 
        completedWorkouts.reduce((sum, w) => sum + w.getDuration(), 0) / completedWorkouts.length : 0,
      workoutsPerWeek: (workouts.length / days) * 7,
      mostFrequentExercises: this.getMostFrequentExercises(workouts)
    };
  }

  private getMostFrequentExercises(workouts: Workout[]) {
    const exerciseCount = new Map<string, number>();
    
    workouts.forEach(workout => {
      workout.exercises.forEach(we => {
        const name = we.exercise.name;
        exerciseCount.set(name, (exerciseCount.get(name) || 0) + 1);
      });
    });

    return Array.from(exerciseCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  }

  public async getPersonalRecords(userId: string) {
    const workouts = await this.workoutRepository.findByUserId(userId);
    const prs = new Map<string, { weight: number, reps: number, date: Date }>();

    workouts.forEach(workout => {
      workout.exercises.forEach(we => {
        const exerciseName = we.exercise.name;
        we.sets.forEach(set => {
          if (set.weight > 0) {
            const currentPR = prs.get(exerciseName);
            const oneRM = set.getOneRepMax();
            
            if (!currentPR || oneRM > currentPR.weight) {
              prs.set(exerciseName, {
                weight: set.weight,
                reps: set.reps,
                date: workout.createdAt
              });
            }
          }
        });
      });
    });

    return Array.from(prs.entries()).map(([exercise, record]) => ({
      exercise,
      ...record
    }));
  }
}
