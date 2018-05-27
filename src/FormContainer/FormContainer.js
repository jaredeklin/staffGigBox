import React from 'react'
import { EventForm } from '../EventForm/EventForm';
import { StaffForm } from '../StaffForm/StaffForm';
import { Schedule } from '../Schedule/Schedule';
import './FormContainer.css'


export const FormContainer = ({ schedule, postSchedule }) => {


  // {
  //         this.state.isCurrentStaff &&
  //         <EventForm name={ this.state.user.uid } />
  //       }
  //       {
  //         this.state.addNewStaff &&
  //         <StaffForm user={ this.state.user } addStaff={ this.addStaff }/>
  //       }

  console.log(schedule)

  const displaySchedule = schedule.map(event => {
    // const { venue, name, date, time, staff } = event;

    return <Schedule event={event} />
  })

  return (
    <section className='tab-container' >
      <input className='radio-btn' type="radio" id="tab1" name="tab" checked />
      <label className= 'tab-label' for="tab1">Event Form</label>
      <article id="content1" class="content">
        <EventForm postSchedule={ postSchedule }/>
      </article>
      <input className='radio-btn' type="radio" id="tab2" name="tab" />
      <label className= 'tab-label' for="tab2">StaffForm</label>
      <article id="content2" class="content">
        <StaffForm />
      </article>
      <input className='radio-btn' type="radio" id="tab3" name="tab" />
      <label className= 'tab-label' for="tab3">Schedule</label>
      <article id="content3" class="content">
        { displaySchedule }
      </article>
    </section>
  )
}
