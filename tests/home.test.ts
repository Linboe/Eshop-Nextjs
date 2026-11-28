import { describe, expect, it } from "vitest";

describe("home page", () => {
  it("returns status 200", async () => {
    const response = await fetch("http://127.0.0.1:3000/");

    expect(response.status).toBe(200);
  });
});
