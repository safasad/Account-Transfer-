import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Accounts from './components/Accounts';
import Transactions from './components/Transactions';
import './App.css'; // Import the CSS file

const App = () => {
  const [view, setView] = useState('accounts');

  const getPageTitle = () => {
    switch (view) {
      case 'accounts':
        return 'Accounts';
      case 'transactions':
        return 'Transactions';
      default:
        return 'Dashboard'; // Default page title
    }
  };

  return (
    <div className="app-container">
      <Sidebar setView={setView} />
      <Header pageTitle={getPageTitle()} />
      <div className="main-content">
        {view === 'accounts' && <Accounts />}
        {view === 'transactions' && <Transactions />}
      </div>
    </div>
  );
};

export default App;
