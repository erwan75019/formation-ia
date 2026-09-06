export type WebQuizServerResult = {
  score: number;
  passed: boolean;
  correct_count: number;
  total_questions: number;
  passing_score: number;
  best_score: number | null;
};

export function getWebQuizResultPresentation(result: WebQuizServerResult) {
  if (result.passed) {
    return {
      tone: "success" as const,
      message: `Leçon validée — Score : ${result.score} %`,
      canContinue: true,
    };
  }

  return {
    tone: "retry" as const,
    message: `Score : ${result.score} % — ${result.passing_score} % sont nécessaires pour valider la leçon.`,
    canContinue: false,
  };
}
