import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const sourceRoot = path.join(root, "src");
const extensions = [".ts", ".tsx", ".js", ".jsx"];

function collectFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectFiles(absolutePath);
    return /\.(ts|tsx|js|jsx)$/.test(entry.name) && !entry.name.endsWith(".d.ts")
      ? [absolutePath]
      : [];
  });
}

function resolveLocalModule(importer, specifier) {
  let candidate;
  if (specifier.startsWith("@/")) {
    candidate = path.join(sourceRoot, specifier.slice(2));
  } else if (specifier.startsWith(".")) {
    candidate = path.resolve(path.dirname(importer), specifier);
  } else {
    return null;
  }

  const candidates = [
    candidate,
    ...extensions.map((extension) => candidate + extension),
    ...extensions.map((extension) => path.join(candidate, "index" + extension)),
  ];

  return candidates.find((item) => {
    try {
      return fs.statSync(item).isFile();
    } catch {
      return false;
    }
  }) ?? null;
}

function featureOf(filePath) {
  const relative = path.relative(sourceRoot, filePath).split(path.sep);
  return relative[0] === "features" ? relative[1] : null;
}

const files = collectFiles(sourceRoot);
const featureGraph = new Map();
const violations = [];

for (const filePath of files) {
  const relativePath = path.relative(root, filePath);
  const source = fs.readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

  const importerFeature = featureOf(filePath);
  if (importerFeature) featureGraph.set(filePath, []);

  function inspectSpecifier(specifier, line) {
    const targetPath = resolveLocalModule(filePath, specifier);
    if (!targetPath) return;

    const targetFeature = featureOf(targetPath);
    const targetRelativePath = path.relative(sourceRoot, targetPath);

    if (importerFeature && targetRelativePath.startsWith("app" + path.sep)) {
      violations.push(
        relativePath + ":" + line + " imports app implementation '" +
        targetRelativePath + "'. Features must receive navigation actions through typed props.",
      );
    }

    if (importerFeature && targetFeature && importerFeature !== targetFeature) {
      violations.push(
        relativePath + ":" + line + " imports another feature (" +
        importerFeature + " -> " + targetFeature + "). Use app composition and public APIs.",
      );
    }

    const isCoreOrShared =
      relativePath.startsWith("src/core/") ||
      relativePath.startsWith("src/shared/");
    if (isCoreOrShared && targetFeature) {
      violations.push(
        relativePath + ":" + line + " imports feature implementation '" +
        path.relative(root, targetPath) + "'. Core/shared must remain feature-agnostic.",
      );
    }

    if (relativePath.startsWith("src/app/") && targetFeature) {
      const expectedEntry = path.join(sourceRoot, "features", targetFeature, "index.ts");
      if (targetPath !== expectedEntry) {
        violations.push(
          relativePath + ":" + line + " imports feature internals. Import from " +
          path.relative(root, expectedEntry) + " instead.",
        );
      }
    }

    if (importerFeature && targetFeature === importerFeature) {
      featureGraph.get(filePath).push(targetPath);
    }
  }

  function visit(node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
      inspectSpecifier(node.moduleSpecifier.text, line);
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length === 1 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
      inspectSpecifier(node.arguments[0].text, line);
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

const visiting = new Set();
const visited = new Set();
const reportedCycles = new Set();

function visitGraph(node, stack) {
  if (visiting.has(node)) {
    const start = stack.indexOf(node);
    const cycle = [...stack.slice(start), node]
      .map((item) => path.relative(root, item));
    const signature = [...cycle].sort().join("|");
    if (!reportedCycles.has(signature)) {
      reportedCycles.add(signature);
      violations.push("Circular feature dependency: " + cycle.join(" -> "));
    }
    return;
  }
  if (visited.has(node)) return;

  visiting.add(node);
  for (const dependency of featureGraph.get(node) ?? []) {
    if (featureGraph.has(dependency)) visitGraph(dependency, [...stack, node]);
  }
  visiting.delete(node);
  visited.add(node);
}

for (const filePath of featureGraph.keys()) visitGraph(filePath, []);

if (violations.length > 0) {
  console.error("Architecture fitness check failed:");
  for (const violation of violations) console.error(" - " + violation);
  process.exitCode = 1;
} else {
  console.log("Architecture fitness check passed: feature boundaries and dependency cycles are valid.");
}
