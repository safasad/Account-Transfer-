import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './components/Sidebar/Sidebar';
import Accounts from './components/Accounts/Accounts';
import Transactions from './components/Transactions/Transactions';
import './App.css'; // Import the CSS file

const App = () => {
  const [view, setView] = useState('accounts');
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
  const toggleSidebar = (isOpen) => {
    setSidebarOpen(isOpen); // Update sidebarOpen state
  };
  return (
    <Container fluid className="app-container">
      <Row>
        {/* Sidebar */}
        <Col xs={12} md={sidebarOpen ? 2 : 1} lg={sidebarOpen ? 2 : 1} className="sidebar-col">
          <Sidebar setView={setView} toggleSidebar={toggleSidebar} />
        </Col>
        {/* Main Content */}
        <Col xs={12} md={sidebarOpen ? 10 : 11} lg={sidebarOpen ? 10 : 11}
         className="main-content">
          <header className="main-header">
            <h3>{getPageTitle()}</h3>
          </header>
          <div className="grid-container">
            {view === 'accounts' && <Accounts />}
            {view === 'transactions' && <Transactions />}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default App;
