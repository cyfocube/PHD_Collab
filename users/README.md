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
2. **Existence Check**: Checks if `{wallet-address}.json` exists
3. **New User**: Creates file with initial schema if not exists
4. **Existing User**: Loads existing data, no duplicate creation
5. **Sync Points**: Synchronizes with sessionStorage points system

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