import React from 'react';
import './Header.css'; 

const Header = ({ pageName }) => {
  return (
    <div className="main-header" >
      <h3>{pageName}</h3>
    </div>
  );
};

export default Header;
