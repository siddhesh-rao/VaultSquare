# Blockchain Setup

1. Copy `.env.example` to `.env`.
2. Run `npm install`.
3. Compile the contract with `npm run compile`.
4. Deploy locally with `npm run deploy:localhost` or to Sepolia with `npm run deploy:sepolia`.
5. Copy the deployed contract address into `server/.env` as `CONTRACT_ADDRESS`.

The compiled ABI will be available under `artifacts/contracts/RentalAgreement.sol/RentalAgreement.json`, which the backend reads through `BLOCKCHAIN_ABI_PATH`.
