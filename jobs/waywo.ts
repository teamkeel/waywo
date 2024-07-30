import { Waywo, JobContextAPI, models } from "@teamkeel/sdk";
import { ErrorCode, WebClient } from "@slack/web-api";
import { randomInt } from "crypto";

type ContextWithSlack = JobContextAPI & {
  slack: WebClient;
};

export default Waywo(async (ctx) => {
  const SLACK_TOKEN = ctx.secrets.SLACK_TOKEN;
  const CHANNEL_ID = ctx.secrets.CHANNEL_ID;

  if (!SLACK_TOKEN || !CHANNEL_ID) {
    throw new Error("Missing required secrets");
  }

  const today = new Date();
  const dayOfWeek = today.getDay();

  if (dayOfWeek === 6 || dayOfWeek === 0) {
    console.log("It's a weekend. Taking the day to recharge.");
    return;
  }

  const slack = new WebClient(SLACK_TOKEN);

  const members = await slack.conversations.members({
    channel: CHANNEL_ID,
  }).catch((error) => {
      if (error.code === ErrorCode.PlatformError) {
        // Log the extra information in a slack error error
        console.log("failed to list members", error.data);
      } 
      throw error;
    });

  const newCtx: ContextWithSlack = {
    ...ctx,
    slack,
  };

  if (!members.members?.length) {
    throw new Error("No members in channel: " + CHANNEL_ID);
  }

  // randomise the members array
  for (let i = members.members.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [members.members[i], members.members[j]] = [
      members.members[j],
      members.members[i],
    ];
  }

  // And pick the first active member
  for (const member of members.members) {
    const presence = await slack.users.getPresence({
      user: member,
    }).catch((error) => {
      if (error.code === ErrorCode.PlatformError) {
        console.log("failed to get user presense", error.data);
      } 
      throw error;
    });

    if (presence.presence == "active") {
      await sendRandomMessage(newCtx, member);
      break;
    }

    console.log(`Skipping member ${member} as they are ${presence.presence}`);
  }

  if (members.members.length == 0) {
    // No one is around
    const ok = await sendToSlack(
      newCtx,
      "Oh it looks like I'm the only one around... oh well. See you tomorrow I hope."
    );
    if (ok) console.log("Sent lonely message");
  }
});

const sendRandomMessage = async (ctx: ContextWithSlack, user: string) => {
  const messages = await models.message.findMany();
  if (messages.length == 0) {
    throw new Error("No messages set");
  }

  const randomIndex = randomInt(messages.length);
  const randomMessage = messages[randomIndex];

  const data = `Hey <@${user}>, ${randomMessage.message}`;

  const ok = await sendToSlack(ctx, data);
  if (ok) console.log("Sent message", data);
};

const sendToSlack = async (ctx: ContextWithSlack, message: string) => {
  return ctx.slack.chat
    .postMessage({
      channel: ctx.secrets.CHANNEL_ID,
      text: message,
      unfurl_links: false,
      unfurl_media: false,
    })
    .catch((error) => {
      if (error.code === ErrorCode.PlatformError) {
        console.log("failed to send", error.data);
      } 
      throw error;
    });
};
