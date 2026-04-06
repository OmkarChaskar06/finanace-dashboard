import React from 'react';
import { useRole } from '../hooks/useRole';
import { ArrowUpRight, ArrowDownRight, Edit3 } from 'lucide-react';

const StatCard = ({ title, value, trend, isPositive }) => {
  const { role } = useRole();
  const isAdmin = role === 'admin';

  return (
    <div className="stat-card glass-panel">
      <div className="stat-header">
        <h3>{title}</h3>
        {isAdmin && (
          <button className="icon-btn edit-btn" title="Edit Metric">
            <Edit3 size={16} />
          </button>
        )}
      </div>
      <div className="stat-value">{value}</div>
      {trend && (
        <div className={`stat-trend ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
