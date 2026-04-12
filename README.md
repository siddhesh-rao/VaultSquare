# VaultSquare

Production-ready full-stack e-commerce application with product purchases, product rentals, JWT authentication, MongoDB persistence, MetaMask wallet linking, and a simple blockchain rental agreement contract.

## Folder Structure

```text
.
+-- blockchain/
|   +-- contracts/
|   |   +-- RentalAgreement.sol
|   +-- scripts/
|   |   +-- deploy.js
|   +-- test/
|   |   +-- RentalAgreement.test.js
|   +-- .env.example
|   +-- hardhat.config.js
|   +-- package.json
|   +-- README.md
+-- client/
|   +-- public/
|   +-- src/
|   |   +-- api/
|   |   +-- components/
|   |   +-- context/
|   |   +-- hooks/
|   |   +-- pages/
|   |   +-- utils/
|   |   +-- App.jsx
|   |   +-- index.css
|   |   +-- main.jsx
|   +-- .env.example
|   +-- index.html
|   +-- package.json
|   +-- postcss.config.js
|   +-- tailwind.config.js
|   +-- vite.config.js
+-- server/
|   +-- src/
|   |   +-- config/
|   |   +-- controllers/
|   |   +-- data/
|   |   +-- middleware/
|   |   +-- models/
|   |   +-- routes/
|   |   +-- scripts/
|   |   +-- services/
|   |   +-- utils/
|   +-- .env.example
|   +-- package.json
|   +-- server.js
+-- .gitignore
+-- package.json
+-- README.md
```

## Features

- JWT authentication with register and login APIs
- User profile management with wallet address linking
- Product catalog with buy and rent pricing
- Cart and buy order checkout flow
- Rental flow with date selection, quote generation, availability checks, and deposit handling
- Admin dashboard for products and orders
- Solidity smart contract for rental agreements
- MetaMask wallet connection in the frontend

## Local Setup

### 1. Install dependencies

```bash
npm --prefix server install
npm --prefix client install
npm --prefix blockchain install
```

### 2. Configure environment variables

Copy the example files:

```bash
Copy-Item server\.env.example server\.env
Copy-Item client\.env.example client\.env
Copy-Item blockchain\.env.example blockchain\.env
```

Update the values for MongoDB, blockchain RPC URL, private key, deployed contract address, and frontend API URL.

### 3. Compile and deploy the contract

```bash
npm run compile:blockchain
npm --prefix blockchain run deploy:sepolia
```

Copy the contract address printed by the deployment script into:

- `server/.env` as `CONTRACT_ADDRESS`
- `client/.env` as `VITE_CONTRACT_ADDRESS`

### 4. Seed sample data

```bash
npm run seed
```

This seeds:

- Admin user: `admin@example.com / Admin@123`
- Customer user: `jane@example.com / Password@123`

### 5. Run locally

Use separate terminals:

```bash
npm run dev:server
npm run dev:client
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Users

- `GET /api/users/profile`
- `PUT /api/users/profile`

### Products

- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/products/:id/availability`
- `GET /api/products/admin/all`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Orders

- `POST /api/orders/buy`
- `POST /api/orders/rent`
- `GET /api/orders/my-orders`
- `GET /api/orders`

### Rentals

- `POST /api/rentals/quote`
- `POST /api/rentals`
- `GET /api/rentals/my-rentals`
- `GET /api/rentals`
- `PATCH /api/rentals/:id/complete`
- `PATCH /api/rentals/:id/refund`

## Deployment

### Frontend on Vercel or Netlify

1. Import the `client` folder as a project.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add environment variable `VITE_API_URL` pointing to the deployed backend.

### Backend on Render or Railway

1. Import the `server` folder as a Node service.
2. Build command: `npm install`
3. Start command: `npm start`
4. Add all variables from `server/.env.example`.
5. Point `MONGODB_URI` to MongoDB Atlas.

### Database on MongoDB Atlas

1. Create a cluster and database user.
2. Add the backend host IP or allow access for testing.
3. Copy the connection string into `MONGODB_URI`.

### Blockchain on Sepolia or Polygon testnet

1. Update `blockchain/hardhat.config.js` with the target network if using Polygon Amoy.
2. Add RPC URL and deployer private key to `blockchain/.env`.
3. Run deployment.
4. Copy the deployed address into backend and frontend env files.

## Notes

- The contract keeps rental agreement metadata and emits lifecycle events.
- The backend creates agreements through Ethers.js after storing the rental in MongoDB.
- If the contract is not configured yet, rentals still save in MongoDB and the API logs the blockchain failure instead of crashing the app.
