<<<<<<< HEAD
# 🚀 SwiftChain - International Money Transfer Using Crypto

A full-stack web application for international money transfers using cryptocurrency to reduce fees. Built with React, Node.js, and blockchain technology.

## ✨ Features

- **💰 INR to Crypto Conversion**: Convert Indian Rupees to USDT or ETH using real-time exchange rates
- **🌐 Real Blockchain Transactions**: Send actual USDT/ETH transactions on Sepolia testnet
- **🔗 MetaMask Integration**: Seamless wallet connection and transaction signing
- **📊 Live Exchange Rates**: Real-time conversion rates from CoinGecko API
- **💸 Fee Comparison**: Compare costs between traditional banks and crypto transfers
- **📱 Responsive Design**: Modern UI built with Tailwind CSS
- **🔒 Secure Transactions**: Real blockchain transactions with proper validation

## 🛠️ Tech Stack

### Frontend
- **React.js** - User interface
- **Tailwind CSS** - Styling
- **Ethers.js** - Blockchain interaction
- **React Router** - Navigation
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **Ethers.js** - Blockchain operations
- **Axios** - HTTP client
- **CORS** - Cross-origin resource sharing

### Blockchain
- **Sepolia Testnet** - Ethereum test network
- **MetaMask** - Wallet integration
- **USDT Contract** - Token transfers
- **ETH** - Native cryptocurrency

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MetaMask browser extension
- Sepolia testnet ETH and USDT

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/SwiftChain.git
   cd SwiftChain
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Start the backend server**
   ```bash
   cd server
   npm start
   ```
   The backend will run on `http://localhost:5000`

4. **Start the frontend application**
   ```bash
   cd client
   npm start
   ```
   The frontend will run on `http://localhost:3000`

## 📖 How to Use

### 1. Connect Your Wallet
- Open the application in your browser
- Click "Connect MetaMask" 
- Switch to Sepolia testnet
- Ensure you have some SEP (Sepolia ETH) for gas fees

### 2. Send Money
- Enter the amount in INR (minimum ₹0.01)
- Choose between USDT or ETH
- Enter the recipient's wallet address
- Review the conversion and fees
- Confirm and send the transaction

### 3. Track Transaction
- View real-time transaction status
- Check transaction hash on Sepolia Etherscan
- Monitor confirmation progress

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the server directory:

```env
PORT=5000
NODE_ENV=development
```

### Sepolia Testnet Setup
1. **Get Sepolia ETH**: Visit [Sepolia Faucet](https://sepoliafaucet.com/)
2. **Get USDT**: Use a DEX like Uniswap on Sepolia
3. **Add Sepolia Network**: The app will automatically prompt you to add Sepolia to MetaMask

## 📁 Project Structure

```
SwiftChain/
├── client/                 # React frontend
│   ├── public/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API and MetaMask services
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── routes/        # API routes
│   │   └── index.js       # Server entry point
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Conversion API
- `POST /api/convert/inr-to-crypto` - Convert INR to USDT/ETH
- `GET /api/convert/rates` - Get current exchange rates
- `GET /api/convert/fee-comparison` - Compare transfer fees

### Crypto API
- `POST /api/crypto/send` - Send crypto transaction
- `GET /api/crypto/transaction/:txHash` - Get transaction status
- `GET /api/crypto/balance/:address` - Get wallet balance

## 🎯 Key Features Explained

### Real Blockchain Transactions
- **USDT Transfers**: Uses the official USDT contract on Sepolia
- **ETH Transfers**: Direct ETH transactions
- **Gas Fee Handling**: Automatic gas estimation and payment
- **Transaction Confirmation**: Real-time status updates

### Exchange Rate Integration
- **CoinGecko API**: Real-time cryptocurrency prices
- **Fallback Rates**: Backup rates when API is unavailable
- **Multiple Currencies**: Support for USDT and ETH

### Security Features
- **Address Validation**: Ethereum address format verification
- **Balance Checking**: Prevents insufficient balance transactions
- **Network Validation**: Ensures correct blockchain network
- **Transaction Signing**: Secure MetaMask integration

## 🚨 Important Notes

- **Testnet Only**: This application uses Sepolia testnet for safety
- **No Real Money**: All transactions use test tokens
- **Gas Fees**: You need SEP (Sepolia ETH) for transaction fees
- **MetaMask Required**: Browser wallet extension is mandatory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ethers.js](https://docs.ethers.org/) - Blockchain interaction library
- [CoinGecko API](https://www.coingecko.com/en/api) - Cryptocurrency price data
- [Sepolia Testnet](https://sepolia.dev/) - Ethereum test network
- [MetaMask](https://metamask.io/) - Web3 wallet

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the documentation
- Ensure you're on Sepolia testnet
- Verify MetaMask is properly configured

---

**Built with ❤️ for the Web3 community** 
=======
# SwiftChain
>>>>>>> 7443bce781e52508aceb82e9b9ed30394823d8b9
