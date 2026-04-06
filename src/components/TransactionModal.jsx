import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useData } from '../hooks/useData';
import { useRole } from '../hooks/useRole';

const TransactionModal = ({ onClose }) => {
  const { addTransaction } = useData();
  const { role } = useRole();

  const [formData, setFormData] = useState({
    description: '',
    category: 'General',
    amount: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  if (role !== 'admin') {
    return null; // Safety check
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum)) return;

    addTransaction({
      description: formData.description,
      category: formData.category,
      date: formData.date,
      amount: formData.type === 'expense' ? -Math.abs(amountNum) : Math.abs(amountNum),
      status: 'completed'
    });
    
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h2>Add Transaction</h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Description</label>
            <input 
              type="text" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="e.g. Amazon Purchase"
              required 
            />
          </div>
          
          <div className="form-row">
            <div className="form-group half">
              <label>Amount (₹)</label>
              <input 
                type="number" 
                name="amount" 
                value={formData.amount} 
                onChange={handleChange} 
                placeholder="100.00"
                min="0"
                step="0.01"
                required 
              />
            </div>
            <div className="form-group half">
              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group half">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="General">General</option>
                <option value="Food & Drink">Food & Drink</option>
                <option value="Groceries">Groceries</option>
                <option value="Electronics">Electronics</option>
                <option value="Income">Income</option>
                <option value="Entertainment">Entertainment</option>
              </select>
            </div>
            <div className="form-group half">
              <label>Date</label>
              <input 
                type="date" 
                name="date" 
                value={formData.date} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save Transaction</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
