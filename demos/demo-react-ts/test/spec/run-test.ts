// @ts-expect-error module not typed
import JasmineDOM from "@testing-library/jasmine-dom/dist";
import { configure } from "@testing-library/react";

beforeAll(() => {
  configure({ testIdAttribute: "data-test-id" });

  (jasmine.getEnv() as any).addMatchers(JasmineDOM);
});
