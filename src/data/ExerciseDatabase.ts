import { Exercise, ExerciseCategory } from '../models/Exercise';

export class ExerciseDatabase {
  private exercises: Exercise[] = [];

  constructor() {
    this.initializeExercises();
  }

  private initializeExercises(): void {
    const exerciseData = [
      {
        id: '1',
        name: 'Push-ups',
        category: ExerciseCategory.CHEST,
        muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
        description: 'Classic bodyweight chest exercise',
        equipment: [],
        instructions: 'Start in plank position, lower body to ground, push back up'
      },
      {
        id: '2',
        name: 'Squats',
        category: ExerciseCategory.LEGS,
        muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
        description: 'Fundamental leg exercise',
        equipment: [],
        instructions: 'Stand with feet shoulder-width apart, lower body as if sitting back into a chair'
      },
      {
        id: '3',
        name: 'Pull-ups',
        category: ExerciseCategory.BACK,
        muscleGroups: ['Lats', 'Biceps', 'Rhomboids'],
        description: 'Upper body pulling exercise',
        equipment: ['Pull-up bar'],
        instructions: 'Hang from bar with palms facing away, pull body up until chin clears bar'
      },
      {
        id: '4',
        name: 'Bench Press',
        category: ExerciseCategory.CHEST,
        muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
        description: 'Classic chest exercise with barbell',
        equipment: ['Barbell', 'Bench'],
        instructions: 'Lie on bench, lower bar to chest, press back up'
      },
      {
        id: '5',
        name: 'Deadlift',
        category: ExerciseCategory.BACK,
        muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back', 'Traps'],
        description: 'Compound full body exercise',
        equipment: ['Barbell'],
        instructions: 'Stand with bar over mid-foot, bend at hips and knees, lift bar by extending hips and knees'
      },
      {
        id: '6',
        name: 'Overhead Press',
        category: ExerciseCategory.SHOULDERS,
        muscleGroups: ['Shoulders', 'Triceps', 'Core'],
        description: 'Shoulder pressing movement',
        equipment: ['Barbell', 'Dumbbells'],
        instructions: 'Press weight overhead from shoulder level'
      },
      {
        id: '7',
        name: 'Plank',
        category: ExerciseCategory.CORE,
        muscleGroups: ['Core', 'Shoulders', 'Glutes'],
        description: 'Isometric core exercise',
        equipment: [],
        instructions: 'Hold push-up position with straight body line'
      },
      {
        id: '8',
        name: 'Lunges',
        category: ExerciseCategory.LEGS,
        muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
        description: 'Single leg exercise',
        equipment: [],
        instructions: 'Step forward into lunge position, return to start'
      }
    ];

    this.exercises = exerciseData.map(data => 
      new Exercise(
        data.id,
        data.name,
        data.category,
        data.muscleGroups,
        data.description,
        data.equipment,
        data.instructions
      )
    );
  }

  public getAllExercises(): Exercise[] {
    return this.exercises;
  }

  public findExerciseById(id: string): Exercise | undefined {
    return this.exercises.find(ex => ex.id === id);
  }

  public findExerciseByName(name: string): Exercise | undefined {
    return this.exercises.find(ex => 
      ex.name.toLowerCase() === name.toLowerCase()
    );
  }

  public findExercisesByCategory(category: ExerciseCategory): Exercise[] {
    return this.exercises.filter(ex => ex.category === category);
  }

  public findExercisesByMuscleGroup(muscleGroup: string): Exercise[] {
    return this.exercises.filter(ex => 
      ex.muscleGroups.some(mg => 
        mg.toLowerCase().includes(muscleGroup.toLowerCase())
      )
    );
  }

  public addExercise(exercise: Exercise): void {
    this.exercises.push(exercise);
  }

  public searchExercises(query: string): Exercise[] {
    const lowerQuery = query.toLowerCase();
    return this.exercises.filter(ex => 
      ex.name.toLowerCase().includes(lowerQuery) ||
      ex.description?.toLowerCase().includes(lowerQuery) ||
      ex.muscleGroups.some(mg => mg.toLowerCase().includes(lowerQuery))
    );
  }
}
