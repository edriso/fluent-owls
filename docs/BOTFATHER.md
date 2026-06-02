# BotFather setup (copy and paste)

Ready-to-paste text for the Fluent Owls bot in @BotFather (the `/mybots` ->
Edit Bot menu). The public texts are English. Copy each block as-is.

Note: the bot self-sets its About + Description on start (via the Bot API), so
those two are kept in sync from the code (see `botAbout` / `botDescription` in
`src/bot.ts`). The command list is still pasted by hand — this bot does NOT set
its commands automatically, so paste the Commands block below into BotFather to
get the menu.

- Bot channel: **@fluent_owls**

---

## Name

Fluent Owls

## About

(BotFather "Edit About", max ~120 characters. Shown on the bot's profile.)

Daily English quizzes 🦉 Three a day, beginner to advanced, each with an explanation. Tap Start to join the channel.

## Description

(BotFather "Edit Description", max ~512 characters. Shown on the empty-chat
start screen, before the user presses Start.)

🦉 Hi! Fluent Owls posts three short English quizzes to its Telegram channel every afternoon: a beginner warm-up, an intermediate question, and an advanced challenge.
Each is a quick fill-in-the-blank sentence. Tap the word that fits, then Telegram reveals the correct answer and a short explanation right after you vote.
Vocabulary, collocations, idioms, grammar, and more, organized by CEFR level (A1 to C2). No signup, nothing to install.
Tap Start for the channel link.

---

## Commands

When BotFather says "Send me a list of commands", paste exactly this block
(no leading slashes, one command per line, `command - description`):

start - What Fluent Owls is and how to join the channel
about - About this open-source bot

---

## Other settings

- Botpic: optional, set your own image in BotFather.
- Privacy Policy: optional. The bot stores nothing about users (no database,
  no saved votes). If you publish a policy, host a short page saying that and
  set its URL in BotFather. Not required.
- Group privacy: this bot only posts to a channel and answers /start in DM,
  so you can leave group privacy ON (the default).
