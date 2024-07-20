import React from 'react';
import './Header.css'; // Import the CSS file

const Header = ({ pageName }) => {
  return (
    <div className="main-header" >
      <h3>{pageName}</h3>
    </div>
  );
};

export default Header;
