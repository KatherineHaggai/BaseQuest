# BaseQuest

BaseQuest is a vivid Base mini app for publishing quests, collecting proof of work, and distributing rewards through a lightweight event-driven protocol.

Repository: [https://github.com/KatherineHaggai/BaseQuest.git](https://github.com/KatherineHaggai/BaseQuest.git)

## Overview

BaseQuest helps creators publish simple onchain quests with short content and reward points.

Participants can submit proof strings for active quests.

Quest creators can accept winning submissions and close quests when a winner has been selected.

The app is designed around a small contract surface and clear event-driven interactions.

## Contract

- Network: Base Mainnet
- Address: `0x3035E8B39a5bBd98AE71E29672C6e0D47E121e59`

## Features

- Create quests with short onchain content.
- Assign reward points to quests.
- Submit proof strings for active quests.
- Accept winning submissions.
- Close quests after accepting a winner.
- Use hardcoded Base and Talent verification meta tags.
- Track transaction attribution for confirmed writes.
- Keep quest actions simple and easy to follow.

## Getting Started

Clone the repository:

```bash
git clone https://github.com/KatherineHaggai/BaseQuest.git
```

Move into the project directory:

```bash
cd BaseQuest
```

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Open the local URL printed by the development server in your browser.
