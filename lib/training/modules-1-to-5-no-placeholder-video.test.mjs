import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const lessonPages = [
  "app/formation/chatgpt/[lesson]/page.tsx",
  "app/formation/prompts/[lesson]/page.tsx",
  "app/formation/quotidien/[lesson]/page.tsx",
  "app/formation/comprendre-ia/[lesson]/page.tsx",
  "app/formation/automatisation/[lesson]/page.tsx",
];

test("les modules 1 à 5 ne contiennent aucun faux lecteur vidéo", () => {
  for (const path of lessonPages) {
    const source = readFileSync(new URL(path, root), "utf8");
    assert.doesNotMatch(source, />\s*▶\s*</, path);
    assert.doesNotMatch(source, /aspect-video/, path);
    assert.doesNotMatch(source, /\{\/\*[^]*?\bVIDEO\b[^]*?\*\/\}/i, path);
  }
});
