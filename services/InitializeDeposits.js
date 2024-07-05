/*
This will initialise the QUEUED deposits in the L1BitcoinDepositor contract.

This task should:
- Fetch all QUEUED deposits from the persistent storage.
- Choose deposits whose funding BTC transaction has at least 1 confirmation (abuse protection).
- For each deposit that fulfills the above condition, check its state in the L1BitcoinDepositor contract (using the L1BitcoinDepositor.deposits call)
- If the given deposit is unknown, call L1BitcoinDepositor.initializeDeposit and update the internal deposit’s state to INITIALIZED
- If the given deposit is already initialized, don’t call the contract and just update the internal deposit’s state to INITIALIZED (corner case when deposit was initialized outside the relayer).
- If the given deposit is already finalized, don’t call the contract and just update the internal deposit’s state to FINALIZED (corner case when deposit was initialized and finalized outside the relayer).

More info: https://www.notion.so/thresholdnetwork/L2-tBTC-SDK-Relayer-Implementation-4dfedabfcf594c7d8ef80609541cf791?pvs=4
*/

