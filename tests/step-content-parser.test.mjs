import assert from 'node:assert/strict';
import fs from 'node:fs';
import Module from 'node:module';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

Module._extensions['.ts'] = (loadedModule, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;

  loadedModule._compile(compiled, filename);
};
const parserPath = path.join(projectRoot, 'src', 'features', 'learning', 'step-content-parser.ts');
const parserSource = fs.readFileSync(parserPath, 'utf8');
const compiledParser = ts.transpileModule(parserSource, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const parserModule = new Module(parserPath);
parserModule.filename = parserPath;
parserModule.paths = Module._nodeModulePaths(path.dirname(parserPath));
parserModule._compile(compiledParser, parserPath);

const { parseStepContentBlocks } = parserModule.exports;

test('parses supported text blocks', () => {
  const result = parseStepContentBlocks([
    {
      id: 'text-1',
      contentType: 'TEXT',
      title: 'Introduction',
      content: '# Welcome',
    },
  ]);

  assert.deepEqual(result, [
    {
      id: 'text-1',
      title: 'Introduction',
      contentType: 'TEXT',
      markdown: '# Welcome',
    },
  ]);
});

test('preserves unknown content types as unsupported blocks', () => {
  const result = parseStepContentBlocks([
    {
      id: 'future-1',
      contentType: 'INTERACTIVE_SIMULATION',
      title: 'Simulation',
      content: '{}',
    },
  ]);

  assert.deepEqual(result, [
    {
      id: 'future-1',
      title: 'Simulation',
      contentType: 'UNSUPPORTED',
      originalContentType: 'INTERACTIVE_SIMULATION',
    },
  ]);
});

test('isolates malformed blocks and keeps valid siblings', () => {
  const result = parseStepContentBlocks([
    {
      id: 'text-1',
      contentType: 'TEXT',
      title: 'Valid block',
      content: 'Readable content',
    },
    {
      id: 'video-1',
      contentType: 'VIDEO',
      title: 'Broken video block',
      content: '{not-json',
    },
  ]);

  assert.equal(result.length, 2);
  assert.equal(result[0].contentType, 'TEXT');
  assert.equal(result[1].contentType, 'UNSUPPORTED');
  assert.equal(result[1].originalContentType, 'VIDEO');
});

test('uses a stable fallback ID for malformed blocks without IDs', () => {
  const result = parseStepContentBlocks([
    {
      contentType: 'TEXT',
      title: 'Missing ID',
      content: null,
    },
  ]);

  assert.equal(result[0].id, 'unsupported-0');
  assert.equal(result[0].contentType, 'UNSUPPORTED');
});

test('returns an empty list for a non-array payload', () => {
  assert.deepEqual(parseStepContentBlocks(null), []);
  assert.deepEqual(parseStepContentBlocks({ items: [] }), []);
});
