import assert from "node:assert/strict";
import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadTypeScriptModule(relativePath, mocks) {
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

  const originalRequire = loadedModule.require.bind(loadedModule);
  loadedModule.require = (specifier) =>
    Object.hasOwn(mocks, specifier) ? mocks[specifier] : originalRequire(specifier);

  loadedModule._compile(compiled, absolutePath);
  return loadedModule.exports;
}

let capturedRequest;

const service = loadTypeScriptModule("src/features/journeys/journeys-service.ts", {
  "../../core/constants/app.constants": {
    API_ROUTES: {
      journeys: {
        completeActivity: (enrollmentId, activityId) =>
          "/journeys/enrollments/" + enrollmentId + "/activities/" + activityId + "/complete",
      },
    },
    HTTP_METHODS: { POST: "POST" },
  },
  "../../core/api/api-client": {
    apiRequest: async (_path, _parser, options) => {
      capturedRequest = options;
      return {
        data: {
          activityId: 22,
          status: "COMPLETED",
          completedAt: "2026-11-17T00:00:00.000Z",
          stageCompleted: false,
          nextStagePosition: null,
        },
      };
    },
  },
});

test("completion key is stable for the same logical activity", () => {
  const first = service.createJourneyActivityIdempotencyKey(11, 22);
  const retry = service.createJourneyActivityIdempotencyKey(11, 22);

  assert.equal(first, "journey-activity-completion:11:22");
  assert.equal(retry, first);
});

test("completion keys differ between activities and enrollments", () => {
  assert.notEqual(
    service.createJourneyActivityIdempotencyKey(11, 22),
    service.createJourneyActivityIdempotencyKey(11, 23),
  );
  assert.notEqual(
    service.createJourneyActivityIdempotencyKey(11, 22),
    service.createJourneyActivityIdempotencyKey(12, 22),
  );
});

test("completion key rejects invalid identifiers", () => {
  assert.throws(() => service.createJourneyActivityIdempotencyKey(0, 22));
  assert.throws(() => service.createJourneyActivityIdempotencyKey(11, -1));
  assert.throws(() => service.createJourneyActivityIdempotencyKey(1.5, 22));
  assert.throws(() => service.createJourneyActivityIdempotencyKey(Number.MAX_SAFE_INTEGER + 1, 22));
});

test("completion request sends the stable idempotency key through the API client", async () => {
  capturedRequest = undefined;

  const result = await service.journeysService.completeActivity(11, 22);

  assert.equal(result.activityId, 22);
  assert.equal(capturedRequest.method, "POST");
  assert.equal(
    capturedRequest.idempotencyKey,
    "journey-activity-completion:11:22",
  );
});
