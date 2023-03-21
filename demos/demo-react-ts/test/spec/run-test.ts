// @ts-expect-error module not typed
import JasmineDOM from "@testing-library/jasmine-dom/dist";

beforeAll(() => {
  (jasmine.getEnv() as any).addMatchers(JasmineDOM);
});
