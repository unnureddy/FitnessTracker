export enum ExerciseCategory {
  CHEST = 'chest',
  BACK = 'back',
  LEGS = 'legs',
  SHOULDERS = 'shoulders',
  ARMS = 'arms',
  CORE = 'core',
  CARDIO = 'cardio'
}

export class Exercise {
  public readonly id: string;
  public name: string;
  public category: ExerciseCategory;
  public description?: string;
  public muscleGroups: string[];
  public equipment?: string[];
  public instructions?: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(
    id: string,
    name: string,
    category: ExerciseCategory,
    muscleGroups: string[],
    description?: string,
    equipment?: string[],
    instructions?: string
  ) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.muscleGroups = muscleGroups;
    this.description = description;
    this.equipment = equipment;
    this.instructions = instructions;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public updateExercise(updates: Partial<Exercise>): void {
    Object.assign(this, updates);
    this.updatedAt = new Date();
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      muscleGroups: this.muscleGroups,
      description: this.description,
      equipment: this.equipment,
      instructions: this.instructions,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
