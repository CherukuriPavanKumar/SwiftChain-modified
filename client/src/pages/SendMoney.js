import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Wallet, IndianRupee, AlertCircle, Zap, Shield, Clock, TrendingDown, Globe, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { convertAPI } from '../services/api';

const SendMoney = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    receiverAddress: '',
    currency: 'USDT',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [feeComparison, setFeeComparison] = useState(null);

  // Load fee comparison on mount
  useEffect(() => {
    loadFeeComparison();
  }, []);

  const loadFeeComparison = async () => {
    try {
      const comparison = await convertAPI.getFeeComparison(10000);
      setFeeComparison(comparison);
    } catch (error) {
      console.error('Error loading fee comparison:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.amount || parseFloat(formData.amount) < 0.01) {
      toast.error('Please enter a valid amount (minimum ₹0.01)');
      return false;
    }

    if (!formData.receiverAddress) {
      toast.error('Please enter receiver wallet address');
      return false;
    }

    // Basic Ethereum address validation
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethAddressRegex.test(formData.receiverAddress)) {
      toast.error('Please enter a valid Ethereum wallet address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Convert INR to selected crypto
      const conversion = await convertAPI.convertINRToCrypto(parseFloat(formData.amount), formData.currency);
      
      // Store data in session storage for next page
      sessionStorage.setItem('transferData', JSON.stringify({
        ...formData,
        conversion
      }));
      
      toast.success('Conversion calculated successfully!');
      navigate('/conversion');
    } catch (error) {
      console.error('Error converting currency:', error);
      toast.error(error.response?.data?.error || 'Failed to convert currency');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Send Money <span className="text-gradient">Globally</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Convert INR to cryptocurrency and send it anywhere in the world with up to 80% lower fees than traditional banks
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span>Instant Transfers</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-400">
                <Shield className="w-5 h-5" />
                <span>Secure Blockchain</span>
              </div>
              <div className="flex items-center space-x-2 text-purple-400">
                <TrendingDown className="w-5 h-5" />
                <span>80% Lower Fees</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Main Transfer Form */}
          <div className="space-y-8 animate-slide-up">
            <div className="glass-card p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Transfer Details</h2>
                  <p className="text-gray-400">Enter your transfer information</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount Input */}
                <div className="space-y-2">
                  <label htmlFor="amount" className="block text-sm font-semibold text-gray-200">
                    Amount (INR)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <IndianRupee className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="Enter amount in INR"
                      className="input-field pl-12 text-lg"
                      min="0.01"
                      step="0.01"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-400">Minimum transfer amount: ₹0.01</p>
                </div>

                {/* Currency Selection */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-200">
                    Send As Cryptocurrency
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="currency"
                        value="USDT"
                        checked={formData.currency === 'USDT'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        formData.currency === 'USDT'
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">₮</span>
                            </div>
                            <div>
                              <div className="font-semibold text-white">USDT (Tether)</div>
                              <div className="text-sm text-gray-400">Stablecoin - 1:1 with USD</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-green-400">Recommended</div>
                            <div className="text-xs text-gray-400">Most stable</div>
                          </div>
                        </div>
                      </div>
                    </label>

                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="currency"
                        value="ETH"
                        checked={formData.currency === 'ETH'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        formData.currency === 'ETH'
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">Ξ</span>
                            </div>
                            <div>
                              <div className="font-semibold text-white">ETH (Ethereum)</div>
                              <div className="text-sm text-gray-400">Native cryptocurrency</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-blue-400">Alternative</div>
                            <div className="text-xs text-gray-400">Price varies</div>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Receiver Address */}
                <div className="space-y-2">
                  <label htmlFor="receiverAddress" className="block text-sm font-semibold text-gray-200">
                    Receiver Wallet Address
                  </label>
                  <input
                    type="text"
                    id="receiverAddress"
                    name="receiverAddress"
                    value={formData.receiverAddress}
                    onChange={handleInputChange}
                    placeholder="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
                    className="input-field font-mono text-sm"
                    required
                  />
                  <p className="text-xs text-gray-400">
                    Enter the recipient's Ethereum wallet address (42 characters starting with 0x)
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full flex items-center justify-center space-x-3 disabled:opacity-50 text-lg py-4"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Calculating Conversion...</span>
                    </>
                  ) : (
                    <>
                      <span>Calculate Conversion</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Benefits & Comparison */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {/* Fee Comparison Card */}
            {feeComparison && (
              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                  <TrendingDown className="w-6 h-6 text-green-400" />
                  <span>Fee Comparison</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                    <div>
                      <p className="font-semibold text-red-300">Traditional Bank</p>
                      <p className="text-sm text-red-400">SWIFT Transfer</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-red-300">₹{feeComparison.traditionalBank.totalCost}</p>
                      <p className="text-xs text-red-400">Total Cost</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                    <div>
                      <p className="font-semibold text-green-300">SwiftChain</p>
                      <p className="text-sm text-green-400">Crypto Transfer</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-300">₹{feeComparison.swiftChain.totalCost}</p>
                      <p className="text-xs text-green-400">Total Cost</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
                      <span className="font-semibold text-white">You Save:</span>
                      <div className="text-right">
                        <span className="text-xl font-bold text-gradient">
                          ₹{feeComparison.savings}
                        </span>
                        <span className="text-sm text-purple-400 ml-2">
                          ({feeComparison.savingsPercentage}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Benefits Card */}
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <Zap className="w-6 h-6 text-purple-400" />
                <span>Why Choose SwiftChain?</span>
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingDown className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Up to 80% Lower Fees</h4>
                    <p className="text-sm text-gray-400">Save thousands compared to traditional banks with our transparent fee structure</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Instant Global Transfers</h4>
                    <p className="text-sm text-gray-400">Send money anywhere in the world in minutes, not days</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Secure & Transparent</h4>
                    <p className="text-sm text-gray-400">Blockchain technology ensures security and complete transparency</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Global Accessibility</h4>
                    <p className="text-sm text-gray-400">No bank accounts needed - just a crypto wallet</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Demo Notice */}
            <div className="glass-card p-6 border-blue-500/30">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-lg font-semibold text-blue-300 mb-2">Demo Mode</h4>
                  <p className="text-sm text-blue-200 leading-relaxed">
                    This is a demonstration application using Sepolia testnet. No real money will be transferred. 
                    All transactions are simulated for educational purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMoney;