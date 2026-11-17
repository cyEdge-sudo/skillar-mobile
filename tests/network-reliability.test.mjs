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

class TestApiError extends Error {
  constructor(status, code) {
    super(code);
    this.status = status;
    this.code = code;
  }
}

const constants = {
  API_ERROR_CODES: {
    REQUEST_CANCELLED: "REQUEST_CANCELLED",
  },
  APP_CONSTANTS: {
    QUERY_RETRY_COUNT: 1,
  },
};

const retryPolicy = loadTypeScriptModule("src/core/api/query-retry.ts", {
  "../constants/app.constants": constants,
  "./api-error": { ApiError: TestApiError },
});

const environment = loadTypeScriptModule("src/core/config/env.ts", {
  "../api/api-error": {
    ApiError: class extends Error {
      static network(_code, message) {
        return new Error(message);
      }
    },
  },
  "../constants/app.constants": {
    API_ERROR_CODES: { CONFIGURATION_ERROR: "CONFIGURATION_ERROR" },
    APP_CONSTANTS: { API_VERSION_PREFIX: "/api/v1" },
    APP_MESSAGES: { apiNotConfigured: "API is not configured." },
  },
});

test("production API base URLs require HTTPS", () => {
  assert.equal(environment.isAllowedApiBaseUrl("https://api.example.com", true), true);
  assert.equal(environment.isAllowedApiBaseUrl("http://api.example.com", true), false);
});

test("development API base URLs permit HTTP for local development", () => {
  assert.equal(environment.isAllowedApiBaseUrl("http://10.0.2.2:3000", false), true);
  assert.equal(environment.isAllowedApiBaseUrl("https://api.example.com", false), true);
});

test("API base URL rejects invalid schemes, credentials, queries, and fragments", () => {
  assert.equal(environment.isAllowedApiBaseUrl("ftp://api.example.com", false), false);
  assert.equal(environment.isAllowedApiBaseUrl("https://user:pass@api.example.com", false), false);
  assert.equal(environment.isAllowedApiBaseUrl("https://api.example.com?tenant=one", false), false);
  assert.equal(environment.isAllowedApiBaseUrl("https://api.example.com#fragment", false), false);
  assert.equal(environment.isAllowedApiBaseUrl("not a URL", false), false);
});

test("API URL builder applies the version prefix", () => {
  assert.equal(environment.getApiUrl("/me"), "/api/v1/me");
});

test("query retry policy retries transient network and server failures", () => {
  assert.equal(retryPolicy.shouldRetryQuery(0, new TestApiError(0, "NETWORK_ERROR")), true);
  assert.equal(retryPolicy.shouldRetryQuery(0, new TestApiError(408, "HTTP_ERROR")), true);
  assert.equal(retryPolicy.shouldRetryQuery(0, new TestApiError(429, "HTTP_ERROR")), true);
  assert.equal(retryPolicy.shouldRetryQuery(0, new TestApiError(503, "HTTP_ERROR")), true);
});

test("query retry policy does not retry cancellation or client errors", () => {
  assert.equal(
    retryPolicy.shouldRetryQuery(0, new TestApiError(0, "REQUEST_CANCELLED")),
    false,
  );
  assert.equal(retryPolicy.shouldRetryQuery(0, new TestApiError(401, "HTTP_ERROR")), false);
  assert.equal(retryPolicy.shouldRetryQuery(0, new TestApiError(403, "HTTP_ERROR")), false);
  assert.equal(retryPolicy.shouldRetryQuery(1, new TestApiError(503, "HTTP_ERROR")), false);
});

test("query retry policy uses capped exponential backoff", () => {
  assert.equal(retryPolicy.getQueryRetryDelay(0), 1_000);
  assert.equal(retryPolicy.getQueryRetryDelay(1), 2_000);
  assert.equal(retryPolicy.getQueryRetryDelay(4), 16_000);
  assert.equal(retryPolicy.getQueryRetryDelay(10), 30_000);
});
