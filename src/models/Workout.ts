import { Exercise } from './Exercise';
import { Set } from './Set';
import { v4 as uuidv4 } from 'uuid';

export class WorkoutExercise {
  public exercise: Exercise;
  public sets: Set[];
  public notes?: string;

  constructor(exercise: Exercise, sets: Set[] = [], notes?: string) {
    this.exercise = exercise;
    this.sets = sets;
    this.notes = notes;
  }

  public addSet(set: Set): void {
    this.sets.push(set);
  }

  public getTotalReps(): number {
    return this.sets.reduce((total, set) => total + set.reps, 0);
  }

  public getTotalVolume(): number {
    return this.sets.reduce((total, set) => total + set.getVolume(), 0);
  }

  public getAverageRPE(): number {
    const rpeSets = this.sets.filter(set => set.rpe);
    if (rpeSets.length === 0) return 0;
    return rpeSets.reduce((sum, set) => sum + (set.rpe || 0), 0) / rpeSets.length;
  }

  public toJSON() {
    return {
      exercise: this.exercise.toJSON(),
      sets: this.sets.map(set => set.toJSON()),
      notes: this.notes,
      totalReps: this.getTotalReps(),
      totalVolume: this.getTotalVolume(),
      averageRPE: this.getAverageRPE()
    };
  }
}

export class Workout {
  public readonly id: string;
  public name: string;
  public userId: string;
  public exercises: WorkoutExercise[];
  public readonly createdAt: Date;
  public startTime?: Date;
  public endTime?: Date;
  public notes?: string;

  constructor(name: string, userId: string, notes?: string) {
    this.id = uuidv4();
    this.name = name;
    this.userId = userId;
    this.exercises = [];
    this.notes = notes;
    this.createdAt = new Date();
  }

  public startWorkout(): void {
    this.startTime = new Date();
  }

  public endWorkout(): void {
    this.endTime = new Date();
  }

  public addExercise(workoutExercise: WorkoutExercise): void {
    this.exercises.push(workoutExercise);
  }

  public getDuration(): number {
    if (!this.startTime || !this.endTime) return 0;
    return Math.round((this.endTime.getTime() - this.startTime.getTime()) / 60000); // minutes
  }

  public getTotalSets(): number {
    return this.exercises.reduce((total, ex) => total + ex.sets.length, 0);
  }

  public getTotalReps(): number {
    return this.exercises.reduce((total, ex) => total + ex.getTotalReps(), 0);
  }

  public getTotalVolume(): number {
    return this.exercises.reduce((total, ex) => total + ex.getTotalVolume(), 0);
  }

  public getWorkoutSummary() {
    return {
      id: this.id,
      name: this.name,
      userId: this.userId,
      duration: this.getDuration(),
      totalSets: this.getTotalSets(),
      totalReps: this.getTotalReps(),
      totalVolume: this.getTotalVolume(),
      exerciseCount: this.exercises.length,
      averageRPE: this.getAverageWorkoutRPE(),
      createdAt: this.createdAt,
      completedAt: this.endTime
    };
  }

  private getAverageWorkoutRPE(): number {
    const allRPEs = this.exercises.flatMap(ex => 
      ex.sets.filter(set => set.rpe).map(set => set.rpe!)
    );
    if (allRPEs.length === 0) return 0;
    return allRPEs.reduce((sum, rpe) => sum + rpe, 0) / allRPEs.length;
  }

  public displayWorkout(): void {
    console.log(`\n🏋️ Workout: ${this.name}`);
    console.log(`📅 Date: ${this.createdAt.toDateString()}`);
    if (this.getDuration() > 0) {
      console.log(`⏱️ Duration: ${this.getDuration()} minutes`);
    }
    console.log(`📊 Total: ${this.getTotalSets()} sets, ${this.getTotalReps()} reps`);
    console.log(`💪 Total Volume: ${this.getTotalVolume()}kg`);
    
    if (this.exercises.length > 0) {
      console.log("\n📝 Exercises:");
      this.exercises.forEach((workoutEx, index) => {
        console.log(`\n${index + 1}. ${workoutEx.exercise.name} (${workoutEx.exercise.category})`);
        console.log(`   💪 Muscles: ${workoutEx.exercise.muscleGroups.join(', ')}`);
        
        workoutEx.sets.forEach((set, setIndex) => {
          let setInfo = `   Set ${setIndex + 1}: ${set.toString()}`;
          if (set.rpe) setInfo += ` (RPE: ${set.rpe})`;
          console.log(setInfo);
        });
        
        if (workoutEx.notes) {
          console.log(`   💡 Notes: ${workoutEx.notes}`);
        }
        
        console.log(`   📈 Total: ${workoutEx.getTotalReps()} reps, ${workoutEx.getTotalVolume()}kg volume`);
      });
    }
    
    if (this.notes) {
      console.log(`\n📝 Workout Notes: ${this.notes}`);
    }
  }

  public toJSON() {
    return {
      ...this.getWorkoutSummary(),
      exercises: this.exercises.map(ex => ex.toJSON()),
      notes: this.notes
    };
  }
}
