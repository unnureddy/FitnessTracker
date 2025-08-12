import { Exercise, ExerciseCategory } from './models/Exercise';
import { Set } from './models/Set';
import { WorkoutExercise, Workout } from './models/Workout';
import { ExerciseDatabase } from './data/ExerciseDatabase';
import { WorkoutService } from './services/WorkoutService';

async function demonstrateFitnessTracker() {
  console.log("🏋️ Professional Fitness Tracker Demo");
  console.log("=====================================\n");

  // Initialize services
  const exerciseDB = new ExerciseDatabase();
  const workoutService = new WorkoutService();
  const userId = "user123";

  // Show available exercises
  console.log("📋 Available Exercises:");
  const chestExercises = exerciseDB.findExercisesByCategory(ExerciseCategory.CHEST);
  const legExercises = exerciseDB.findExercisesByCategory(ExerciseCategory.LEGS);
  
  console.log("\n💪 Chest Exercises:");
  chestExercises.forEach(ex => console.log(`  - ${ex.name}: ${ex.description}`));
  
  console.log("\n🦵 Leg Exercises:");
  legExercises.forEach(ex => console.log(`  - ${ex.name}: ${ex.description}`));

  // Create a new workout
  console.log("\n🆕 Creating New Workout...");
  const workout = await workoutService.createWorkout("Push Day", userId, "Focusing on chest and triceps");
  console.log(`✅ Created workout: ${workout.name} (ID: ${workout.id})`);

  // Start the workout
  await workoutService.startWorkout(workout.id);
  console.log("▶️ Workout started!");

  // Add exercises to workout
  const pushUps = exerciseDB.findExerciseByName("Push-ups")!;
  const benchPress = exerciseDB.findExerciseByName("Bench Press")!;

  await workoutService.addExerciseToWorkout(workout.id, pushUps, "Warming up with bodyweight");
  await workoutService.addExerciseToWorkout(workout.id, benchPress, "Working sets with good form");

  // Add sets to exercises
  console.log("\n🏃‍♂️ Adding Sets...");

  // Push-ups sets (exercise index 0)
  await workoutService.addSetToWorkoutExercise(workout.id, 0, 15, 0, 60, 6); // 15 reps, bodyweight, 60s rest, RPE 6
  await workoutService.addSetToWorkoutExercise(workout.id, 0, 12, 0, 60, 7); // 12 reps, bodyweight, 60s rest, RPE 7
  await workoutService.addSetToWorkoutExercise(workout.id, 0, 10, 0, 60, 8); // 10 reps, bodyweight, 60s rest, RPE 8

  // Bench Press sets (exercise index 1)
  await workoutService.addSetToWorkoutExercise(workout.id, 1, 8, 80, 120, 7); // 8 reps, 80kg, 2min rest, RPE 7
  await workoutService.addSetToWorkoutExercise(workout.id, 1, 6, 85, 120, 8); // 6 reps, 85kg, 2min rest, RPE 8
  await workoutService.addSetToWorkoutExercise(workout.id, 1, 4, 90, 120, 9); // 4 reps, 90kg, 2min rest, RPE 9

  // Complete the workout
  const completedWorkout = await workoutService.completeWorkout(workout.id);
  console.log("✅ Workout completed!");

  // Display the complete workout
  if (completedWorkout) {
    completedWorkout.displayWorkout();
  }

  // Create another workout for analytics demo
  console.log("\n\n🔄 Creating Second Workout for Analytics...");
  const workout2 = await workoutService.createWorkout("Leg Day", userId, "Focusing on legs and glutes");
  await workoutService.startWorkout(workout2.id);

  const squats = exerciseDB.findExerciseByName("Squats")!;
  const lunges = exerciseDB.findExerciseByName("Lunges")!;

  await workoutService.addExerciseToWorkout(workout2.id, squats, "Focus on depth");
  await workoutService.addExerciseToWorkout(workout2.id, lunges, "Alternating legs");

  // Add sets
  await workoutService.addSetToWorkoutExercise(workout2.id, 0, 20, 0, 90, 6);
  await workoutService.addSetToWorkoutExercise(workout2.id, 0, 18, 0, 90, 7);
  await workoutService.addSetToWorkoutExercise(workout2.id, 0, 15, 0, 90, 8);

  await workoutService.addSetToWorkoutExercise(workout2.id, 1, 12, 0, 60, 6);
  await workoutService.addSetToWorkoutExercise(workout2.id, 1, 10, 0, 60, 7);

  await workoutService.completeWorkout(workout2.id);

  // Show analytics
  console.log("\n📊 Workout Analytics (Last 30 days):");
  const analytics = await workoutService.getWorkoutAnalytics(userId, 30);
  console.log(`📈 Total Workouts: ${analytics.totalWorkouts}`);
  console.log(`✅ Completed Workouts: ${analytics.completedWorkouts}`);
  console.log(`💪 Total Volume: ${analytics.totalVolume}kg`);
  console.log(`📊 Total Sets: ${analytics.totalSets}`);
  console.log(`🔢 Total Reps: ${analytics.totalReps}`);
  console.log(`⏱️ Average Duration: ${analytics.averageWorkoutDuration.toFixed(1)} minutes`);
  console.log(`📅 Workouts per Week: ${analytics.workoutsPerWeek.toFixed(1)}`);

  console.log("\n🏆 Most Frequent Exercises:");
  analytics.mostFrequentExercises.forEach((ex, index) => {
    console.log(`${index + 1}. ${ex.name}: ${ex.count} times`);
  });

  // Show personal records
  console.log("\n🥇 Personal Records:");
  const prs = await workoutService.getPersonalRecords(userId);
  prs.forEach(pr => {
    console.log(`${pr.exercise}: ${pr.weight}kg x ${pr.reps} reps (${pr.date.toDateString()})`);
  });

  // Search functionality demo
  console.log("\n🔍 Search Demo - Finding 'chest' exercises:");
  const chestSearch = exerciseDB.searchExercises("chest");
  chestSearch.forEach(ex => console.log(`  - ${ex.name} (${ex.category})`));

  console.log("\n🎉 Fitness Tracker Demo Complete!");
  console.log("🚀 Ready for production deployment!");
}

// Run the demonstration
demonstrateFitnessTracker().catch(console.error);
