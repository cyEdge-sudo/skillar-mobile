import assert from 'node:assert/strict';
import fs from 'node:fs';
import Module from 'node:module';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const originalLoad = Module._load;
Module._load = (request, parent, isMain) => {
  if (request === 'react-native') {
    return {
      Platform: {
        OS: 'ios',
        select: (spec) => (spec.ios !== undefined ? spec.ios : spec.default),
      },
      StyleSheet: {
        create: (s) => s,
      },
    };
  }
  return originalLoad(request, parent, isMain);
};

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

function loadTypeScriptModule(relativePath) {
  const absolutePath = path.join(projectRoot, relativePath);
  const source = fs.readFileSync(absolutePath, 'utf8');
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

const { lightTheme } = loadTypeScriptModule('src/shared/theme/themes/light-theme.ts');
const { darkTheme } = loadTypeScriptModule('src/shared/theme/themes/dark-theme.ts');
const { palette } = loadTypeScriptModule('src/shared/theme/tokens/palette.ts');
const { spacing } = loadTypeScriptModule('src/shared/theme/tokens/spacing.ts');
const { radius } = loadTypeScriptModule('src/shared/theme/tokens/radius.ts');
const { typography } = loadTypeScriptModule('src/shared/theme/themes/typography.ts');
const { elevation } = loadTypeScriptModule('src/shared/theme/tokens/elevation.ts');

test('palette exports Skillar purple brand ramps matching web tokens', () => {
  assert.equal(palette.brand[600], '#6C47FF');
  assert.equal(palette.brand[700], '#5835E8');
  assert.equal(palette.light.primary, '#6C47FF');
  assert.equal(palette.light.primaryPressed, '#5835E8');
  assert.equal(palette.dark.primary, '#7C5CFF');
});

test('semantic feedback ramps meet WCAG AA 700-level signals for light mode', () => {
  assert.equal(lightTheme.feedback.success.signal, '#15803D');
  assert.equal(lightTheme.feedback.warning.signal, '#A16207');
  assert.equal(lightTheme.feedback.error.signal, '#B91C1C');
  assert.equal(lightTheme.feedback.info.signal, '#1D4ED8');

  // Verify surface and border ramps exist
  assert.ok(lightTheme.feedback.success.surface);
  assert.ok(lightTheme.feedback.success.border);
});

test('spacing tokens adhere to 4px grid steps and touch target requirements', () => {
  assert.equal(spacing[0], 0);
  assert.equal(spacing[1], 4);
  assert.equal(spacing[2], 8);
  assert.equal(spacing[3], 12);
  assert.equal(spacing[4], 16);
  assert.equal(spacing[5], 20);
  assert.equal(spacing[6], 24);
  assert.equal(spacing[8], 32);
  assert.equal(spacing[10], 40);
  assert.equal(spacing[12], 48);
  assert.equal(spacing[16], 64);
  assert.equal(spacing.gutter, 16);
  assert.equal(spacing.minTouchTarget, 44);
});

test('radius scale defines canonical geometric boundaries', () => {
  assert.equal(radius.sm, 4);
  assert.equal(radius.md, 8);
  assert.equal(radius.lg, 12);
  assert.equal(radius.xl, 16);
  assert.equal(radius.full, 9999);
});

test('typography exports all 8 mobile tiers with proper font sizes and line heights', () => {
  const tiers = ['display', 'h1', 'h2', 'h3', 'h4', 'bodyLg', 'body', 'sm'];
  for (const tier of tiers) {
    assert.ok(typography[tier], `Missing typography tier: ${tier}`);
    assert.ok(typography[tier].fontSize > 0);
    assert.ok(typography[tier].lineHeight >= typography[tier].fontSize);
  }

  // Legacy aliases
  assert.ok(typography.bodyLarge);
  assert.ok(typography.bodyMedium);
  assert.ok(typography.bodySmall);
});

test('theme contracts maintain complete parity between light and dark modes', () => {
  assert.equal(lightTheme.mode, 'light');
  assert.equal(lightTheme.isDark, false);
  assert.equal(darkTheme.mode, 'dark');
  assert.equal(darkTheme.isDark, true);

  const lightColorKeys = Object.keys(lightTheme.colors).sort();
  const darkColorKeys = Object.keys(darkTheme.colors).sort();
  assert.deepEqual(lightColorKeys, darkColorKeys);

  // Elevation keys parity
  const elevationKeys = ['none', 'small', 'medium', 'large', 'extraLarge'];
  for (const key of elevationKeys) {
    assert.ok(lightTheme.elevation[key]);
    assert.ok(darkTheme.elevation[key]);
  }
});
