export class Set {
  public reps: number;
  public weight: number; // in kg or lbs
  public restTime?: number; // seconds
  public rpe?: number; // Rate of Perceived Exertion (1-10)
  public notes?: string;
  public readonly timestamp: Date;

  constructor(
    reps: number,
    weight: number,
    restTime?: number,
    rpe?: number,
    notes?: string
  ) {
    this.reps = reps;
    this.weight = weight;
    this.restTime = restTime;
    this.rpe = rpe;
    this.notes = notes;
    this.timestamp = new Date();
  }

  public getVolume(): number {
    return this.reps * this.weight;
  }

  public getOneRepMax(): number {
    // Epley formula: 1RM = weight * (1 + reps/30)
    if (this.weight === 0) return 0;
    return this.weight * (1 + this.reps / 30);
  }

  public toString(): string {
    const weightText = this.weight > 0 ? `${this.weight}kg` : "bodyweight";
    return `${this.reps} reps @ ${weightText}`;
  }

  public toJSON() {
    return {
      reps: this.reps,
      weight: this.weight,
      restTime: this.restTime,
      rpe: this.rpe,
      notes: this.notes,
      volume: this.getVolume(),
      estimatedOneRepMax: this.getOneRepMax(),
      timestamp: this.timestamp
    };
  }
}
