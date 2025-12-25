# Deployment Guide - 5-Seat Texas Hold'em

## Latest Deployment

**Version:** 5.0.0 (Global Fee Collector)  
**Date:** 2025-12-25  
**Network:** Cedra Testnet

### Contract Address
```
0x238498191305e2ff17c9d5dc6a09832ca11e3d0238fd68cd190d0ce01a012d5a
```

### Fee Configuration
- **Fee Collector:** `0xb40f35d81198adc541df553d429653fdffc32163e44228433d7d2ec0fa05bf87`
- **Fee Admin:** `0x238498191305e2ff17c9d5dc6a09832ca11e3d0238fd68cd190d0ce01a012d5a`

### Transaction
- **Deploy Hash:** `0xd1944df49ebf28fdb3a1d6279f2824cdd4abb299b33e5f1ecf4a4f59a018903c`
- **Fee Init Hash:** `0xcb23ebf56338854bd106dee82f241aea8b0c647f3198ce52f7a001319be863b8`
- **Explorer:** [View on Cedrascan](https://cedrascan.com/txn/0xd1944df49ebf28fdb3a1d6279f2824cdd4abb299b33e5f1ecf4a4f59a018903c?network=testnet)
- **Status:** ✅ Executed successfully
- **Gas Used:** 27,352 units

### Deployed Modules
- `chips` - Chip token system (FA-based)
- `hand_eval` - Hand evaluation logic
- `pot_manager` - Pot & side pot management
- `poker_events` - 25 event types
- `texas_holdem` - Core game logic with admin controls + global fee config

### Profile
- **Name:** `holdem_deployer_v4`
- **Network:** Testnet

### Changes in v5.0.0
- **Global Fee Collector:** Fee recipient is now a global config, not per-table
- Added `init_fee_config(deployer, fee_collector)` - one-time setup after deployment
- Added `update_fee_collector(admin, new_collector)` - change fee collector
- Added `transfer_fee_admin(admin, new_admin)` - transfer fee admin rights
- Added view functions: `get_fee_collector()`, `get_fee_admin()`, `is_fee_config_initialized()`
- Removed `fee_recipient` parameter from `create_table`
- Leave Table button now works in WAITING phase (before hand starts)

---

## Quick Start

```bash
# Set contract address
export ADDR=0x238498191305e2ff17c9d5dc6a09832ca11e3d0238fd68cd190d0ce01a012d5a

# Buy chips (0.1 CEDRA = 100 chips)
cedra move run --function-id $ADDR::chips::buy_chips \
  --args u64:100000000 --profile holdem_deployer_v4

# Create table (5/10 blinds, 100-10000 buy-in, no ante, straddle enabled)
cedra move run --function-id $ADDR::texas_holdem::create_table \
  --args u64:5 u64:10 u64:100 u64:10000 u64:0 bool:true \
  --profile holdem_deployer_v4

# Join table at seat 0 with 500 chips
cedra move run --function-id $ADDR::texas_holdem::join_table \
  --args address:<TABLE_ADDR> u64:0 u64:500 --profile holdem_deployer_v4

# Start hand
cedra move run --function-id $ADDR::texas_holdem::start_hand \
  --args address:<TABLE_ADDR> --profile holdem_deployer_v4
```

---

## Post-Deployment Fee Setup

After deploying, initialize the fee collector (run once):

```bash
cedra move run \
  --function-id $ADDR::texas_holdem::init_fee_config \
  --args address:<FEE_COLLECTOR_ADDRESS> \
  --profile holdem_deployer_v4
```

To update the fee collector later:

```bash
cedra move run \
  --function-id $ADDR::texas_holdem::update_fee_collector \
  --args address:<NEW_FEE_COLLECTOR_ADDRESS> \
  --profile holdem_deployer_v4
```

---

## Previous Deployments

| Version | Date | Address | Profile | Notes |
|---------|------|---------|---------|-------|
| 1.0.0 | 2025-12-21 | `0x736ddb...557b` | holdem_testnet | Initial edge-case fixes |
| 2.0.0 | 2025-12-21 | `0x88d4e4...665f` | holdem_v2 | Frontend integration |
| 3.0.0 | 2025-12-22 | `0xb45d81...574b` | holdem_deployer_V1 | Bug fixes + Admin controls |
| 4.0.0 | 2025-12-23 | `0xfab3ac...1fd3` | holdem_deployer_v2 | Hole cards display |
| 4.1.0 | 2025-12-25 | `0x6ff41e...9aa3` | holdem_deployer_v3 | Service fees (per-table) |
| 5.0.0 | 2025-12-25 | `0x238498...2d5a` | holdem_deployer_v4 | Global fee collector |

---

## Redeployment

```bash
# Create new profile
cedra init --profile <name> --network testnet

# Update Move.toml with new address
# [addresses]
# holdemgame = "<new_profile_address>"

# Deploy
cedra move publish --profile <name> --assume-yes

# Initialize fee collector (required!)
cedra move run --function-id <ADDR>::texas_holdem::init_fee_config \
  --args address:<FEE_COLLECTOR_ADDRESS> --profile <name>
```

---

## Frontend Configuration

Update `packages/frontend/src/config/contracts.ts` with the new contract address:
```typescript
export const CONTRACT_ADDRESS = "0x238498191305e2ff17c9d5dc6a09832ca11e3d0238fd68cd190d0ce01a012d5a";
```

Or set via environment variable in `packages/frontend/.env`:
```
VITE_CONTRACT_ADDRESS=0x238498191305e2ff17c9d5dc6a09832ca11e3d0238fd68cd190d0ce01a012d5a
```

