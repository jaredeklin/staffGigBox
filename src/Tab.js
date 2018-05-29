import React from 'react'

export const Tab = ({ isActive, tabName, tabIndex, handleTabClick }) => {

  return (
      <li className="tab">
        <a className={`tab-link ${ isActive ? 'active' : '' }`}
           onClick={ () => handleTabClick(tabIndex) }>{ tabName }
        </a>
      </li>
    );
}