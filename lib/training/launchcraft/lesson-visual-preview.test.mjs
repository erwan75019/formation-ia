import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../../../", import.meta.url);
const component = readFileSync(
  new URL("components/formation/launchcraft/LessonVisualPreview.tsx", root),
  "utf8"
);
const lessonThree = readFileSync(
  new URL("components/formation/launchcraft/LaunchCraftLessonThree.tsx", root),
  "utf8"
);
const checkpoints = readFileSync(
  new URL("reference-apps/launchcraft/docs/lesson-checkpoints.md", root),
  "utf8"
);
const proxy = readFileSync(new URL("proxy.ts", root), "utf8");

const assets = [
  ["inscription-desktop.png", 1440, 900],
  ["connexion-desktop.png", 1440, 900],
  ["connexion-mobile.png", 780, 1688],
];

function readPngSize(fileUrl) {
  const buffer = readFileSync(fileUrl);
  assert.equal(buffer.toString("ascii", 1, 4), "PNG");
  return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
}

test("le composant visuel réserve les dimensions et reste accessible", () => {
  assert.match(component, /from "next\/image"/);
  assert.match(component, /width=\{asset\.width\}/);
  assert.match(component, /height=\{asset\.height\}/);
  assert.match(component, /sizes=/);
  assert.match(component, /loading="eager"/);
  assert.match(component, /<figcaption/);
  assert.match(component, /aria-label=\{`Agrandir : \$\{asset\.alt\}`\}/);
  assert.match(component, /rel="noreferrer"/);
  assert.match(component, /min-w-0/);
  assert.match(component, /h-auto w-full/);
  assert.match(component, /lg:grid-cols-\[minmax\(0,1fr\)_minmax\(240px,0\.36fr\)\]/);
  assert.doesNotMatch(
    component,
    /className="[^"]*(?:^|\s)(?:hidden|opacity-0|h-0)(?:\s|$)/
  );
  assert.doesNotMatch(component, /image à venir|placeholder/i);
});

test("les trois captures réelles de la leçon 03 existent aux dimensions déclarées", () => {
  for (const [name, width, height] of assets) {
    const file = new URL(`public/formation/launchcraft/lesson-03/${name}`, root);
    assert.equal(existsSync(file), true, `${name} doit exister`);
    assert.deepEqual(readPngSize(file), [width, height]);
    assert.match(lessonThree, new RegExp(`/formation/launchcraft/lesson-03/${name.replace(".", "\\.")}`));
  }
});

test("la leçon 03 affiche aperçu et comparaison avec des alternatives précises", () => {
  assert.match(lessonThree, /Voici ce que vous allez construire/);
  assert.match(lessonThree, /Comparez votre résultat/);
  const alternatives = [...lessonThree.matchAll(/alt: "([^"]+)"/g)].map((match) => match[1]);
  assert.equal(alternatives.length, 3);
  assert.equal(alternatives.every((alt) => alt.trim().length >= 30), true);
});

test("le proxy laisse next/image lire les captures publiques sans ouvrir les cours", () => {
  assert.match(proxy, /isPublicFormationAsset\(request\.nextUrl\.pathname\)/);
  assert.match(proxy, /pathname\.startsWith\("\/formation\/"\)/);
  assert.match(proxy, /jpe\?g\|png\|svg\|webp/);
  assert.match(proxy, /matcher: \["\/formation\/:path\*", "\/inscription"\]/);
});

test("le plan couvre les neuf checkpoints sans annoncer de fausse capture", () => {
  for (let lesson = 1; lesson <= 9; lesson += 1) {
    assert.match(checkpoints, new RegExp(`\\| ${String(lesson).padStart(2, "0")} \\|`));
  }
  assert.match(checkpoints, /Captures bloquées volontairement/);
  assert.match(checkpoints, /aucune capture authentifiée n’a donc été fabriquée/);
});
