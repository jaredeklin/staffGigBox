import React from 'react'

export const Tab = ({ isActive, tabName, handleTabClick }) => {

  return (
    <li 
      className={`tab ${ isActive ? 'active' : '' }`}
      onClick={ () => handleTabClick(tabName) }>
      { tabName }
    </li>
  );
}