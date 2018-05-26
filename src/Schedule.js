import React from 'react'
import './Schedule.css'

export const Schedule = ({ event }) => {

  const { venue, name, date, time, staff } = event;
  
  const displayStaff = staff.map(person => {

    return (<li>{person}</li>)
  })

  return (
    <section className='schedule-card'>
      <h4>{ venue }</h4>
      <h4>{ name }</h4>
      <h6>{ date }</h6>
      <h6>{ time }</h6>
      <ul>
        { displayStaff }
      </ul>
    </section>
  )
}