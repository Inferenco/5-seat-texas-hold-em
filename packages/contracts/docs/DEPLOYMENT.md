# Deployment Guide - 5-Seat Texas Hold'em

## Latest Deployment

**Version:** 3.0.0 (Bug Fixes + Admin Controls + Frontend Enhancements)  
**Date:** 2025-12-22  
**Network:** Cedra Testnet

### Contract Address
```
0xb45d818331ec975fd8257851594c43ab9e3ebac0c6934993c09f4b6cdf3a574b
```

### Transaction
- **Hash:** `0x1805400f836f03f7f453b465428c4aaaa2d2cc3527380c745f35296baabfbfb5`
- **Explorer:** [View on Cedrascan](https://cedrascan.com/txn/0x1805400f836f03f7f453b465428c4aaaa2d2cc3527380c745f35296baabfbfb5?network=testnet)
- **Status:** ✅ Executed successfully
- **Gas Used:** 26,151 units

### Deployed Modules
- `chips` - Chip token system (FA-based)
- `hand_eval` - Hand evaluation logic
- `pot_manager` - Pot & side pot management
- `poker_events` - 25 event types
- `texas_holdem` - Core game logic with admin controls

### Profile
- **Name:** `holdem_deployer_V1`
- **Network:** Testnet

### Changes in v3.0.0
- Fixed 8 contract bugs (chip deposits, fee transfers, config validation, etc.)
- Added admin controls (pause, kick, update settings)
- Added missed blinds tracking
- Added dead button support
- Enhanced event coverage (HandStarted event)
- 70 unit tests passing

---

## Quick Start

```bash
# Set contract address
export ADDR=0xb45d818331ec975fd8257851594c43ab9e3ebac0c6934993c09f4b6cdf3a574b

# Buy chips (0.1 CEDRA = 100 chips)
cedra move run --function-id $ADDR::chips::buy_chips \
  --args u64:100000000 --profile holdem_deployer_V1

# Create table (5/10 blinds, 100-10000 buy-in, no ante, straddle enabled)
cedra move run --function-id $ADDR::texas_holdem::create_table \
  --args u64:5 u64:10 u64:100 u64:10000 address:$ADDR u64:0 bool:true \
  --profile holdem_deployer_V1

# Join table at seat 0 with 500 chips
cedra move run --function-id $ADDR::texas_holdem::join_table \
  --args address:<TABLE_ADDR> u64:0 u64:500 --profile holdem_deployer_V1

# Start hand
cedra move run --function-id $ADDR::texas_holdem::start_hand \
  --args address:<TABLE_ADDR> --profile holdem_deployer_V1
```

---

## Previous Deployments

| Version | Date | Address | Profile | Notes |
|---------|------|---------|---------|-------|
| 1.0.0 | 2025-12-21 | `0x736ddb...557b` | holdem_testnet | Initial edge-case fixes |
| 2.0.0 | 2025-12-21 | `0x88d4e4...665f` | holdem_v2 | Frontend integration |
| 3.0.0 | 2025-12-22 | `0xb45d81...574b` | holdem_deployer_V1 | Bug fixes + Admin controls |

---

## Redeployment

```bash
# Create new profile
cedra init --profile <name> --network testnet

# Deploy
cedra move publish --profile <name> \
  --named-addresses holdemgame=<profile_address> --assume-yes
```

---

## Frontend Configuration

Update `packages/frontend/.env` with the new contract address:
```
VITE_CONTRACT_ADDRESS=0xb45d818331ec975fd8257851594c43ab9e3ebac0c6934993c09f4b6cdf3a574b
```
