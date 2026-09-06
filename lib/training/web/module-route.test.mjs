import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../../../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const config = read("next.config.ts");
const catalog = read("lib/training/catalog.ts");
const proxy = read("proxy.ts");

test("site-web est le seul dossier applicatif canonique du module 6", () => {
  assert.equal(existsSync(new URL("app/formation/site-web/page.tsx", root)), true);
  assert.equal(existsSync(new URL("app/formation/python/page.tsx", root)), false);
});

test("le catalogue et le proxy utilisent la route canonique", () => {
  assert.match(catalog, /route: "\/formation\/site-web"/);
  assert.match(proxy, /"site-web": "complet"/);
  assert.doesNotMatch(proxy, /python: "complet"/);
});

test("les anciennes URL ont une redirection permanente exacte", () => {
  assert.match(config, /source: "\/formation\/python"/);
  assert.match(config, /destination: "\/formation\/site-web"/);
  assert.match(config, /source: "\/formation\/python\/:path\*"/);
  assert.match(config, /destination: "\/formation\/site-web\/:path\*"/);
  assert.match(config, /source: "\/formation\/site-web\/:lesson\(1\[3-9\]\|20\)\/:path\*"/);
  assert.match(config, /destination: "\/formation\/site-web\/12"/);
  assert.equal((config.match(/permanent: true/g) ?? []).length, 3);
});

test("le ZIP pédagogique est public sans ouvrir les pages de formation", () => {
  const proxy = read("proxy.ts");
  assert.match(proxy, /isPublicFormationAsset\(request\.nextUrl\.pathname\)/);
  assert.match(proxy, /\\\.\(\?:avif\|gif\|jpe\?g\|png\|svg\|webp\|zip\)\$\/i/);
  assert.match(proxy, /matcher: \["\/formation\/:path\*", "\/inscription"\]/);
});

test("les douze identifiants canoniques sont la seule source active", () => {
  const moduleSix = catalog.match(/webLessonCatalog = \[([\s\S]*?)\n\] as const/)?.[1] ?? "";
  assert.equal([...moduleSix.matchAll(/id: "web-/g)].length, 12);
  assert.match(moduleSix, /"web-01-projet-vscode"/);
  assert.match(moduleSix, /"web-12-publication"/);
  assert.doesNotMatch(moduleSix, /web-13-|web-20-/);
});
