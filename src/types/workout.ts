

// Exercise ( bench press)
export interface Exercise{
    id: number;
    name: String;
    category: String;
    description?: String;
    imageUrl?: String;
}

// set ( a single set of an exercise)
// A set consists of a number of repetitions and the weight lifted
// It can also include rest time between sets
export interface set{
    reps: number;
    weight: number;
    restTime?: number; // in seconds
}


export interface WorkoutSummary {
    exercise: Exercise;
    sets: set[];
    notes?: string; // Additional notes for the workout
}

export interface Workout {
    id: number;
    date: Date;
    name: string; // Name of the workout session
    startTime: Date;
    endTime: Date;
    workoutSummary: WorkoutSummary[];
}
