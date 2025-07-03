import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, TrendingUp, CheckCircle, AlertTriangle, ArrowLeft, Zap, DollarSign, Clock, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { convertAPI } from '../services/api';

const Conversion = () => {
  const navigate = useNavigate();
  const [transferData, setTransferData] = useState(null);
  const [exchangeRates, setExchangeRates] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get transfer data from session storage
    const storedData = sessionStorage.getItem('transferData');
    if (!storedData) {
      toast.error('No transfer data found. Please start over.');
      navigate('/');
      return;
    }

    setTransferData(JSON.parse(storedData));
    loadExchangeRates();
  }, [navigate]);

  const loadExchangeRates = async () => {
    try {
      const rates = await convertAPI.getExchangeRates();
      setExchangeRates(rates);
    } catch (error) {
      console.error('Error loading exchange rates:', error);
    }
  };

  const handleContinue = () => {
    if (!transferData) {
      toast.error('Transfer data not found');
      return;
    }
    navigate('/confirm');
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!transferData) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300">Loading conversion details...</p>
        </div>
      </div>
    );
  }

  const { amount, receiverAddress, conversion } = transferData;

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Conversion <span className="text-gradient">Details</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Review your INR to {transferData.currency} conversion before proceeding
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Conversion Summary */}
          <div className="space-y-8 animate-slide-up">
            {/* Main Conversion Card */}
            <div className="glass-card p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Conversion Summary</h2>
                  <p className="text-gray-400">Your transfer breakdown</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Amount Conversion */}
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-purple-500/20">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-semibold text-gray-300">You Send</span>
                    <span className="text-sm font-semibold text-gray-300">They Receive</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-white mb-1">₹{parseFloat(amount).toLocaleString()}</p>
                      <p className="text-sm text-gray-400">Indian Rupees</p>
                    </div>
                    <div className="flex items-center">
                      <ArrowRight className="w-8 h-8 text-purple-400 animate-pulse" />
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gradient mb-1">{conversion.convertedAmount}</p>
                      <p className="text-sm text-gray-400">{transferData.currency}</p>
                    </div>
                  </div>
                </div>

                {/* Exchange Rate */}
                <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Exchange Rate</span>
                    </span>
                    <span className="font-bold text-white">1 {transferData.currency} = ₹{conversion.exchangeRate}</span>
                  </div>
                </div>

                {/* Fees Breakdown */}
                <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                  <h4 className="font-bold text-white mb-4 flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span>Fee Breakdown</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">SwiftChain Fee (1%)</span>
                      <span className="text-white">₹{conversion.fees.swiftChainFee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Network Fee</span>
                      <span className="text-white">{conversion.fees.networkFee} {transferData.currency}</span>
                    </div>
                    <div className="border-t border-gray-700 pt-3 flex justify-between font-semibold">
                      <span className="text-gray-300">Total Fees</span>
                      <span className="text-red-400">₹{conversion.fees.totalFee}</span>
                    </div>
                  </div>
                </div>

                {/* Net Amount */}
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-green-300 flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Net Amount After Fees</span>
                    </span>
                    <span className="text-2xl font-bold text-green-300">₹{conversion.netAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Receiver Details */}
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-400" />
                </div>
                <span>Receiver Details</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Wallet Address
                  </label>
                  <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                    <p className="font-mono text-sm text-gray-200 break-all">{receiverAddress}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Valid Ethereum address format verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Exchange Rates & Actions */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {/* Exchange Rates */}
            {exchangeRates && (
              <div className="glass-card p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                  </div>
                  <span>Live Exchange Rates</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">₮</span>
                      </div>
                      <div>
                        <span className="font-semibold text-white">USDT</span>
                        <p className="text-xs text-gray-400">Tether</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">₹{exchangeRates.rates?.tether?.inr || 'N/A'}</p>
                      <p className="text-xs text-gray-400">per USDT</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-xl border border-orange-500/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">₿</span>
                      </div>
                      <div>
                        <span className="font-semibold text-white">Bitcoin</span>
                        <p className="text-xs text-gray-400">BTC</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">₹{exchangeRates.rates?.bitcoin?.inr || 'N/A'}</p>
                      <p className="text-xs text-gray-400">per BTC</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl border border-purple-500/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">Ξ</span>
                      </div>
                      <div>
                        <span className="font-semibold text-white">Ethereum</span>
                        <p className="text-xs text-gray-400">ETH</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">₹{exchangeRates.rates?.ethereum?.inr || 'N/A'}</p>
                      <p className="text-xs text-gray-400">per ETH</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4 flex items-center space-x-2">
                  <Clock className="w-3 h-3" />
                  <span>Last updated: {new Date(exchangeRates.timestamp).toLocaleString()}</span>
                </p>
              </div>
            )}

            {/* Benefits */}
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold text-white mb-6">Why {transferData.currency}?</h3>
              <div className="space-y-4">
                {transferData.currency === 'USDT' ? (
                  <>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm text-white">Stable Value</p>
                        <p className="text-xs text-gray-400">1 USDT = 1 USD, maintaining stable value</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm text-white">Global Acceptance</p>
                        <p className="text-xs text-gray-400">Widely accepted across exchanges and platforms</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm text-white">Native Currency</p>
                        <p className="text-xs text-gray-400">Ethereum's native cryptocurrency</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm text-white">Lower Gas Fees</p>
                        <p className="text-xs text-gray-400">No additional token transfer fees</p>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-white">Fast Transfers</p>
                    <p className="text-xs text-gray-400">Blockchain transfers complete in minutes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-white">Low Fees</p>
                    <p className="text-xs text-gray-400">Minimal network fees compared to traditional banking</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleContinue}
                className="btn-primary w-full flex items-center justify-center space-x-3 text-lg py-4"
              >
                <span>Continue to Transfer</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleBack}
                className="btn-secondary w-full flex items-center justify-center space-x-3"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Send Money</span>
              </button>
            </div>

            {/* Warning */}
            <div className="glass-card p-6 border-yellow-500/30">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-lg font-semibold text-yellow-300 mb-2">Important Notice</h4>
                  <p className="text-sm text-yellow-200 leading-relaxed">
                    Please ensure the receiver address is correct. Crypto transactions cannot be reversed once confirmed.
                    Double-check all details before proceeding.
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

export default Conversion;