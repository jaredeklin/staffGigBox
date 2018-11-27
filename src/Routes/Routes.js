import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import ScheduleContainer from '../ScheduleContainer/ScheduleContainer';
import { Availability } from '../Availability/Availability';
import { StaffForm } from '../StaffForm/StaffForm';
import { EventForm } from '../EventForm/EventForm';
import { PropsRoute, PrivateRoute } from 'react-router-with-props';

export const Routes = props => {
  const { currentUser, addEvent, addStaff, admin } = props;

  return (
    <Switch>
      <PropsRoute
        exact
        path="/schedule"
        component={ScheduleContainer}
        {...props}
      />
      <PrivateRoute
        path="/schedule/ogden"
        authed={currentUser.staff_id}
        redirectTo="/"
        component={ScheduleContainer}
        {...props}
      />
      <PrivateRoute
        path="/schedule/gothic"
        authed={currentUser.staff_id}
        redirectTo="/"
        component={ScheduleContainer}
        {...props}
      />
      <PrivateRoute
        path="/schedule/bluebird"
        authed={currentUser.staff_id}
        redirectTo="/"
        component={ScheduleContainer}
        {...props}
      />
      <PrivateRoute
        path="/schedule/individual"
        authed={currentUser.staff_id}
        redirectTo="/"
        component={ScheduleContainer}
        {...props}
      />
      <PrivateRoute
        path="/unscheduled-events"
        authed={admin}
        redirectTo="/"
        component={ScheduleContainer}
        {...props}
      />
      {currentUser.staff_id && (
        <PrivateRoute
          path="/availability"
          authed={admin}
          redirectTo="/"
          component={Availability}
          currentUserId={currentUser.staff_id}
        />
      )}
      {currentUser.google_id && (
        <PrivateRoute
          path="/add-staff"
          authed={admin}
          redirectTo="/"
          component={StaffForm}
          addStaff={addStaff}
          id={currentUser.google_id}
        />
      )}
      <PrivateRoute
        path="/add-events"
        authed={admin}
        redirectTo="/"
        component={EventForm}
        addEvent={addEvent}
      />
      <Redirect to="/schedule" /> />
    </Switch>
  );
};

export default Routes;
