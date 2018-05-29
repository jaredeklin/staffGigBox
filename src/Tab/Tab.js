import React from 'react'

export const Tab = ({ isActive, tabName, tabIndex, handleTabClick }) => {

  return (
      <li 
        className={`tab ${ isActive ? 'active' : '' }`}
        onClick={ () => handleTabClick(tabIndex) }>
        { tabName }
      </li>
    );
}