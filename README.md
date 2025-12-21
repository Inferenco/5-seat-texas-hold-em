# 5-Seat Texas Hold'em

A decentralized 5-seat Texas Hold'em poker game built on the Cedra blockchain with Move smart contracts and a React frontend.

## 📁 Project Structure

```
5-seat-texas-holdem/
├── packages/
│   ├── contracts/          # Move smart contracts
│   │   ├── sources/        # Contract source files
│   │   ├── tests/          # Contract tests
│   │   ├── docs/           # Contract documentation
│   │   └── Move.toml       # Move package config
│   └── frontend/           # React + TypeScript frontend
│       ├── src/            # Frontend source code
│       └── package.json    # Frontend dependencies
├── package.json            # Workspace root config
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Cedra CLI](https://github.com/cedra-labs/cedra-framework) for smart contract development

### Installation

```bash
# Install all dependencies (from root)
npm install
```

### Development

#### Frontend

```bash
# Start the frontend development server
npm run dev
```

#### Smart Contracts

```bash
# Compile contracts
npm run contracts:compile

# Run contract tests
npm run contracts:test
```

## 📜 Smart Contracts

The Move smart contracts handle:

- **`texas_holdem.move`** - Core game logic (table management, betting, hand progression)
- **`chips.move`** - Chip/token management
- **`hand_eval.move`** - Poker hand evaluation
- **`pot_manager.move`** - Pot calculation and side pot management
- **`poker_events.move`** - On-chain event emissions

See [`packages/contracts/docs/DOCUMENTATION.md`](packages/contracts/docs/DOCUMENTATION.md) for detailed contract documentation.

## 🎮 Frontend

The React frontend provides:

- Wallet connection
- Table browsing and creation
- Real-time game interface
- Player actions (fold, check, call, raise)

## 📄 License

MIT
