import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, ExternalLink, Copy, Home, RefreshCw, Banknote, Zap, Shield, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { cryptoAPI } from '../services/api';

const TransactionStatus = () => {
  const navigate = useNavigate();
  const [transactionData, setTransactionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [withdrawalData, setWithdrawalData] = useState({
    accountNumber: '',
    ifscCode: '',
    accountHolder: '',
  });

  const loadTransactionData = useCallback(async () => {
    try {
      const storedData = sessionStorage.getItem('transactionData');
      const txHash = sessionStorage.getItem('transactionHash');

      if (!storedData || !txHash) {
        toast.error('No transaction data found');
        navigate('/');
        return;
      }

      const data = JSON.parse(storedData);
      setTransactionData(data);

      // Start polling for transaction status
      pollTransactionStatus(txHash);
    } catch (error) {
      console.error('Error loading transaction data:', error);
      toast.error('Failed to load transaction data');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadTransactionData();
  }, [loadTransactionData]);

  const pollTransactionStatus = async (txHash) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await cryptoAPI.getTransactionStatus(txHash);
        setTransactionData(response.transaction);

        if (response.transaction.status === 'confirmed') {
          clearInterval(pollInterval);
          toast.success('Transaction confirmed successfully!');
        }
      } catch (error) {
        console.error('Error polling transaction status:', error);
      }
    }, 3000); // Poll every 3 seconds

    // Clear interval after 2 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
    }, 120000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleWithdrawal = async () => {
    if (!withdrawalData.accountNumber || !withdrawalData.ifscCode || !withdrawalData.accountHolder) {
      toast.error('Please fill in all bank details');
      return;
    }

    try {
      await cryptoAPI.simulateWithdrawal({
        amount: transactionData.amount,
        bankDetails: withdrawalData,
      });

      toast.success('Withdrawal request submitted successfully!');
      setShowWithdrawal(false);
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      toast.error('Failed to process withdrawal request');
    }
  };

  const getStatusIcon = () => {
    switch (transactionData?.status) {
      case 'confirmed':
        return <CheckCircle className="w-20 h-20 text-green-400" />;
      case 'pending':
        return <Clock className="w-20 h-20 text-yellow-400 animate-pulse" />;
      case 'failed':
        return <XCircle className="w-20 h-20 text-red-400" />;
      default:
        return <Clock className="w-20 h-20 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (transactionData?.status) {
      case 'confirmed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBg = () => {
    switch (transactionData?.status) {
      case 'confirmed':
        return 'from-green-500/10 to-emerald-500/10 border-green-500/20';
      case 'pending':
        return 'from-yellow-500/10 to-orange-500/10 border-yellow-500/20';
      case 'failed':
        return 'from-red-500/10 to-pink-500/10 border-red-500/20';
      default:
        return 'from-gray-500/10 to-gray-600/10 border-gray-500/20';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300">Loading transaction status...</p>
        </div>
      </div>
    );
  }

  if (!transactionData) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <XCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Transaction Not Found</h2>
          <p className="text-gray-400 mb-8">No transaction data available</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Start New Transfer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Transaction <span className="text-gradient">Status</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Track your crypto transfer progress in real-time
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Transaction Status */}
          <div className="space-y-8 animate-slide-up">
            {/* Status Card */}
            <div className={`glass-card p-8 text-center bg-gradient-to-r ${getStatusBg()}`}>
              <div className="mb-8">
                {getStatusIcon()}
              </div>
              <h2 className={`text-3xl font-bold mb-4 ${getStatusColor()}`}>
                {transactionData.status === 'confirmed' && 'Transaction Confirmed!'}
                {transactionData.status === 'pending' && 'Transaction Pending'}
                {transactionData.status === 'failed' && 'Transaction Failed'}
              </h2>
              <p className="text-gray-300 mb-6 text-lg">
                {transactionData.status === 'confirmed' && `Your ${transactionData.currency} has been successfully transferred`}
                {transactionData.status === 'pending' && 'Your transaction is being processed on the blockchain'}
                {transactionData.status === 'failed' && 'The transaction could not be completed'}
              </p>

              {/* Confirmation Progress */}
              {transactionData.status === 'pending' && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <RefreshCw className="w-5 h-5 text-yellow-400 animate-spin" />
                    <span className="text-lg font-semibold text-yellow-300">Confirming Transaction</span>
                  </div>
                  <div className="w-full bg-yellow-500/20 rounded-full h-3 mb-3">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(transactionData.confirmations / 12) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-yellow-300">
                    {transactionData.confirmations} of 12 confirmations
                  </p>
                </div>
              )}
            </div>

            {/* Transaction Details */}
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span>Transaction Details</span>
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/30 p-4 rounded-xl">
                    <span className="text-gray-400 text-sm">Amount</span>
                    <p className="font-bold text-white text-lg">{transactionData.amount} {transactionData.currency}</p>
                  </div>
                  <div className="bg-gray-800/30 p-4 rounded-xl">
                    <span className="text-gray-400 text-sm">Network</span>
                    <p className="font-bold text-white">Sepolia Testnet</p>
                  </div>
                </div>
                
                <div className="bg-gray-800/30 p-4 rounded-xl">
                  <span className="text-gray-400 text-sm">From Address</span>
                  <p className="font-mono text-sm text-gray-200 break-all">
                    {`${transactionData.from.slice(0, 6)}...${transactionData.from.slice(-4)}`}
                  </p>
                </div>
                
                <div className="bg-gray-800/30 p-4 rounded-xl">
                  <span className="text-gray-400 text-sm">To Address</span>
                  <p className="font-mono text-sm text-gray-200 break-all">
                    {`${transactionData.to.slice(0, 6)}...${transactionData.to.slice(-4)}`}
                  </p>
                </div>

                {transactionData.blockNumber && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/30 p-4 rounded-xl">
                      <span className="text-gray-400 text-sm">Block Number</span>
                      <p className="font-mono text-sm text-white">{transactionData.blockNumber}</p>
                    </div>
                    <div className="bg-gray-800/30 p-4 rounded-xl">
                      <span className="text-gray-400 text-sm">Gas Used</span>
                      <p className="text-sm text-white">{transactionData.gasUsed}</p>
                    </div>
                  </div>
                )}
                
                <div className="bg-gray-800/30 p-4 rounded-xl">
                  <span className="text-gray-400 text-sm">Timestamp</span>
                  <p className="text-sm text-white">
                    {new Date(transactionData.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Hash & Actions */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {/* Transaction Hash */}
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span>Transaction Hash</span>
              </h3>
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                <p className="font-mono text-sm text-gray-200 break-all mb-6">{transactionData.hash}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => copyToClipboard(transactionData.hash)}
                    className="btn-secondary flex items-center justify-center space-x-2 flex-1"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Hash</span>
                  </button>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${transactionData.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex items-center justify-center space-x-2 flex-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View on Etherscan</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Withdrawal to Bank */}
            {transactionData.status === 'confirmed' && (
              <div className="glass-card p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Withdraw to Bank</h3>
                </div>
                
                {!showWithdrawal ? (
                  <div className="space-y-6">
                    <p className="text-gray-300">
                      Convert your {transactionData.currency} back to INR and withdraw to your bank account
                    </p>
                    <button
                      onClick={() => setShowWithdrawal(true)}
                      className="btn-success w-full text-lg py-4"
                    >
                      Withdraw to Bank Account
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Account Number
                        </label>
                        <input
                          type="text"
                          value={withdrawalData.accountNumber}
                          onChange={(e) => setWithdrawalData(prev => ({
                            ...prev,
                            accountNumber: e.target.value
                          }))}
                          className="input-field"
                          placeholder="Enter account number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          IFSC Code
                        </label>
                        <input
                          type="text"
                          value={withdrawalData.ifscCode}
                          onChange={(e) => setWithdrawalData(prev => ({
                            ...prev,
                            ifscCode: e.target.value
                          }))}
                          className="input-field"
                          placeholder="Enter IFSC code"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Account Holder Name
                        </label>
                        <input
                          type="text"
                          value={withdrawalData.accountHolder}
                          onChange={(e) => setWithdrawalData(prev => ({
                            ...prev,
                            accountHolder: e.target.value
                          }))}
                          className="input-field"
                          placeholder="Enter account holder name"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleWithdrawal}
                        className="btn-success flex-1"
                      >
                        Submit Withdrawal
                      </button>
                      <button
                        onClick={() => setShowWithdrawal(false)}
                        className="btn-secondary flex-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold text-white mb-6">Actions</h3>
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/')}
                  className="btn-primary w-full flex items-center justify-center space-x-3 text-lg py-4"
                >
                  <Home className="w-5 h-5" />
                  <span>Start New Transfer</span>
                </button>
                
                <button
                  onClick={loadTransactionData}
                  className="btn-secondary w-full flex items-center justify-center space-x-3"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh Status</span>
                </button>
              </div>
            </div>

            {/* Information */}
            <div className="glass-card p-6 border-blue-500/30">
              <h4 className="text-lg font-semibold text-blue-300 mb-4">What's Next?</h4>
              <div className="space-y-3 text-sm text-blue-200">
                <p>• Your transaction is being processed on the Sepolia testnet</p>
                <p>• Once confirmed, you can withdraw to your bank account</p>
                <p>• Transaction hash can be used to track on Etherscan</p>
                <p>• This is a demo - no real funds are transferred</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionStatus;