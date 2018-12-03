import React from 'react';
import { withRouter } from 'react-router-dom';
import ScheduleNavBar from '../ScheduleNavBar/ScheduleNavBar';
import { Api } from '../Api/Api';

const api = new Api();

const Header = ({ location }) => {
  return (
    <header className="main-header">
      <h1>{api.getHeaderText(location)}</h1>
      {location.pathname.includes('/schedule') && <ScheduleNavBar />}
    </header>
  );
};

export default withRouter(Header);
