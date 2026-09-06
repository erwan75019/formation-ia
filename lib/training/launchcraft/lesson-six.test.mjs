import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { calculateLaunchCraftTaskMetrics } from "./task-metrics.ts";
import { getLaunchCraftQuiz, launchCraftLessonSixQuiz } from "./quizzes.ts";

const root = new URL("../../../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

test("api-06-ai-call suit api-05-keys-env avec progression datée", () => {
  const catalog=read("lib/training/catalog.ts"),page=read("app/formation/api-ia/[lesson]/page.tsx"),route=read("app/api/training/launchcraft/quiz/validate/route.ts");
  assert.match(catalog,/"api-05-keys-env",\s*"api-06-ai-call"/); assert.match(page,/isValidLessonCompletion/); assert.match(route,/getPreviousOfficialLessonId/); assert.match(route,/data\?\.completed !== true/); assert.match(route,/data\.completed_at\.length === 0/);
});

test("QCM 06 partagé sans corrigé client",()=>{
  assert.equal(launchCraftLessonSixQuiz.lessonId,"api-06-ai-call"); assert.equal(getLaunchCraftQuiz("api-06-ai-call"),launchCraftLessonSixQuiz); assert.equal(launchCraftLessonSixQuiz.questions.length,4);
  const quizzes=read("lib/training/launchcraft/quizzes.ts"),answers=read("lib/training/launchcraft/answers.server.ts"),exercise=read("app/formation/api-ia/[lesson]/exercice/page.tsx");
  assert.doesNotMatch(quizzes,/correctAnswer|"api-06-ai-call": \[1, 0, 2, 0\]/); assert.match(answers,/import "server-only"/); assert.match(answers,/"api-06-ai-call": \[1, 0, 2, 0\]/); assert.match(exercise,/moduleLessonIds\[7\]\[lessonIndex\]/);
});

test("formulaires sans user_id ni project_id et UUID stricts",()=>{
  const lesson=read("components/formation/launchcraft/LaunchCraftLessonSix.tsx"); const clients=lesson.slice(lesson.indexOf('path: "components/TaskForm.tsx"'),lesson.indexOf('path: "app/projets/[id]/page.tsx"'));
  assert.doesNotMatch(clients,/name=\\?"(?:user_id|project_id)\\?"/); assert.match(lesson,/const UUID =/); assert.match(lesson,/title\.length < 3 \|\| title\.length > 160/); assert.match(lesson,/description\.length > 2000/); assert.match(lesson,/keys\.length !== FIELDS\.length/);
});

test("projet parent, objective_id et mutations sont isolés",()=>{
  const lesson=read("components/formation/launchcraft/LaunchCraftLessonSix.tsx"); const actions=lesson.slice(lesson.indexOf('path: "app/actions/tasks.ts"'),lesson.indexOf('path: "components/TaskForm.tsx"'));
  assert.match(actions,/\.eq\(\\?"id\\?", projectId\)\.eq\(\\?"user_id\\?", user\.id\)/);
  assert.match(actions,/\.eq\(\\?"id\\?", objectiveId\)\.eq\(\\?"project_id\\?", projectId\)\.eq\(\\?"user_id\\?", user\.id\)/);
  const filters=actions.match(/\.eq\(\\?"id\\?", taskId\)\.eq\(\\?"project_id\\?", projectId\)\.eq\(\\?"user_id\\?", access\.user\.id\)/g)??[]; assert.equal(filters.length>=4,true);
  assert.match(actions,/objective_id: parsed\.data\.objective_id|\.\.\.parsed\.data/); assert.doesNotMatch(actions,/service_role|SERVICE_ROLE/);
});

test("indicateurs total, terminé, restant et retard",()=>{
  const tasks=[{status:"completed",due_date:"2026-01-01"},{status:"todo",due_date:"2026-01-01"},{status:"in_progress",due_date:"2026-12-01"},{status:"todo",due_date:null}];
  assert.deepEqual(calculateLaunchCraftTaskMetrics(tasks,"2026-06-01"),{total:4,completed:1,remaining:3,overdue:1});
});

test("route QCM stricte et navigation vers 07 après réussite",()=>{
  const route=read("app/api/training/launchcraft/quiz/validate/route.ts"),lesson=read("components/formation/launchcraft/LaunchCraftLessonSix.tsx");
  assert.match(route,/Object\.keys\(body\)\.length !== 2/); assert.match(route,/requireTrainingAccess\("complet"\)/); assert.match(route,/completed_at: existing\.completed_at \?\? now/); assert.match(lesson,/lessonCompleted&&<Link href="\/formation\/api-ia\/07"/); assert.match(lesson,/<LessonCoach lessonId="api-06-ai-call"/);
});
