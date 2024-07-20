import React from 'react';
import { BrowserRouter as Router, Routes, Route ,useLocation} from 'react-router-dom';
import Accounts from './components/Accounts/Accounts';
import Transactions from './components/Transactions/Transactions';
import Home from './pages/home';
import Sidebar from './components/Sidebar/Sidebar';
import './App.css'; 
import Header from './components/Header/Header';

const App = () => {
  const location = useLocation();
  let pageName = '';

  switch (location.pathname) {
    case '/':
      pageName = 'Home';
      break;
    case '/accounts':
      pageName = 'Accounts';
      break;
    case '/transactions':
      pageName = 'Transactions';
      break;
    default:
      pageName = 'Page Not Found';
  }

  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-content">
      <Header pageName={pageName} />

        <Routes>
          <Route path="/" element={<Accounts />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </div>
    </div>
  );
};

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;