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

## Usage

Use the app to create a new quest with concise quest content and a point reward.

Once a quest is active, participants can submit proof as text.

Review submitted proof strings from participants.

Accept the winning submission when the proof satisfies the quest requirements.

After a submission is accepted, the quest can be closed.

Confirmed write actions are tracked for attribution.

## Project Structure

The repository contains the source code for the BaseQuest mini app.

The app integrates with the deployed Base Mainnet contract listed above.

Local development is handled with npm scripts.

## Development Notes

Make sure dependencies are installed before running the development server.

The contract address is fixed to the Base Mainnet deployment shown in this README.

Quest content is intentionally short and suited for onchain publishing.

Proof submissions are represented as strings.

Reward values are represented as points.

The app includes Base and Talent verification meta tags.
