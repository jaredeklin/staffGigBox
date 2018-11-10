import React from 'react';
import { Schedule } from '../Schedule/Schedule';

const UnscheduledEventsContainer = ({
  unscheduledEvents,
  staff,
  editSchedule,
  deleteFromSchedule,
  admin,
  scheduleGenerator
}) => {
  const mapEvents = unscheduledEvents.map(event => {
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
      {!unscheduledEvents.length && <h4>There are no unscheduledEvents</h4>}
      <h4>Would you like to fill all unscheduled events?</h4>
      <button className="generate-schedule-btn" onClick={scheduleGenerator}>
        Generate schedule
      </button>
      {mapEvents}
    </div>
  );
};

export default UnscheduledEventsContainer;
