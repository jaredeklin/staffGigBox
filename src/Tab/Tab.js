import React from 'react';
import PropTypes from 'prop-types';

export const Tab = ({ isActive, tabName, handleTabClick }) => (
  <li
    className={`tab ${isActive ? 'active' : ''}`}
    onClick={() => handleTabClick(tabName)}
  >
    {tabName}
  </li>
);

Tab.propTypes = {
  isActive: PropTypes.bool,
  tabName: PropTypes.string,
  handleTabClick: PropTypes.func
};
