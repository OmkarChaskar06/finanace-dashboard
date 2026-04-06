import React from 'react';
import { useRole } from '../hooks/useRole';
import { useData } from '../hooks/useData';
import { recentTransactions } from '../mockData';
import { PlusCircle, Trash2 } from 'lucide-react';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const Transactions = ({ transactions: propTransactions, limit }) => {
  const { role } = useRole();
  const { transactions: contextTransactions } = useData();
  const isAdmin = role === 'admin';

  const allTransactions = propTransactions || contextTransactions || recentTransactions;
  const displayTransactions = limit ? allTransactions.slice(0, limit) : allTransactions;

  if (!displayTransactions.length) {
    return (
      <div className="transactions-container glass-panel">
        <div className="transactions-header">
          <h2>Recent Transactions</h2>
        </div>
        <div className="transactions-empty-state">
          <p>No transactions match your current search.</p>
          <span>Try another keyword or clear the search to see more items.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="transactions-container glass-panel">
      <div className="transactions-header">
        <h2>Recent Transactions</h2>
        {isAdmin ? (
          <button className="btn-primary">
            <PlusCircle size={18} />
            <span>Add Transaction</span>
          </button>
        ) : (
          <span className="read-only-badge">Read Only</span>
        )}
      </div>

      <div className="table-responsive">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th>Amount</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {displayTransactions.map((tx) => (
              <tr key={tx.id}>
                <td>
                  <div className="tx-desc">{tx.description}</div>
                </td>
                <td>
                  <span className={`category-tag ${tx.category.toLowerCase().replace(' & ', '-')}`}>
                    {tx.category}
                  </span>
                </td>
                <td>{tx.date}</td>
                <td>
                  <span className={`status-badge ${tx.status}`}>
                    {tx.status}
                  </span>
                </td>
                <td className={`amount ${tx.amount < 0 ? 'expense' : 'income'}`}>
                  {currencyFormatter.format(tx.amount)}
                </td>
                {isAdmin && (
                  <td>
                    <button className="icon-btn delete-btn" title="Delete Transaction">
                      <Trash2 size={16} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
