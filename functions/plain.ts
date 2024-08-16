import { models, Plain } from "@teamkeel/sdk";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { PlainClient } from "@team-plain/typescript-sdk";

const prompt = `
You are support agent filtering incoming emails. 

We have been getting mysterious spam emails where the emails look like normal emails but all contain nonsensical hyphenated words. 
Some examples of these words:
goose-wheel
eager-slabs
spite-metal
hurry-sugar
heavy-uncle
doing-parts
cloth-white
might-blood
climb-track
value-solar
depth-paper
would-small

This is not an exhaustive list. There will also be other words that are similar but they will all be hyphenated. 

For a given email please respond "flagged" = true if it contains these strange trigger words and false if not.

Only use the schema for matchResponse.
`;

// To learn more about what you can do with custom functions, visit https://docs.keel.so/functions
export default Plain(async (ctx, inputs) => {
  console.log(inputs);

  const content = inputs.payload?.email?.textContent;
  const from = inputs.payload?.email?.from;
  const threadId = inputs.payload?.thread?.id;

  const client = new OpenAI({
    apiKey: ctx.secrets.OPENAI_KEY,
  });

  const Response = z.object({
    flagged: z.boolean(),
  });

  const completion = await client.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    messages: [
      {
        role: "system",
        content: prompt,
      },
      { role: "user", content },
    ],
    response_format: zodResponseFormat(Response, "matchResponse"),
  });

  const message = completion.choices[0]?.message;
  if (!message?.parsed) {
    throw new Error(`failed to parse: ${message.refusal}`);
  }

  console.log("flagged", message.parsed.flagged);

  await models.spam.create({
    from: from?.email ?? "",
    message: content,
    flagged: message.parsed.flagged,
  });

  if (!message.parsed.flagged) {
    console.log("Not flagged, returning");
    return;
  }

  // TODO do something with plain

  const plain = new PlainClient({
    apiKey: ctx.secrets.PLAIN_API_KEY,
  });

  const labelTypeIds = await plain.addLabels({
    threadId,
    labelTypeIds: ["lt_01J1SQMP39YMQ9RJG5PEDSR3M9"], // "Weird AI tag"
  });

  if (labelTypeIds.error) {
    throw new Error(labelTypeIds.error.message);
  }

  console.log("Label added to thread");

  const done = await plain.markThreadAsDone({
    threadId,
  });

  if (done.error) {
    throw new Error(done.error.message);
  }

  console.log("Thread marked as done");

  return;
});
