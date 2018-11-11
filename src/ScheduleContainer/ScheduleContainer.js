import React from 'react';
import PropTypes from 'prop-types';
import { Schedule } from '../Schedule/Schedule';

const ScheduleContainer = ({
  unscheduledEvents,
  staff,
  editSchedule,
  deleteFromSchedule,
  admin,
  scheduleGenerator,
  schedule,
  type
}) => {
  const events = schedule.map(event => {
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
      {type === 'Unscheduled Events' && (
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
  admin: PropTypes.bool,
  scheduleGenerator: PropTypes.func,
  type: PropTypes.string
};

export default ScheduleContainer;
