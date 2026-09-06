import assert from "node:assert/strict";
import test from "node:test";

import {
  getPreviousOfficialLessonId,
  isValidLessonCompletion,
  planLessonTotals,
} from "./catalog.ts";

const transitions = [
  ["quotidien-01-travail", "prompts-05-project"],
  ["fichiers-01-comprendre", "quotidien-05-mission"],
  ["automation-01-logic", "fichiers-06-projet"],
  ["web-01-projet-vscode", "automation-07-project"],
  ["api-01-intro", "web-12-publication"],
];

for (const [nextLessonId, projectId] of transitions) {
  test(`${projectId} est requis avant ${nextLessonId}`, () => {
    assert.equal(getPreviousOfficialLessonId(nextLessonId), projectId);
    assert.equal(
      isValidLessonCompletion(
        { lesson_id: projectId, completed: false, completed_at: null },
        projectId
      ),
      false
    );
    assert.equal(
      isValidLessonCompletion(
        { lesson_id: projectId, completed: true, completed_at: null },
        projectId
      ),
      false
    );
    assert.equal(
      isValidLessonCompletion(
        {
          lesson_id: projectId,
          completed: true,
          completed_at: "2026-08-16T10:00:00.000Z",
        },
        projectId
      ),
      true
    );
  });
}

test("les totaux officiels restent stables", () => {
  assert.equal(planLessonTotals.fondamentaux, 28);
  assert.equal(planLessonTotals.complet, 84);
});
