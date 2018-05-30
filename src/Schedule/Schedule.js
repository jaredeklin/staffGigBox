import React from 'react'
import './Schedule.css';
import EditStaffSelect from '../EditStaffSelect/EditStaffSelect';

export const Schedule = ({ event, deleteFromSchedule, staffList }) => {
  console.log('sked', event)
  const { venue, name, date, time, staff, event_id } = event;

  const displayStaff = staff.map((person, index) => {

    return (
      <li key={ person.staff_events_id }>
        {person.name}
        <button
          className='delete'
          onClick={() => deleteFromSchedule(person.staff_events_id)}
        ></button>
        <button className='edit'></button>
      </li>
    )
  })

  return (
    <section className='schedule-card'>
      <div className='schedule-container'>
        <h4>{ date }</h4>
        <h4>{ venue }</h4>
        <h4>{ time }</h4>
      </div>
      <h2>{ name }</h2>
      <h5>Crew</h5>
      <EditStaffSelect staff={ staffList } event_id={ event_id }/>
      <ul>
        { displayStaff }
      </ul>
    </section>
  )
}
