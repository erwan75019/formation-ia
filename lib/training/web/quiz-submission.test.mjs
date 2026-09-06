import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { webLessonCatalog } from "../catalog.ts";
import { getWebQuiz, webQuizzes } from "./quizzes.ts";
import { getWebQuizResultPresentation } from "./result.ts";
import {
  buildWebQuizSubmission,
  createEmptyWebQuizAnswers,
  parseWebQuizSubmission,
  toWebQuizAnswerIndex,
} from "./submission.ts";

const root = new URL("../../../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

for (const lessonIndex of [0, 3, 11]) {
  const lesson = webLessonCatalog[lessonIndex];
  test(`${lesson.id} accepte quatre réponses numériques ordonnées`, () => {
    const quiz = getWebQuiz(lesson.id);
    assert.ok(quiz);
    const answers = [2, 0, 1, 2];
    const submission = buildWebQuizSubmission(quiz, answers);
    assert.deepEqual(submission, { lesson_id: lesson.id, answers });
    assert.deepEqual(parseWebQuizSubmission(submission), {
      valid: true,
      quiz,
      answers,
    });
  });
}

test("les valeurs des boutons radio deviennent des nombres", () => {
  assert.equal(toWebQuizAnswerIndex("0"), 0);
  assert.equal(toWebQuizAnswerIndex("1"), 1);
  assert.equal(toWebQuizAnswerIndex("2"), 2);
  assert.equal(typeof toWebQuizAnswerIndex("2"), "number");
});

test("une réponse manquante empêche la construction de la requête", () => {
  const quiz = getWebQuiz("web-04-tailwind");
  assert.ok(quiz);
  assert.deepEqual(createEmptyWebQuizAnswers(quiz.questions.length), [null, null, null, null]);
  assert.equal(buildWebQuizSubmission(quiz, [0, 1, null, 2]), null);
});

test("trois ou cinq réponses sont rejetées avec le même contrat que la route 400", () => {
  for (const answers of [[0, 1, 2], [0, 1, 2, 0, 1]]) {
    assert.deepEqual(
      parseWebQuizSubmission({ lesson_id: "web-04-tailwind", answers }),
      { valid: false, reason: "answers" }
    );
  }
  const route = read("app/api/training/web/quiz/validate/route.ts");
  assert.match(route, /const invalid = \(error: string\).*status: 400/);
  assert.match(route, /parseWebQuizSubmission\(body\)/);
});

test("les index négatifs, trop grands, décimaux ou textuels sont rejetés", () => {
  for (const invalidAnswer of [-1, 3, 1.5, "1"]) {
    const parsed = parseWebQuizSubmission({
      lesson_id: "web-04-tailwind",
      answers: [0, 1, 2, invalidAnswer],
    });
    assert.deepEqual(parsed, { valid: false, reason: "answers" });
  }
});

test("les douze catalogues ont exactement quatre questions et trois choix", () => {
  assert.equal(webQuizzes.length, webLessonCatalog.length);
  for (const quiz of webQuizzes) {
    assert.equal(quiz.questions.length, 4, quiz.lessonId);
    assert.ok(quiz.questions.every((question) => question.choices.length === 3));
  }
});

test("l'interface bloque les réponses manquantes et distingue réussite et échec", () => {
  const client = read("components/formation/web/SecureWebQuiz.tsx");
  assert.match(client, /buildWebQuizSubmission\(quiz, answers\)/);
  assert.match(client, /Répondez aux \$\{quiz\.questions\.length\} questions avant de continuer\./);
  assert.match(client, /questionRefs\.current\[firstMissingAnswer\]\?\.focus\(\)/);
  assert.match(client, /JSON\.stringify\(submission\)/);
  assert.match(client, /getWebQuizResultPresentation\(result\)/);
  assert.match(client, /continuation\.label/);
  assert.match(client, /result \? "Réessayer"/);
  assert.doesNotMatch(client, /console\.(log|debug)|result\.score\s*>=/);
});

test("75 % produit l'encadré vert et autorise la navigation", () => {
  const presentation = getWebQuizResultPresentation({
    score: 75,
    passed: true,
    correct_count: 3,
    total_questions: 4,
    passing_score: 70,
    best_score: 75,
  });
  assert.deepEqual(presentation, {
    tone: "success",
    message: "Leçon validée — Score : 75 %",
    canContinue: true,
  });
  const client = read("components/formation/web/SecureWebQuiz.tsx");
  assert.match(client, /bg-emerald-50/);
  assert.match(client, /presentation\?\.canContinue/);
});

test("50 % produit l'encadré orange, Réessayer et aucune navigation", () => {
  const presentation = getWebQuizResultPresentation({
    score: 50,
    passed: false,
    correct_count: 2,
    total_questions: 4,
    passing_score: 70,
    best_score: 50,
  });
  assert.deepEqual(presentation, {
    tone: "retry",
    message: "Score : 50 % — 70 % sont nécessaires pour valider la leçon.",
    canContinue: false,
  });
  const client = read("components/formation/web/SecureWebQuiz.tsx");
  assert.match(client, /bg-amber-50/);
  assert.match(client, /result \? retry : submit/);
  assert.match(client, /setAnswers\(createEmptyWebQuizAnswers/);
  assert.match(client, /questionRefs\.current\[0\]\?\.focus/);
});

test("question manquante est orange et erreur serveur est rouge", () => {
  const client = read("components/formation/web/SecureWebQuiz.tsx");
  assert.match(client, /incompleteMessage.*role="status".*bg-amber-50/s);
  assert.match(client, /error.*role="alert".*bg-red-50/s);
});
