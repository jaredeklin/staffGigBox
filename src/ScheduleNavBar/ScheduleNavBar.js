import React from 'react';
import { NavLink } from 'react-router-dom';

const ScheduleNavBar = () => {
  return (
    <ul className="header-nav-list">
      <NavLink to="/schedule" exact>
        <li>All Venues</li>
      </NavLink>
      <NavLink to="/schedule/ogden" exact>
        <li>Ogden Theatre</li>
      </NavLink>
      <NavLink to="/schedule/gothic" exact>
        <li>Gothic Theatre</li>
      </NavLink>
      <NavLink to="/schedule/bluebird" exact>
        <li>Bluebird Theater</li>
      </NavLink>
      <NavLink to="/schedule/individual" exact>
        <li>Your Schedule</li>
      </NavLink>
    </ul>
  );
};

export default ScheduleNavBar;
