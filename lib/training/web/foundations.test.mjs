import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";
import { lessonThreePageCode } from "./checkpoints.ts";
import { webFoundationLessons } from "./foundations.ts";

const root = new URL("../../../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const publicQuizzes = read("lib/training/web/quizzes.ts");
const privateAnswers = read("lib/training/web/answers.server.ts");
const route = read("app/api/training/web/quiz/validate/route.ts");
const client = `${read("components/formation/web/SecureWebQuiz.tsx")}\n${read("components/formation/web/WebFoundationLesson.tsx")}\n${read("components/formation/web/LessonInteractions.tsx")}`;

test("les douze leçons construites utilisent leurs identifiants officiels", () => {
  assert.deepEqual(webFoundationLessons.map(({ id }) => id), ["web-01-projet-vscode", "web-02-nextjs", "web-03-structure", "web-04-tailwind", "web-05-donnees", "web-06-composants", "web-07-cartes", "web-08-recherche", "web-09-matching", "web-10-fiches", "web-11-favoris", "web-12-publication"]);
});

test("chaque leçon respecte toutes les sections du standard", () => {
  for (const lesson of webFoundationLessons) {
    for (const property of ["build", "visibleResult", "prerequisites", "vocabulary", "steps", "checklist", "errors", "exercise", "summary"])
      assert.ok(lesson[property]?.length > 0, `${lesson.id}: ${property}`);
    assert.ok(lesson.steps.every((step) => step.instruction && step.expected));
  }
  for (const heading of ["Ce que vous allez construire", "Résultat visible attendu", "Ce que vous devez déjà avoir", "Vocabulaire expliqué simplement", "Vérification manuelle", "Erreurs fréquentes et corrections", "Petit exercice guidé", "Ce que vous savez maintenant faire", "QCM sécurisé"])
    assert.match(client, new RegExp(heading));
});

test("commandes, chemins et actions sont explicites", () => {
  const commands = webFoundationLessons.flatMap((lesson) => lesson.steps.flatMap((step) => step.commands ?? []));
  for (const command of ["node --version", "npm --version", "npx create-next-app@latest propertymatch", "npm run dev"])
    assert.ok(commands.some((candidate) => candidate.includes(command)));
  for (const lesson of webFoundationLessons)
    for (const step of lesson.steps.filter((item) => item.path)) assert.ok(step.action, `${lesson.id}: action absente pour ${step.path}`);
});

test("Git est absent et les téléchargements officiels sont sécurisés", () => {
  const lessons = read("lib/training/web/foundations.ts");
  const standard = read("lib/training/web/pedagogy.ts");
  assert.doesNotMatch(`${lessons}\n${client}\n${standard}`, /git --version|GitHub|commit Git|suggestedCommit/i);
  assert.match(lessons, /https:\/\/code\.visualstudio\.com\/download/);
  assert.match(lessons, /https:\/\/nodejs\.org\/en\/download/);
  assert.match(client, /target="_blank"/);
  assert.match(client, /rel="noreferrer"/);
});

test("le checkpoint app/page.tsx se transpile sans diagnostic", () => {
  const result = ts.transpileModule(lessonThreePageCode, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 }, reportDiagnostics: true });
  assert.deepEqual(result.diagnostics ?? [], []);
  assert.match(lessonThreePageCode, /<form aria-label="Critères de recherche">/);
});

test("les checkpoints sont cumulatifs sans anticiper les leçons 4 à 12", () => {
  assert.match(webFoundationLessons[0].visibleResult, /dossier parent mes-projets/);
  assert.match(webFoundationLessons[1].visibleResult, /page de départ Next\.js/);
  assert.match(webFoundationLessons[2].visibleResult, /header.*navigation.*hero/i);
  assert.doesNotMatch(lessonThreePageCode, /className|next\/image|localStorage|compatib|score|properties\.map|fetch\(/i);
  assert.match(lessonThreePageCode, /type="button"/);
});

test("toutes les ressources existent avec alt et légende", () => {
  const visuals = webFoundationLessons.flatMap((lesson) => lesson.steps.flatMap((step) => step.visual ? [step.visual] : []));
  assert.ok(visuals.length >= 8);
  for (const visual of visuals) {
    assert.equal(existsSync(new URL(`../../../public${visual.src}`, import.meta.url)), true, visual.src);
    assert.ok(visual.alt.length >= 20);
    assert.ok(visual.caption.length >= 20);
  }
});

test("les trois QCM ont quatre questions, trois choix et des motifs distincts", () => {
  for (const [index, id] of ["web-01-projet-vscode", "web-02-nextjs", "web-03-structure"].entries()) {
    const start = publicQuizzes.indexOf(`"${id}"`);
    const nextId = ["web-02-nextjs", "web-03-structure", "web-04-tailwind"][index];
    const block = publicQuizzes.slice(start, publicQuizzes.indexOf(`"${nextId}"`, start + id.length));
    assert.equal((block.match(/id: "/g) ?? []).length, 4, id);
    for (const choices of block.matchAll(/choices: \[([^\]]+)\]/g)) assert.equal((choices[1].match(/"/g) ?? []).length / 2, 3);
  }
  const patterns = [...privateAnswers.matchAll(/"web-0[1-3]-[^"]+": \[([0-2, ]+)\]/g)].map((match) => match[1]);
  assert.equal(patterns.length, 3);
  assert.equal(new Set(patterns).size, 3);
  assert.ok(patterns.every((pattern) => new Set(pattern.split(",")).size > 1));
});

test("corrigés et progression restent exclusivement serveur", () => {
  assert.match(privateAnswers, /import "server-only"/);
  assert.doesNotMatch(publicQuizzes, /correctAnswer|correctAnswers/);
  assert.doesNotMatch(client, /correctAnswer|answers\.server|lesson_progress|createClient/);
  assert.match(route, /requireTrainingAccess\("complet"\)/);
  assert.match(route, /getPreviousOfficialLessonId\(validatedLessonId\)/);
  assert.match(route, /existing\.completed_at \?\? now/);
  assert.match(route, /Math\.max\(existing\?\.score \?\? -1, result\.score\)/);
});

test("les douze motifs de réponses sont uniques", () => {
  const patterns = [...privateAnswers.matchAll(/"web-[^"]+": \[([0-2, ]+)\]/g)].map((match) => match[1]);
  assert.equal(patterns.length, 12);
  assert.equal(new Set(patterns).size, 12);
});
