import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  buildMonthGrid,
  daysInMonth,
  groupCalendarItems,
  isCalendarItemOverdue,
  moveCalendarMonth,
  normalizeDateKey,
  parseCalendarMonth,
} from "./calendar.ts";
import { getLaunchCraftQuiz, launchCraftLessonEightQuiz } from "./quizzes.ts";

const root = new URL("../../../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

test("la leçon 08 exige api-07-project complet et daté", () => {
  const catalog = read("lib/training/catalog.ts");
  const page = read("app/formation/api-ia/[lesson]/page.tsx");
  const route = read("app/api/training/launchcraft/quiz/validate/route.ts");
  assert.match(catalog, /"api-07-project",\s*"api-08-calendar"/);
  assert.match(page, /isValidLessonCompletion/);
  assert.match(route, /getPreviousOfficialLessonId/);
  assert.match(route, /data\?\.completed !== true/);
  assert.match(route, /data\.completed_at\.length === 0/);
});

test("la grille couvre les mois de 28, 29, 30 et 31 jours", () => {
  assert.equal(daysInMonth(2025, 2), 28);
  assert.equal(daysInMonth(2024, 2), 29);
  assert.equal(daysInMonth(2026, 4), 30);
  assert.equal(daysInMonth(2026, 1), 31);
  for (const [year, month, expected] of [[2025, 2, 28], [2024, 2, 29], [2026, 4, 30], [2026, 1, 31]]) {
    assert.equal(buildMonthGrid(year, month).filter((cell) => cell.date).length, expected);
  }
});

test("la navigation franchit correctement les années", () => {
  assert.deepEqual(moveCalendarMonth({ year: 2026, month: 12 }, 1), { year: 2027, month: 1 });
  assert.deepEqual(moveCalendarMonth({ year: 2027, month: 1 }, -1), { year: 2026, month: 12 });
});

test("les paramètres invalides sont neutralisés", () => {
  const fallback = { year: 2026, month: 8 };
  assert.deepEqual(parseCalendarMonth("2026", "12", fallback), { year: 2026, month: 12 });
  assert.deepEqual(parseCalendarMonth("<script>", "99", fallback), fallback);
});

test("une date civile ne subit aucune conversion UTC", () => {
  assert.equal(normalizeDateKey("2026-08-27"), "2026-08-27");
  assert.equal(normalizeDateKey("2025-02-29"), null);
});

test("objectifs et tâches sont regroupés, terminés ou en retard", () => {
  const items = [
    { id: "o1", projectId: "p1", title: "Objectif", date: "2026-08-27", kind: "objective", completed: true },
    { id: "t1", projectId: "p1", title: "Tâche", date: "2026-08-26", kind: "task", completed: false, priority: "high" },
  ];
  const groups = groupCalendarItems(items);
  assert.equal(groups["2026-08-27"][0].kind, "objective");
  assert.equal(groups["2026-08-27"][0].completed, true);
  assert.equal(isCalendarItemOverdue(items[1], "2026-08-27"), true);
  assert.equal(isCalendarItemOverdue(items[0], "2026-08-28"), false);
});

test("les exemples pédagogiques isolent toutes les lectures par user_id", () => {
  const lesson = read("components/formation/launchcraft/LaunchCraftLessonEight.tsx");
  const page = lesson.slice(lesson.indexOf("const pageCode"), lesson.indexOf("const loadingCode"));
  assert.equal((page.match(/\.eq\(\\?"user_id\\?", user\.id\)/g) ?? []).length >= 3, true);
  assert.match(page, /supabase\.auth\.getUser\(\)/);
  assert.doesNotMatch(page, /service_role|SERVICE_ROLE/);
  assert.match(page, /projectIds\.has/);
});

test("le calendrier expose les contrôles accessibles essentiels", () => {
  const lesson = read("components/formation/launchcraft/LaunchCraftLessonEight.tsx");
  assert.match(lesson, /aria-label="Afficher le mois précédent"/);
  assert.match(lesson, /role="grid"/);
  assert.match(lesson, /aria-pressed/);
  assert.match(lesson, /focus-visible/);
  assert.match(lesson, /Navigation mobile/);
});

test("le QCM 08 est public sans exposer son corrigé", () => {
  assert.equal(launchCraftLessonEightQuiz.lessonId, "api-08-calendar");
  assert.equal(getLaunchCraftQuiz("api-08-calendar"), launchCraftLessonEightQuiz);
  assert.equal(launchCraftLessonEightQuiz.questions.length, 4);
  const publicQuiz = read("lib/training/launchcraft/quizzes.ts");
  const answers = read("lib/training/launchcraft/answers.server.ts");
  assert.doesNotMatch(publicQuiz, /correctAnswer|"api-08-calendar": \[1, 2, 0, 1\]/);
  assert.match(answers, /import "server-only"/);
  assert.match(answers, /"api-08-calendar": \[1, 2, 0, 1\]/);
});

test("07 ouvre 08, puis 08 ouvre 09 sans débloquer le module 8", () => {
  const exercise = read("app/formation/api-ia/[lesson]/exercice/page.tsx");
  const nextModule = read("app/formation/supabase/page.tsx");
  assert.match(exercise, /moduleLessonIds\[7\]\[lessonIndex\]/);
  assert.match(exercise, /const destination = hasNextLesson/);
  assert.match(exercise, /String\(lessonNumber \+ 1\)\.padStart/);
  assert.match(nextModule, /previousModuleLessons = moduleLessonIds\[7\]/);
  assert.match(nextModule, /isValidLessonCompletion/);
});
