import { jobs, actions, resetDatabase, models } from "@teamkeel/testing";
import { test, beforeEach, expect } from "vitest";

beforeEach(resetDatabase);

test("Run waywo job", async () => {
  await actions.createMessage({
    message: "let's see the fun stuff you've been up to",
  });
  await actions.createMessage({
    message: "please give us a peek behind the curtain of your wonderful work",
  });

  const messagesInfo = await models.message.findMany();
  const messages = messagesInfo.map((m) => m.message);

  expect(messages).toContain(
    "please give us a peek behind the curtain of your wonderful work"
  );
  await jobs.waywo();
});
