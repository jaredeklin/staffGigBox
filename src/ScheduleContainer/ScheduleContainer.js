import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Schedule } from '../Schedule/Schedule';
const moment = require('moment');

const ScheduleContainer = ({
  location
}) => {
  const getVenueSchedule = venue => {
    return schedule.filter(event => event.venue === venue);
  };
  const getIndividualSchedule = () => {
    const individualSchedule = schedule.filter(event => {
      return event.staff.find(staff => staff.staff_id === currentUser.staff_id);
    });

    return individualSchedule;
  };
    const date1 = moment(a.date, 'YYYY-MM-DD');
    const date2 = moment(b.date, 'YYYY-MM-DD');
    return date1 - date2;
  });

  const events = sortedSchedule.map(event => {
    return (
      <Schedule
        editSchedule={editSchedule}
        staff={staff}
        event={event}
        key={event.event_id}
        deleteFromSchedule={deleteFromSchedule}
        admin={admin}
      />
    );
  });

  return (
    <div>
      {location.pathname.includes('unscheduled') && (
        <div>
          {!unscheduledEvents.length && <h4>There are no unscheduledEvents</h4>}
          <h4>Would you like to fill all unscheduled events?</h4>
          <button className="generate-schedule-btn" onClick={scheduleGenerator}>
            Generate schedule
          </button>
        </div>
      )}
      {events}
    </div>
  );
};

ScheduleContainer.propTypes = {
  editSchedule: PropTypes.func,
  staff: PropTypes.arrayOf(PropTypes.object),
  event: PropTypes.arrayOf(PropTypes.object),
  schedule: PropTypes.arrayOf(PropTypes.object),
  unscheduledEvents: PropTypes.arrayOf(PropTypes.object),
  deleteFromSchedule: PropTypes.func,
  admin: PropTypes.bool,
  scheduleGenerator: PropTypes.func,
  scheduleType: PropTypes.string
};

export default withRouter(ScheduleContainer);
