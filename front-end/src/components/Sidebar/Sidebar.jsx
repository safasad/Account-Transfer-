import React, { useState } from 'react';
import { Nav, Button, Collapse } from 'react-bootstrap';
import { FaBars, FaUser, FaExchangeAlt } from 'react-icons/fa';
import './Sidebar.css'; // Import the CSS file
import Transactions from './../Transactions/Transactions';

const Sidebar = ({ setView, toggleSidebar }) => {
  const [open, setOpen] = useState(true);

  const handleToggle = () => {
    setOpen(!open);
    toggleSidebar(!open); // Notify parent component of toggle state
  };

  return (
    <div className={`sidebar-container ${open ? 'open' : 'closed'}`}>
      <Button
        onClick={handleToggle}
        aria-controls="sidebar"
        aria-expanded={open}
        className="sidebar-toggle"
      >
        <FaBars className="sidebar-icon" />
      </Button>
      <Collapse in={open}>
        <div id="sidebar">
          <Nav
            className="col-md-12 d-none d-md-block sidebar"
            activeKey="/home"
            onSelect={(selectedKey) => setView(selectedKey)}
          >
            <div className="sidebar-sticky"></div>
            <Nav.Item>
              <Nav.Link eventKey="accounts">
                <FaUser className="sidebar-icon" /> <span className='link-title'>Accounts</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="transactions">
                <FaExchangeAlt className="sidebar-icon" /> <span className='link-title'>Transactions</span>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
      </Collapse>
      {!open && (
        <div className="collapsed-sidebar-icons">
          <FaUser className="collapsed-icon" />
          <FaExchangeAlt className="collapsed-icon" />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
