import assert from "node:assert/strict";
import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadTypeScriptModule(relativePath) {
  const absolutePath = path.join(projectRoot, relativePath);
  const source = fs.readFileSync(absolutePath, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;

  const loadedModule = new Module(absolutePath);
  loadedModule.filename = absolutePath;
  loadedModule.paths = Module._nodeModulePaths(path.dirname(absolutePath));
  loadedModule._compile(compiled, absolutePath);

  return loadedModule.exports;
}

const { isValidDateOnly, isValidEmail, normalizeEmail } = loadTypeScriptModule(
  "src/core/auth/input-validation.ts",
);

test("normalizes email input consistently", () => {
  assert.equal(
    normalizeEmail("  Learner.Name+Tag@Example.COM  "),
    "learner.name+tag@example.com",
  );
});

test("validates normalized email addresses", () => {
  assert.equal(isValidEmail(normalizeEmail(" learner@example.co.in ")), true);
  assert.equal(isValidEmail(normalizeEmail("not-an-email")), false);
  assert.equal(isValidEmail(normalizeEmail("learner @example.com")), false);
  assert.equal(isValidEmail(normalizeEmail("learner@example")), false);
});

test("validates real calendar dates in YYYY-MM-DD format", () => {
  assert.equal(isValidDateOnly("2024-02-29"), true);
  assert.equal(isValidDateOnly("2024-04-30"), true);
  assert.equal(isValidDateOnly("2023-02-29"), false);
  assert.equal(isValidDateOnly("2024-04-31"), false);
  assert.equal(isValidDateOnly("2024-2-03"), false);
  assert.equal(isValidDateOnly("not-a-date"), false);
  assert.equal(isValidDateOnly(""), false);
});

test("handles four-digit years below 0100 without Date.UTC year coercion", () => {
  assert.equal(isValidDateOnly("0001-01-01"), true);
});
