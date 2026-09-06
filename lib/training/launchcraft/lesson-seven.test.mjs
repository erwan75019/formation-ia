import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { calculateLaunchCraftDashboardMetrics } from "./dashboard-metrics.ts";
import { getLaunchCraftQuiz, launchCraftLessonSevenQuiz } from "./quizzes.ts";

const root=new URL("../../../",import.meta.url); const read=(path)=>readFileSync(new URL(path,root),"utf8");

test("07 exige api-06-ai-call complet et daté",()=>{const catalog=read("lib/training/catalog.ts"),page=read("app/formation/api-ia/[lesson]/page.tsx"),route=read("app/api/training/launchcraft/quiz/validate/route.ts");assert.match(catalog,/"api-06-ai-call",\s*"api-07-project"/);assert.match(page,/isValidLessonCompletion/);assert.match(route,/getPreviousOfficialLessonId/);assert.match(route,/data\?\.completed !== true/);assert.match(route,/data\.completed_at\.length === 0/)});

test("dashboard calcule zéro, partiel et cent",()=>{const empty=calculateLaunchCraftDashboardMetrics(0,[],[],"2026-08-27");assert.equal(empty.objectiveProgress,0);const partial=calculateLaunchCraftDashboardMetrics(1,[{completed:true},{completed:false}],[],"2026-08-27");assert.equal(partial.objectiveProgress,50);const full=calculateLaunchCraftDashboardMetrics(1,[{completed:true},{completed:true}],[],"2026-08-27");assert.equal(full.objectiveProgress,100)});

test("retards, restantes et échéances sont cohérents et triés",()=>{const tasks=[{id:"done",title:"Terminée",project_id:"p",status:"completed",due_date:"2026-08-28"},{id:"late",title:"Retard",project_id:"p",status:"todo",due_date:"2026-08-20"},{id:"far",title:"Loin",project_id:"p",status:"todo",due_date:"2026-09-10"},{id:"near",title:"Proche",project_id:"p",status:"in_progress",due_date:"2026-08-28"}];const result=calculateLaunchCraftDashboardMetrics(1,[],tasks,"2026-08-27");assert.equal(result.completedTasks,1);assert.equal(result.remainingTasks,3);assert.equal(result.overdueTasks,1);assert.deepEqual(result.upcomingTasks.map((task)=>task.id),["near","far"])});

test("lectures serveur isolées et sans chiffres codés en dur",()=>{const lesson=read("components/formation/launchcraft/LaunchCraftLessonSeven.tsx");const dashboard=lesson.slice(lesson.indexOf('path: "app/dashboard/page.tsx"'),lesson.indexOf('path: "app/dashboard/loading.tsx"'));assert.match(dashboard,/await requireUser\(\)/);const filters=dashboard.match(/\.eq\(\\?"user_id\\?",user\.id\)/g)??[];assert.equal(filters.length>=3,true);assert.match(dashboard,/Promise\.all/);assert.match(dashboard,/projects\.length/);assert.doesNotMatch(dashboard,/service_role|SERVICE_ROLE/);assert.match(dashboard,/Aucun projet/);assert.match(lesson,/Aucune échéance à venir/)});

test("QCM 07 est sécurisé sans corrigé client",()=>{assert.equal(launchCraftLessonSevenQuiz.lessonId,"api-07-project");assert.equal(getLaunchCraftQuiz("api-07-project"),launchCraftLessonSevenQuiz);assert.equal(launchCraftLessonSevenQuiz.questions.length,4);const quizzes=read("lib/training/launchcraft/quizzes.ts"),answers=read("lib/training/launchcraft/answers.server.ts"),route=read("app/api/training/launchcraft/quiz/validate/route.ts");assert.doesNotMatch(quizzes,/correctAnswer|"api-07-project": \[1, 0, 1, 2\]/);assert.match(answers,/import "server-only"/);assert.match(answers,/"api-07-project": \[1, 0, 1, 2\]/);assert.match(route,/Object\.keys\(body\)\.length !== 2/);assert.match(route,/requireTrainingAccess\("complet"\)/)});

test("le catalogue compte neuf checkpoints et bloque encore le module 8",()=>{const catalog=read("lib/training/catalog.ts"),nextModule=read("app/formation/supabase/page.tsx"),exercise=read("app/formation/api-ia/[lesson]/exercice/page.tsx");assert.match(catalog,/"api-07-project",\s*"api-08-calendar",\s*"api-09-security"/);assert.match(nextModule,/previousModuleLessons = moduleLessonIds\[7\]/);assert.match(nextModule,/isValidLessonCompletion/);assert.match(exercise,/moduleLessonIds\[7\]\[lessonIndex\]/)});

test("après réussite 07 le QCM ouvre la leçon 08",()=>{const exercise=read("app/formation/api-ia/[lesson]/exercice/page.tsx");assert.match(exercise,/String\(lessonNumber \+ 1\)\.padStart/)});
