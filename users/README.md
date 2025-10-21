# User Database Structure

This directory contains the wallet-based user database system for C³ Cube persistent point storage.

## Directory Structure

```
users/
├── README.md                    # This file - documentation
├── wallets/                     # Individual wallet data files
│   ├── {wallet-address-1}.json  # User data for wallet address 1
│   ├── {wallet-address-2}.json  # User data for wallet address 2
│   └── ...                      # Additional wallet files
├── wallet-addresses/            # Wallet address registry (NEW)
│   ├── README.md                # Wallet registry documentation
│   ├── registry.json            # Master registry of all wallets
│   └── {wallet-address}.json    # Individual wallet address files
└── schema.json                  # Database schema reference
```

## User Data Schema

Each wallet file (`{wallet-address}.json`) contains:

```json
{
  "walletAddress": "0x1234...abcd",
  "createdAt": "2025-10-20T10:30:00.000Z",
  "lastActive": "2025-10-20T10:30:00.000Z",
  "points": {
    "gamingHub": {
      "blockchainBasics": 0,
      "smartContracts": 0,
      "defiProtocols": 0,
      "nftsWeb3": 0
    },
    "storyMode": {
      "chaptersCompleted": 0,
      "totalScore": 0
    },
    "achievements": {
      "firstQuest": false,
      "cryptoNovice": false,
      "blockchainExplorer": false,
      "defiMaster": false,
      "speedLearner": false,
      "perfectionist": false
    },
    "total": 0
  },
  "progress": {
    "completedNodes": [],
    "currentQuest": null,
    "level": 1,
    "xp": 0
  },
  "settings": {
    "autoSync": true,
    "notifications": true
  }
}
```

## Auto-Registration Flow

1. **Wallet Event Detection**: System detects wallet connection/import/creation
2. **Duplicate Check**: 
   - Check `wallet-addresses/registry.json` for existing address
   - Verify `wallet-addresses/{wallet-address}.json` exists
3. **Existing User**: If wallet exists, load existing data from `wallets/{wallet-address}.json`
4. **New User**: If wallet doesn't exist:
   - Create `wallet-addresses/{wallet-address}.json` (address registry)
   - Add wallet to `wallet-addresses/registry.json` (master registry)
   - Create `wallets/{wallet-address}.json` (user data with initial schema)
5. **Sync Points**: Synchronizes with sessionStorage points system
6. **Update Activity**: Track last active timestamp in both files

## Security Features

- Wallet addresses used as unique identifiers
- No duplicate records possible
- Automatic data validation
- Secure point synchronization
- Cross-device persistence

## Usage

This system is automatically integrated with:
- GamifiedLearningHub component
- Points system (addPoints function)
- Session storage synchronization
- Wallet connection events