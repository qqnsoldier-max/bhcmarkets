import { describe, expect, it } from "bun:test";

describe("smoke", () => {
  it("adds numbers correctly", () => {
    expect(1 + 1).toBe(2);
  });

  it("string contains substring", () => {
    expect("bhcmarkets").toContain("bhc");
  });
});
