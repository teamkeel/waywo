import { jobs, actions, resetDatabase } from "@teamkeel/testing";
import { test, expect, beforeEach } from "vitest";

beforeEach(resetDatabase);

test("Run waywo job", async () => {
  await jobs.waywo();
});
