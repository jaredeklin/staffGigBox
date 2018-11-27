import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import ScheduleContainer from '../ScheduleContainer/ScheduleContainer';
import { Availability } from '../Availability/Availability';
import { StaffForm } from '../StaffForm/StaffForm';
import { EventForm } from '../EventForm/EventForm';

export const Routes = props => {
  const { currentUser, addEvent, addStaff, admin } = props;

  return (
    <Switch>
      {/* <Route exact path="/" /> */}
      <Route
        exact
        path="/schedule"
        render={() => (
          <ScheduleContainer methods={methods} appState={appState} />
        )}
      />
      <Route
        path="/schedule/ogden"
        render={() => (
          <ScheduleContainer methods={methods} appState={appState} />
        )}
      />
      <Route
        path="/schedule/gothic"
        render={() => (
          <ScheduleContainer methods={methods} appState={appState} />
        )}
      />
      <Route
        path="/schedule/bluebird"
        render={() => (
          <ScheduleContainer methods={methods} appState={appState} />
        )}
      />
      <Route
        path="/schedule/individual"
        render={() => (
          <ScheduleContainer methods={methods} appState={appState} />
        )}
      />
      <Route
        path="/unscheduled-events"
        render={() => (
          <ScheduleContainer methods={methods} appState={appState} />
        )}
      />
      {appState.currentUser.staff_id && (
        <Route
          path="/availability"
          render={() => (
            <Availability currentUserId={appState.currentUser.staff_id} />
          )}
        />
      )}
      {appState.currentUser.google_id && (
        <Route
          path="/add-staff"
          render={() => (
            <StaffForm
              addStaff={addStaff}
              id={appState.currentUser.google_id}
            />
          )}
        />
      )}
      <Route
        path="/add-events"
        render={() => <EventForm addEvent={addEvent} />}
      />
      <Route render={() => <Redirect to="/schedule" />} />
    </Switch>
  );
};

export default Routes;
