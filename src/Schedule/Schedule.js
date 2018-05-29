import React from 'react'
import './Schedule.css'

export const Schedule = ({ event }) => {

  const { venue, name, date, time, staff } = event;

  const displayStaff = staff.map((person, index) => {

    return (<li key={ person.staff_events_id }>{person.name}</li>)
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
      <ul>
        { displayStaff }
      </ul>
    </section>
  )
}
