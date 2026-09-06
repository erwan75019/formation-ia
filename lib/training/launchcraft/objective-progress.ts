export function calculateLaunchCraftObjectiveProgress(
  objectives: readonly { completed: boolean }[]
) {
  if (objectives.length === 0) return 0;
  const completed = objectives.filter((objective) => objective.completed).length;
  return Math.round((completed / objectives.length) * 100);
}
