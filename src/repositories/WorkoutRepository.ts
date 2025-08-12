import { Workout } from '../models/Workout';

export class WorkoutRepository {
  private workouts: Map<string, Workout> = new Map();

  public async save(workout: Workout): Promise<Workout> {
    this.workouts.set(workout.id, workout);
    return workout;
  }

  public async findById(id: string): Promise<Workout | null> {
    return this.workouts.get(id) || null;
  }

  public async findByUserId(userId: string): Promise<Workout[]> {
    return Array.from(this.workouts.values())
      .filter(workout => workout.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public async findUserWorkoutsInDateRange(
    userId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<Workout[]> {
    return Array.from(this.workouts.values())
      .filter(workout => 
        workout.userId === userId &&
        workout.createdAt >= startDate &&
        workout.createdAt <= endDate
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public async delete(id: string): Promise<boolean> {
    return this.workouts.delete(id);
  }

  public async getAllWorkouts(): Promise<Workout[]> {
    return Array.from(this.workouts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public async getWorkoutCount(): Promise<number> {
    return this.workouts.size;
  }

  public async getUserWorkoutCount(userId: string): Promise<number> {
    return Array.from(this.workouts.values())
      .filter(workout => workout.userId === userId).length;
  }
}
