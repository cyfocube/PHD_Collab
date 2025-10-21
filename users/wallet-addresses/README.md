# Wallet Addresses Registry

This directory maintains a registry of all wallet addresses that have been created, imported, or connected to the C³ Cube system.

## Purpose

- **Duplicate Prevention**: Quick lookup to prevent duplicate wallet registrations
- **Address Validation**: Verify wallet existence before creating user data
- **Activity Tracking**: Monitor wallet registration and activity events
- **System Integrity**: Maintain consistent state across wallet operations

## Directory Structure

```
wallet-addresses/
├── README.md                    # This documentation file
├── registry.json               # Master registry of all wallet addresses
└── {wallet-address}.json       # Individual wallet address files
```

## Registry File (`registry.json`)

Central registry containing:
- **Version**: Schema version for future updates
- **Total Wallets**: Count of registered wallet addresses
- **Wallet Addresses**: Array of all registered wallets with metadata
- **Metadata**: System configuration and cleanup settings

## Individual Wallet Files (`{wallet-address}.json`)

Each wallet gets its own file for fast existence checks:
- **Wallet Address**: The unique Ethereum address
- **Registration Info**: When and how the wallet was registered
- **Activity Tracking**: Last activity timestamp
- **Data References**: Links to user scores files
- **Event History**: Log of wallet-related events

## Registration Types

- **`create`**: Wallet was created within the application
- **`import`**: Wallet was imported from external source
- **`connect`**: Wallet was connected via Web3 provider

## Event Types

- **`wallet_created`**: New wallet generated in system
- **`wallet_imported`**: Existing wallet imported to system
- **`wallet_connected`**: Wallet connected via Web3
- **`user_activity`**: User performed actions (gaming, learning, etc.)
- **`data_sync`**: Points synchronized between session and database

## Duplicate Prevention Logic

1. **Check Registry**: Query `registry.json` for existing address
2. **Individual File Check**: Verify `{wallet-address}.json` exists
3. **User Data Validation**: Confirm corresponding user scores file exists
4. **Status Verification**: Ensure wallet is active and valid

## Auto-Update Flow

1. **Wallet Event Detected** (create/import/connect)
2. **Duplicate Check** - If exists, load existing data
3. **New Registration** - If new, create both files:
   - Add to `registry.json`
   - Create `{wallet-address}.json`
4. **Update Timestamps** - Track last activity
5. **Sync User Data** - Link to user scores file

## Integration Points

- **Wallet Event Listeners**: Detect creation/import/connection
- **User Registration Service**: Check for duplicates before creating
- **Points Synchronization**: Update activity timestamps
- **Session Management**: Track wallet usage patterns

## Benefits

✅ **Fast Duplicate Detection**: O(1) file existence check  
✅ **Event Audit Trail**: Complete history of wallet interactions  
✅ **Data Consistency**: Links between address registry and user scores data  
✅ **Performance Optimized**: Separate concerns for quick lookups  
✅ **Scalable Design**: Handles thousands of wallet addresses efficiently