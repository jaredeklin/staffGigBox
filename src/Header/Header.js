import React from 'react';
import { withRouter } from 'react-router-dom';
import ScheduleNavBar from '../ScheduleNavBar/ScheduleNavBar';

const Header = ({ location }) => {
  const getHeaderText = () => {
    switch (location.pathname) {
      case '/availability':
        return 'Availability';

      case '/add-events':
        return 'Add Events';

      case '/add-staff':
        return 'Add Staff';

      case '/unscheduled-events':
        return 'Unscheduled Events';

      default:
        return 'Schedule';
    }
  };

  return (
    <header className="main-header">
      <h1>{getHeaderText()}</h1>
      {location.pathname.includes('/schedule') && <ScheduleNavBar />}
    </header>
  );
};

export default withRouter(Header);
