import { test, expect } from "vitest";

const sum = (a: number, b: number) => a + b;

test("some random shit", () => {
  expect(sum(1, 4)).toBe(5);
});
