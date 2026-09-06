export function calculateObjectiveQuizScore(
  answers: readonly number[],
  expected: readonly number[],
  passingScore: number
) {
  if (answers.length !== expected.length || expected.length === 0) return null;
  const correctCount = answers.filter((answer, index) => answer === expected[index]).length;
  const score = Math.round((correctCount / expected.length) * 100);
  return { score, correctCount, passed: score >= passingScore };
}
