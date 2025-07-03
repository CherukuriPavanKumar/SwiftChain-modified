import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Wallet, ArrowRight, CheckCircle, ArrowLeft, ExternalLink, AlertTriangle, Zap, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import metaMaskService from '../services/metamask';

const ConfirmTransfer = () => {
  const navigate = useNavigate();
  const [transferData, setTransferData] = useState(null);
  const [walletStatus, setWalletStatus] = useState({
    isConnected: false,
    account: null,
    isSepolia: false,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [balances, setBalances] = useState({
    eth: '0',
    usdt: '0'
  });
  const [showFullAddress, setShowFullAddress] = useState(false);

  useEffect(() => {
    // Get transfer data from session storage
    const storedData = sessionStorage.getItem('transferData');
    if (!storedData) {
      toast.error('No transfer data found. Please start over.');
      navigate('/');
      return;
    }

    setTransferData(JSON.parse(storedData));
    checkWalletConnection();
  }, [navigate]);

  const checkWalletConnection = async () => {
    const status = metaMaskService.getConnectionStatus();
    setWalletStatus(status);
    
    if (status.isConnected && status.account) {
      loadBalances(status.account);
    }
  };

  const loadBalances = async (address) => {
    try {
      const ethBalance = await metaMaskService.getETHBalance(address);
      const usdtBalance = await metaMaskService.getUSDTBalance(address);
      setBalances({
        eth: ethBalance,
        usdt: usdtBalance
      });
    } catch (error) {
      console.error('Error loading balances:', error);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      await metaMaskService.connect();
      await metaMaskService.switchToSepolia();
      checkWalletConnection();
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleTransfer = async () => {
    if (!walletStatus.isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!walletStatus.isSepolia) {
      toast.error('Please switch to Sepolia network');
      return;
    }

    const { receiverAddress, conversion, currency } = transferData;
    const cryptoAmount = parseFloat(conversion.convertedAmount);

    // Check balance based on currency
    if (currency === 'USDT') {
      if (parseFloat(balances.usdt) < cryptoAmount) {
        toast.error(`Insufficient USDT balance. You have ${balances.usdt} USDT, need ${cryptoAmount} USDT`);
        return;
      }
    } else if (currency === 'ETH') {
      if (parseFloat(balances.eth) < cryptoAmount) {
        toast.error(`Insufficient ETH balance. You have ${balances.eth} ETH, need ${cryptoAmount} ETH`);
        return;
      }
    }

    setIsTransferring(true);
    try {
      // Send real crypto transaction via MetaMask
      const result = await metaMaskService.sendCryptoTransaction(receiverAddress, cryptoAmount, currency);

      // Store transaction data for status page
      const transactionData = {
        hash: result.hash,
        status: 'confirmed',
        from: walletStatus.account,
        to: receiverAddress,
        amount: cryptoAmount,
        currency: currency,
        gasUsed: result.receipt.gasUsed.toString(),
        gasPrice: result.receipt.gasPrice.toString(),
        timestamp: new Date().toISOString(),
        confirmations: result.receipt.confirmations,
        blockNumber: result.receipt.blockNumber
      };

      sessionStorage.setItem('transactionHash', result.hash);
      sessionStorage.setItem('transactionData', JSON.stringify(transactionData));

      toast.success(`${currency} transaction sent successfully! Check your MetaMask wallet.`);
      navigate('/status');
    } catch (error) {
      console.error('Error sending transaction:', error);
      toast.error(error.message || 'Failed to send transaction');
    } finally {
      setIsTransferring(false);
    }
  };

  const handleBack = () => {
    navigate('/conversion');
  };

  const formatAddress = (address, show = false) => {
    if (!address) return '';
    if (show) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!transferData) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300">Loading transfer details...</p>
        </div>
      </div>
    );
  }

  const { receiverAddress, conversion } = transferData;

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Confirm <span className="text-gradient">Transfer</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Review and confirm your {transferData.currency} transfer
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Transfer Details */}
          <div className="space-y-8 animate-slide-up">
            {/* Amount Card */}
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span>Transfer Amount</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-xl">
                  <span className="text-gray-400">Original Amount:</span>
                  <span className="font-bold text-white text-lg">₹{conversion.originalAmount}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                  <span className="text-gray-300">Converted Amount:</span>
                  <span className="font-bold text-green-300 text-lg">{conversion.convertedAmount} {transferData.currency}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-xl">
                  <span className="text-gray-400">Exchange Rate:</span>
                  <span className="font-bold text-white">1 {transferData.currency} = ₹{conversion.exchangeRate}</span>
                </div>
                
                <div className="border-t border-gray-700 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Platform Fee:</span>
                    <span className="text-white">₹{conversion.fees.swiftChainFee}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Network Fee:</span>
                    <span className="text-white">{conversion.fees.networkFee} {transferData.currency}</span>
                  </div>
                  <div className="flex justify-between font-bold text-red-400">
                    <span>Total Fee:</span>
                    <span>₹{conversion.fees.totalFee}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-gray-300">Net Amount:</span>
                    <span className="text-gradient">₹{conversion.netAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Receiver Details */}
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span>Receiver Details</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Wallet Address
                  </label>
                  <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-sm text-gray-200 break-all flex-1">
                        {formatAddress(receiverAddress, showFullAddress)}
                      </p>
                      <button
                        onClick={() => setShowFullAddress(!showFullAddress)}
                        className="ml-3 p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showFullAddress ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Valid Ethereum address format verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Connection & Actions */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {/* Wallet Status */}
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <span>Wallet Connection</span>
              </h3>
              
              {!walletStatus.isConnected ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Wallet className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-300 mb-6 text-lg">Connect your MetaMask wallet to proceed</p>
                  <button
                    onClick={connectWallet}
                    disabled={isConnecting}
                    className="btn-primary w-full text-lg py-4"
                  >
                    {isConnecting ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Connecting...</span>
                      </div>
                    ) : (
                      'Connect MetaMask'
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="font-semibold text-green-300 text-lg">Wallet Connected</span>
                  </div>
                  
                  <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                    <p className="text-sm text-gray-400 mb-2">Connected Account</p>
                    <p className="font-mono text-sm text-gray-200 break-all">{walletStatus.account}</p>
                  </div>
                  
                  {/* Network Status */}
                  <div className={`flex items-center space-x-3 p-4 rounded-xl border ${
                    walletStatus.isSepolia 
                      ? 'bg-green-500/10 border-green-500/20' 
                      : 'bg-yellow-500/10 border-yellow-500/20'
                  }`}>
                    {walletStatus.isSepolia ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    )}
                    <span className={`text-sm font-medium ${
                      walletStatus.isSepolia ? 'text-green-300' : 'text-yellow-300'
                    }`}>
                      {walletStatus.isSepolia ? 'Sepolia Network Connected' : 'Wrong Network - Please switch to Sepolia'}
                    </span>
                  </div>

                  {/* Balances */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-300">Wallet Balances</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800/30 p-4 rounded-xl text-center">
                        <p className="text-sm text-gray-400 mb-1">ETH Balance</p>
                        <p className="font-bold text-white">{parseFloat(balances.eth).toFixed(4)} SEP</p>
                      </div>
                      <div className="bg-gray-800/30 p-4 rounded-xl text-center">
                        <p className="text-sm text-gray-400 mb-1">USDT Balance</p>
                        <p className="font-bold text-white">{parseFloat(balances.usdt).toFixed(2)} USDT</p>
                      </div>
                    </div>
                  </div>

                  {/* Balance Warning */}
                  {transferData?.currency === 'USDT' && parseFloat(balances.usdt) < parseFloat(conversion.convertedAmount) && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <div>
                          <span className="text-sm font-semibold text-red-300">Insufficient USDT Balance</span>
                          <p className="text-xs text-red-400 mt-1">
                            You need {conversion.convertedAmount} USDT but have {balances.usdt} USDT
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {transferData?.currency === 'ETH' && parseFloat(balances.eth) < parseFloat(conversion.convertedAmount) && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <div>
                          <span className="text-sm font-semibold text-red-300">Insufficient ETH Balance</span>
                          <p className="text-xs text-red-400 mt-1">
                            You need {conversion.convertedAmount} ETH but have {balances.eth} ETH
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold text-white mb-6">Actions</h3>
              <div className="space-y-4">
                <button
                  onClick={handleTransfer}
                  disabled={!walletStatus.isConnected || !walletStatus.isSepolia || isTransferring || 
                    (transferData?.currency === 'USDT' && parseFloat(balances.usdt) < parseFloat(conversion.convertedAmount)) ||
                    (transferData?.currency === 'ETH' && parseFloat(balances.eth) < parseFloat(conversion.convertedAmount))}
                  className="btn-primary w-full flex items-center justify-center space-x-3 text-lg py-4 disabled:opacity-50"
                >
                  {isTransferring ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing Transaction...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Send {conversion.convertedAmount} {transferData?.currency}</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleBack}
                  className="btn-secondary w-full flex items-center justify-center space-x-3"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Conversion</span>
                </button>
              </div>
            </div>

            {/* Information */}
            <div className="glass-card p-6 border-blue-500/30">
              <h4 className="text-lg font-semibold text-blue-300 mb-4">Important Information</h4>
              <div className="space-y-3 text-sm text-blue-200">
                {transferData?.currency === 'USDT' ? (
                  <>
                    <p>• This will send real USDT tokens on Sepolia testnet</p>
                    <p>• You need USDT tokens in your wallet to complete the transfer</p>
                    <p>• You need some SEP (Sepolia ETH) for gas fees</p>
                    <p>• The transaction will be visible on Sepolia Etherscan</p>
                    <p>• The recipient will see the USDT in their MetaMask wallet</p>
                  </>
                ) : (
                  <>
                    <p>• This will send real ETH on Sepolia testnet</p>
                    <p>• You need ETH in your wallet to complete the transfer</p>
                    <p>• Gas fees will be deducted from your ETH balance</p>
                    <p>• The transaction will be visible on Sepolia Etherscan</p>
                    <p>• The recipient will see the ETH in their MetaMask wallet</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmTransfer;