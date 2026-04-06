import React, { useState } from 'react';
import { useData } from './hooks/useData';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import StatCard from './components/StatCard';
import DashboardChart from './components/DashboardChart';
import Transactions from './components/Transactions';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const normalizeSearchValue = (value) =>
  String(value ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

const matchesTransactionSearch = (transaction, query) => {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return true;
  }

  const searchableValues = [
    transaction.description,
    transaction.category,
    transaction.date,
    transaction.status,
    Math.abs(transaction.amount).toFixed(2),
    currencyFormatter.format(transaction.amount),
  ];

  return searchableValues.some((value) => normalizeSearchValue(value).includes(normalizedQuery));
};

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const { derivedMetrics, transactions } = useData();

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setActiveTab('Transactions');
    }
  };

  const filteredTransactions = transactions.filter((tx) => matchesTransactionSearch(tx, searchQuery));

  const categoryMetric = filteredTransactions.reduce((acc, tx) => {
    const key = tx.category || 'Other';
    acc[key] = (acc[key] || 0) + Math.abs(tx.amount);
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryMetric)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const pendingTransactions = filteredTransactions.filter((tx) => tx.status === 'pending');
  const recentHighlights = [...filteredTransactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
  const recentExpenses = [...filteredTransactions]
    .filter((tx) => tx.amount < 0)
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    .slice(0, 3);
  const incomeTransactions = filteredTransactions.filter((tx) => tx.amount > 0);
  const monthlySavings = derivedMetrics.income - derivedMetrics.expense;
  const savingsRate = derivedMetrics.income
    ? Math.round((monthlySavings / derivedMetrics.income) * 100)
    : 0;
  const expenseCount = transactions.filter((tx) => tx.amount < 0).length;
  const averageOutgoing = expenseCount ? derivedMetrics.expense / expenseCount : 0;
  const averageIncome = incomeTransactions.length
    ? incomeTransactions.reduce((sum, tx) => sum + tx.amount, 0) / incomeTransactions.length
    : 0;
  const completedRate = filteredTransactions.length
    ? Math.round(((filteredTransactions.length - pendingTransactions.length) / filteredTransactions.length) * 100)
    : 0;

  const cards = [
    {
      id: 'c1',
      name: 'Visa Platinum',
      number: '**** 2345',
      balance: 18230.45,
      limit: 45000,
      available: 26769.55,
      due: '05 May',
      status: 'Active',
    },
    {
      id: 'c2',
      name: 'Mastercard Gold',
      number: '**** 9876',
      balance: 10350.0,
      limit: 30000,
      available: 19650.0,
      due: '12 May',
      status: 'Active',
    },
    {
      id: 'c3',
      name: 'Savings Debit',
      number: '**** 1122',
      balance: 54200.7,
      limit: 0,
      available: 54200.7,
      due: 'N/A',
      status: 'Primary',
    },
  ];

  const totalCardBalance = cards.reduce((sum, card) => sum + card.balance, 0);
  const totalAvailableCredit = cards
    .filter((card) => card.limit > 0)
    .reduce((sum, card) => sum + card.available, 0);
  const primaryCard = cards.find((card) => card.status === 'Primary') || cards[0];

  const renderDashboard = () => (
    <>
      <div className="metrics-grid">
        <StatCard
          title="Total Balance"
          value={currencyFormatter.format(derivedMetrics.totalBalance)}
          trend="All time"
          isPositive={true}
        />
        <StatCard
          title="Total Income"
          value={currencyFormatter.format(derivedMetrics.income)}
          trend="Monthly total"
          isPositive={true}
        />
        <StatCard
          title="Total Expense"
          value={currencyFormatter.format(derivedMetrics.expense)}
          trend="Monthly total"
          isPositive={false}
        />
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-primary-stack">
          <DashboardChart transactions={filteredTransactions} />

          <section className="dashboard-secondary-grid">
            <div className="glass-panel dashboard-insight-panel">
              <div className="panel-heading">
                <div>
                  <p className="section-eyebrow">Highlights</p>
                  <h2>Recent items</h2>
                </div>
              </div>

              <ul className="highlight-list">
                {recentHighlights.map((tx) => (
                  <li key={tx.id}>
                    <div>
                      <strong>{tx.description}</strong>
                      <span>{tx.category} - {tx.date}</span>
                    </div>
                    <b className={tx.amount > 0 ? 'positive' : 'negative'}>
                      {currencyFormatter.format(tx.amount)}
                    </b>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel dashboard-insight-panel">
              <div className="panel-heading">
                <div>
                  <p className="section-eyebrow">Spending pulse</p>
                  <h2>Largest outgoing items</h2>
                </div>
              </div>

              <ul className="highlight-list">
                {recentExpenses.map((tx) => (
                  <li key={tx.id}>
                    <div>
                      <strong>{tx.description}</strong>
                      <span>{tx.category} - {tx.status}</span>
                    </div>
                    <b className="negative">{currencyFormatter.format(tx.amount)}</b>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <aside className="dashboard-sidebar-stack">
          <section className="dashboard-insight-panel glass-panel">
            <div className="panel-heading">
              <div>
                <p className="section-eyebrow">Snapshot</p>
                <h2>Financial traction</h2>
              </div>
              <span className="insight-pill">{completedRate}% cleared</span>
            </div>

            <div className="insight-metric-list">
              <div>
                <span>Monthly savings</span>
                <strong>{currencyFormatter.format(monthlySavings)}</strong>
              </div>
              <div>
                <span>Savings rate</span>
                <strong>{savingsRate}%</strong>
              </div>
              <div>
                <span>Avg. outgoing</span>
                <strong>{currencyFormatter.format(averageOutgoing)}</strong>
              </div>
            </div>
          </section>

          <section className="dashboard-insight-panel glass-panel">
            <div className="panel-heading">
              <div>
                <p className="section-eyebrow">Focus items</p>
                <h2>Top spending categories</h2>
              </div>
            </div>

            <ul className="insight-list">
              {sortedCategories.map(([category, value]) => (
                <li key={category}>
                  <span>{category}</span>
                  <strong>{currencyFormatter.format(value)}</strong>
                </li>
              ))}
            </ul>
          </section>

          <section className="dashboard-insight-panel glass-panel">
            <div className="panel-heading">
              <div>
                <p className="section-eyebrow">Action items</p>
                <h2>Need attention</h2>
              </div>
            </div>

            <ul className="action-list">
              <li>
                <span>Pending transactions</span>
                <strong>{pendingTransactions.length}</strong>
              </li>
              <li>
                <span>Largest spend category</span>
                <strong>{sortedCategories[0]?.[0] || 'No data'}</strong>
              </li>
              <li>
                <span>Visible results</span>
                <strong>{filteredTransactions.length}</strong>
              </li>
            </ul>
          </section>
        </aside>
      </div>

      <section className="dashboard-project-strip glass-panel">
        <div className="panel-heading">
          <div>
            <p className="section-eyebrow">Project view</p>
            <h2>What this dashboard shows</h2>
          </div>
        </div>

        <ul className="project-points project-points-inline">
          <li>Real transaction-based chart instead of a fixed sample graph.</li>
          <li>Better-balanced sections under the chart so the dashboard has no empty gap.</li>
          <li>Clearer highlights, spending items, and action cards for faster reading.</li>
        </ul>
      </section>

      <Transactions transactions={filteredTransactions} />
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return renderDashboard();
      case 'Analytics':
        return (
          <div className="analytics-layout">
            <div className="analytics-grid">
              <div className="analytics-column-stack">
                <div className="analytics-summary glass-panel">
                  <h2>Spending Analytics</h2>
                  <p>Track your recent financial activity, category breakdown, and cash flow trends.</p>
                  <div className="analytics-metrics">
                    <div>
                      <span>Top category</span>
                      <h3>{sortedCategories[0]?.[0] || 'N/A'}</h3>
                    </div>
                    <div>
                      <span>Monthly Savings</span>
                      <h3>{currencyFormatter.format(monthlySavings)}</h3>
                    </div>
                    <div>
                      <span>Avg. expense</span>
                      <h3>{currencyFormatter.format(derivedMetrics.expense / Math.max(transactions.length, 1))}</h3>
                    </div>
                  </div>
                </div>

                <div className="glass-panel analytics-panel">
                  <div className="panel-heading">
                    <div>
                      <p className="section-eyebrow">Behavior</p>
                      <h2>Spending notes</h2>
                    </div>
                  </div>
                  <ul className="highlight-list">
                    <li>
                      <div>
                        <strong>Top category impact</strong>
                        <span>{sortedCategories[0]?.[0] || 'No category data yet'}</span>
                      </div>
                      <b>{currencyFormatter.format(sortedCategories[0]?.[1] || 0)}</b>
                    </li>
                    <li>
                      <div>
                        <strong>Pending review items</strong>
                        <span>Transactions still waiting to clear</span>
                      </div>
                      <b>{pendingTransactions.length}</b>
                    </li>
                    <li>
                      <div>
                        <strong>Income entries</strong>
                        <span>Positive transaction count in current view</span>
                      </div>
                      <b className="positive">{incomeTransactions.length}</b>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="analytics-column-stack">
                <DashboardChart transactions={filteredTransactions} />
                <div className="category-breakdown glass-panel">
                  <h2>Category Breakdown</h2>
                  <ul>
                    {sortedCategories.map(([category, value]) => (
                      <li key={category}>
                        <span>{category}</span>
                        <strong>{currencyFormatter.format(value)}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <section className="analytics-detail-grid">
              <div className="glass-panel analytics-panel">
                <div className="panel-heading">
                  <div>
                    <p className="section-eyebrow">Efficiency</p>
                    <h2>Cash flow quality</h2>
                  </div>
                </div>
                <div className="analytics-kpi-grid">
                  <div>
                    <span>Savings rate</span>
                    <strong>{savingsRate}%</strong>
                  </div>
                  <div>
                    <span>Completed rate</span>
                    <strong>{completedRate}%</strong>
                  </div>
                  <div>
                    <span>Avg. income</span>
                    <strong>{currencyFormatter.format(averageIncome)}</strong>
                  </div>
                  <div>
                    <span>Avg. outgoing</span>
                    <strong>{currencyFormatter.format(averageOutgoing)}</strong>
                  </div>
                </div>
              </div>

              <div className="glass-panel analytics-panel">
                <div className="panel-heading">
                  <div>
                    <p className="section-eyebrow">Risk view</p>
                    <h2>Pending and heavy spend</h2>
                  </div>
                </div>
                <ul className="highlight-list">
                  {recentExpenses.map((tx) => (
                    <li key={tx.id}>
                      <div>
                        <strong>{tx.description}</strong>
                        <span>{tx.category} - {tx.status}</span>
                      </div>
                      <b className="negative">{currencyFormatter.format(tx.amount)}</b>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-panel analytics-panel analytics-panel-wide">
                <div className="panel-heading">
                  <div>
                    <p className="section-eyebrow">Project fit</p>
                    <h2>Analytics section overview</h2>
                  </div>
                </div>
                <ul className="project-points project-points-inline">
                  <li>Shows performance, breakdown, and spending concentration in one place.</li>
                  <li>Fills the section with meaningful project data instead of leaving unused space.</li>
                  <li>Helps users understand savings, risk, and biggest outgoing items quickly.</li>
                </ul>
              </div>
            </section>
          </div>
        );
      case 'Cards':
        return (
          <div className="cards-layout">
            <div className="cards-grid">
              {cards.map((card) => (
                <div key={card.id} className="card-summary glass-panel">
                  <div className="card-header">
                    <div>
                      <p>{card.name}</p>
                      <span>{card.number}</span>
                    </div>
                    <span className={`card-status ${card.status.toLowerCase()}`}>{card.status}</span>
                  </div>
                  <div className="card-balance">
                    <p>Current balance</p>
                    <h3>{currencyFormatter.format(card.balance)}</h3>
                  </div>
                  <div className="card-details">
                    <div>
                      <span>Available</span>
                      <strong>{currencyFormatter.format(card.available)}</strong>
                    </div>
                    <div>
                      <span>Due date</span>
                      <strong>{card.due}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <section className="cards-extra-grid">
              <div className="glass-panel dashboard-insight-panel">
                <div className="panel-heading">
                  <div>
                    <p className="section-eyebrow">Card summary</p>
                    <h2>Portfolio overview</h2>
                  </div>
                </div>
                <div className="analytics-kpi-grid">
                  <div>
                    <span>Total card balance</span>
                    <strong>{currencyFormatter.format(totalCardBalance)}</strong>
                  </div>
                  <div>
                    <span>Available credit</span>
                    <strong>{currencyFormatter.format(totalAvailableCredit)}</strong>
                  </div>
                  <div>
                    <span>Primary account</span>
                    <strong>{primaryCard?.name || 'N/A'}</strong>
                  </div>
                  <div>
                    <span>Cards active</span>
                    <strong>{cards.filter((card) => card.status === 'Active').length}</strong>
                  </div>
                </div>
              </div>

              <div className="glass-panel dashboard-insight-panel">
                <div className="panel-heading">
                  <div>
                    <p className="section-eyebrow">Card actions</p>
                    <h2>Upcoming payment notes</h2>
                  </div>
                </div>
                <ul className="highlight-list">
                  {cards.map((card) => (
                    <li key={`${card.id}-note`}>
                      <div>
                        <strong>{card.name}</strong>
                        <span>{card.number} - due {card.due}</span>
                      </div>
                      <b>{card.limit > 0 ? currencyFormatter.format(card.available) : 'Ready'}</b>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-panel dashboard-insight-panel cards-project-strip">
                <div className="panel-heading">
                  <div>
                    <p className="section-eyebrow">Project view</p>
                    <h2>Card section details</h2>
                  </div>
                </div>
                <ul className="project-points project-points-inline">
                  <li>Shows card balance, due dates, and available amount in one place.</li>
                  <li>Fills the Cards page with useful supporting details instead of empty space.</li>
                  <li>Gives a quick portfolio overview for project presentation.</li>
                </ul>
              </div>
            </section>
          </div>
        );
      case 'Transactions':
        return <Transactions transactions={filteredTransactions} />;
      default:
        return (
          <div className="placeholder-tab glass-panel">
            <h2>{activeTab}</h2>
            <p>This section shows useful financial data related to your project.</p>
          </div>
        );
    }
  };

  return (
    <div className="app-layout">
      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="main-content-layout">
        <Topbar
          onMenuClick={() => setIsSidebarOpen(true)}
          onSearch={handleSearch}
          searchValue={searchQuery}
        />
        <main className="dashboard-content">{renderContent()}</main>
      </div>
    </div>
  );
}

export default Dashboard;
