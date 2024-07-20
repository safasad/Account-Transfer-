import React from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import { FaBars, FaUser, FaExchangeAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css"; 

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <Navbar collapseOnSelect fixed="left" bg="dark" expand="sm" variant="dark" className="sidebar-nav">
      <Container>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="col-md-12 d-none d-md-block sidebar">
            <Nav.Item>
              <Nav.Link onClick={() => navigate('/accounts')}>
                <FaUser className="sidebar-icon" />
                <span className="link-title">Accounts</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => navigate('/transactions')}>
                <FaExchangeAlt className="sidebar-icon" />
                <span className="link-title">Transactions</span>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Sidebar;
