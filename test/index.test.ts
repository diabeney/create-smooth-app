import { test, expect } from "vitest";
import { resolveProjectDir } from "../src/utils/main.js";
import { validatePackageName } from "../src/utils/main.js";

test("validates package names", () => {
  expect(validatePackageName("he")).toBeTruthy();
  expect(validatePackageName("my-app")).toBeTruthy();
  expect(validatePackageName(" ")).toBeFalsy();
});

test("resolves project path", () => {
  expect(resolveProjectDir(".")).toMatch(/smoothjs/);
  expect(resolveProjectDir("my-smooth-app")).toMatch("my-smooth-app");
  expect(() => resolveProjectDir("$invalid")).toThrowError(
    "Invalid package name"
  );
});

test("my random regexp", () => {
  expect(/--\w+=/.test("--template=")).toBe(true);
  expect("--template=".match(/--\w+=/)).toBeTruthy();
  expect("--template=".replace(/(--|=)/g, "")).toBe("template");
});
