import React, { useState, useEffect } from 'react';
import { recentTransactions as initialTransactions } from './mockData';
import { DataContext } from './contexts/DataContextObject';

export const DataProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('fin_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  // Keep localStorage synced whenever transactions update
  useEffect(() => {
    localStorage.setItem('fin_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (txn) => {
    setTransactions(prev => [{ id: Date.now().toString(), ...txn }, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Derived Metrics calculation. Assuming an arbitrary base total balance prior to the recorded transactions
  const BASE_BALANCE = 116246.95; 

  const derivedMetrics = {
    totalBalance: BASE_BALANCE + transactions.reduce((sum, t) => sum + t.amount, 0),
    income: transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0),
    expense: transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)
  };

  return (
    <DataContext.Provider value={{ transactions, derivedMetrics, addTransaction, deleteTransaction }}>
      {children}
    </DataContext.Provider>
  );
};
