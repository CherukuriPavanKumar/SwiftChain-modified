import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Download, Eye, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, statusFilter]);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      // Simulate loading transactions from localStorage or API
      const storedTransactions = localStorage.getItem('transactionHistory');
      let transactionList = [];
      
      if (storedTransactions) {
        transactionList = JSON.parse(storedTransactions);
      } else {
        // Demo transactions if none exist
        transactionList = [
          {
            id: '1',
            hash: '0x1234567890abcdef1234567890abcdef12345678',
            from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
            to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
            amount: '100.50',
            currency: 'USDT',
            status: 'completed',
            timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            gasUsed: '21000',
            gasPrice: '20000000000',
            confirmations: 12,
            blockNumber: 12345678
          },
          {
            id: '2',
            hash: '0xabcdef1234567890abcdef1234567890abcdef12',
            from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
            to: '0x1234567890abcdef1234567890abcdef12345678',
            amount: '50.25',
            currency: 'ETH',
            status: 'pending',
            timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            gasUsed: '21000',
            gasPrice: '20000000000',
            confirmations: 2,
            blockNumber: 12345679
          },
          {
            id: '3',
            hash: '0x7890abcdef1234567890abcdef1234567890abcd',
            from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
            to: '0xabcdef1234567890abcdef1234567890abcdef12',
            amount: '75.00',
            currency: 'USDT',
            status: 'failed',
            timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            gasUsed: '21000',
            gasPrice: '20000000000',
            confirmations: 0,
            blockNumber: 12345680
          }
        ];
        localStorage.setItem('transactionHistory', JSON.stringify(transactionList));
      }
      
      setTransactions(transactionList);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Failed to load transaction history');
    } finally {
      setIsLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(tx => 
        tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.amount.includes(searchTerm) ||
        tx.currency.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tx => tx.status === statusFilter);
    }

    setFilteredTransactions(filtered);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'failed':
        return 'status-failed';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleViewTransaction = (transaction) => {
    sessionStorage.setItem('transactionData', JSON.stringify(transaction));
    navigate('/status');
  };

  const handleExport = () => {
    const csvContent = [
      ['Hash', 'From', 'To', 'Amount', 'Currency', 'Status', 'Timestamp', 'Gas Used', 'Gas Price', 'Confirmations', 'Block Number'],
      ...filteredTransactions.map(tx => [
        tx.hash,
        tx.from,
        tx.to,
        tx.amount,
        tx.currency,
        tx.status,
        formatDate(tx.timestamp),
        tx.gasUsed,
        tx.gasPrice,
        tx.confirmations,
        tx.blockNumber
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transaction-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Transaction history exported successfully!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300">Loading transaction history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 animate-fade-in">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Transaction <span className="text-gradient">History</span>
            </h1>
            <p className="text-xl text-gray-300">View and manage your crypto transfer history</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary flex items-center space-x-2 self-start lg:self-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="glass-card p-6 mb-8 animate-slide-up">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by hash, address, amount, or currency..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-100 placeholder-gray-400"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-100"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              
              <button
                onClick={handleExport}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="glass-card p-8 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No transactions found</h3>
              <p className="text-gray-400 text-lg mb-8">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start by making your first crypto transfer'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <button
                  onClick={() => navigate('/')}
                  className="btn-primary"
                >
                  Start Your First Transfer
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-4 font-semibold text-gray-300">Transaction</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-300">From</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-300">To</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-300">Amount</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-300">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-300">Date</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                      <td className="py-6 px-4">
                        <div className="font-mono text-sm text-gray-200">
                          {formatAddress(transaction.hash)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Block #{transaction.blockNumber}
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <div className="font-mono text-sm text-gray-200">
                          {formatAddress(transaction.from)}
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <div className="font-mono text-sm text-gray-200">
                          {formatAddress(transaction.to)}
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <div className="font-semibold text-white">
                          {transaction.amount} {transaction.currency}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Gas: {transaction.gasUsed}
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(transaction.status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </div>
                        {transaction.status === 'pending' && (
                          <div className="text-xs text-gray-400 mt-2">
                            {transaction.confirmations} confirmations
                          </div>
                        )}
                      </td>
                      <td className="py-6 px-4">
                        <div className="text-sm text-gray-200">
                          {formatDate(transaction.timestamp)}
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <button
                          onClick={() => handleViewTransaction(transaction)}
                          className="btn-primary flex items-center space-x-2 text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {transactions.length}
            </div>
            <div className="text-sm text-gray-400">Total Transactions</div>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-green-400 mb-2">
              {transactions.filter(tx => tx.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {transactions.filter(tx => tx.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-400">Pending</div>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-red-400 mb-2">
              {transactions.filter(tx => tx.status === 'failed').length}
            </div>
            <div className="text-sm text-gray-400">Failed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;