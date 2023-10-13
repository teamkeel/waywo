import { Waywo, JobContextAPI } from "@teamkeel/sdk";
import { WebClient } from "@slack/web-api";
import { error } from "console";
import fetch from "node-fetch";

// Todo, move this to a db so we can easily add to it
const messages = [
  "what are you working on?",
  "you're up! Show us what you're working on.",
  "it's time to show the class what's on your screen!",
  "let's see those smart ideas you're working on :bulb:",
  "what goodies are you cookin'? :cupcake:",
  "the stage is yours. What are you working on?",
  "it's your time to shine :gem:, what are you working on?",
  "show us the good stuff! :drum_with_drumsticks:",
  "please give us a peek behind the curtain of your wonderful work",
  "it's time to grab a :coffee: and show off what you're working on!",
  "what delights are you working on? :sparkles:",
  "come :rain_cloud: or shine your work is looking fine! Please can we have a peak?",
  "SHOW US! SHOW US! SHOW US!",
  "let's make a deal - you show us what you're working on and Benoit will bake you a :birthday:. You in?",
  "Roses are red, Violets are blue, I pick someone to share their work and today it's you!",
  "I just saw what you're working on  and woah it's cool! Wanna show everyone else?",
  "I think I can see the future. You're about to show us what you're working on :crystal_ball:",
  "you've won the :trophy: for the best thing being worked on _right now_! Send us a screenshot and I'll frame it",
];

export default Waywo(async (ctx) => {
  const SLACK_TOKEN = ctx.secrets.SLACK_TOKEN;
  const SLACK_URL = ctx.secrets.SLACK_URL;
  const CHANNEL_ID = ctx.secrets.CHANNEL_ID;

  if (!SLACK_TOKEN || !SLACK_URL || !CHANNEL_ID) {
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
  });

  if (!members.members?.length) {
    throw new error("No members in channel: " + CHANNEL_ID);
  }

  while (members.members.length > 0) {
    const randomIndex = Math.floor(Math.random() * members.members.length);
    const randomMember = members.members[randomIndex];

    const presence = await slack.users.getPresence({
      user: randomMember,
    });

    if (presence.presence == "active") {
      await sendRandomMessage(ctx, randomMember);
      break;
    }

    console.log(
      `Skipping members ${randomMember} as they are ${presence.presence}`
    );

    members.members.splice(randomIndex, 1);
  }

  if (members.members.length == 0) {
    // No one is around
    const ok = await sendToSlack(
      ctx,
      "Oh it looks like I'm the only one around... oh well. See you tomorrow I hope."
    );
    if (ok) console.log("Sent lonely message");
  }
});

const sendRandomMessage = async (ctx: JobContextAPI, user: string) => {
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  const data = `Hey <@${user}>, ${randomMessage}`;

  const ok = await sendToSlack(ctx, data);

  if (ok) console.log("Sent message", data);
};

const sendToSlack = (ctx: JobContextAPI, message: string) => {
  return fetch(ctx.secrets.SLACK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: message,
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        const text = await response.text();
        console.log("Slack response:", text);
        throw new Error(
          `Failed to send slack message. status: ${response.status}`
        );
      }
      return response.ok;
    })
    .catch((error) => console.error("Fetch Error:", error));
};
