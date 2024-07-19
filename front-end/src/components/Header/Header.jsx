import React from 'react';
import './Header.css'; // Import the CSS file

const Header = ({ pageTitle }) => {
  return (
    <div className="header">
      <h1>{pageTitle}</h1>
    </div>
  );
};

export default Header;
