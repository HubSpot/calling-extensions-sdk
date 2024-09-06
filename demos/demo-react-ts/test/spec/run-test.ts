// @ts-expect-error module not typed
import JasmineDOM from "@testing-library/jasmine-dom/dist";
import { configure } from "@testing-library/react";

async function setupTestEnv() {
  configure({ testIdAttribute: "data-test-id" });

  beforeAll(() => {
    (jasmine.getEnv() as any).addMatchers(JasmineDOM);
  });
}

setupTestEnv().catch((err) =>
  setTimeout(() => {
    throw err;
  })
);
