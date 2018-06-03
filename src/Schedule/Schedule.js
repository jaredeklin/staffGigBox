import React, { Component } from 'react'
import './Schedule.css';
import { EditStaffSelect } from '../EditStaffSelect/EditStaffSelect';
import { Api } from '../Api/Api';

export class Schedule extends Component {
  constructor(props) {
    super(props);
    this.api = new Api();
    this.state = {
      staff_id: '',
      event_id: '',
      staff_events_id: '',
      edit: false,
      manualSchedule: false || this.props.manualSchedule,
    }
  }

  updateEventStaff = async ({staff_id, event_id}) => {
    console.log('staff:', staff_id, 'event', event_id)
    
    const response = await fetch(`http://localhost:3000/api/v1/schedule/${this.state.staff_events_id}`, {
      method: 'PUT',
      body: JSON.stringify({ staff_id, event_id }),
      headers: { 'Content-Type': 'application/json' }
    })

    console.log(await response.json())

    if( this.state.manualSchedule ) {
      this.props.updateSchedule(event_id)
    } else {
      this.props.editSchedule()
    }

    this.setState({ edit: false })
  }

  handleEditClick = (person) => {

    this.setState({ 
      edit: !this.state.edit,
      staff_events_id: person.staff_events_id 
    })
  }

 

  displayStaff = () => {
    return this.props.event.staff.map((person, index) => {

      return (
        <li>
          {person.name}
          <button
            className='delete'
            onClick={ () => this.props.deleteFromSchedule(person.staff_events_id) }>
          </button>
          <button
            className='edit'
            onClick={ () => this.handleEditClick(person) }>
          </button>
        </li>
      )
    })
  }


  handleEditDropdown = (event_id) => {
    return (
      <EditStaffSelect
        staff={ this.props.staffList }
        createEventStaff={ this.createEventStaff }
        manualSchedule={ this.state.manualSchedule }
        event_id={ event_id }
        updateEventStaff={ this.updateEventStaff }
      />
    ) 
  }

  render() {

    const { venue, name, date, time, event_id } = this.props.event

    return (
      <section className='schedule-card'>
        <div className='schedule-container'>
          <h4>{ date }</h4>
          <h4>{ venue }</h4>
          <h4>{ time }</h4>
        </div>
        <h2>{ name }</h2>
        <h5>Crew</h5>
        { 
          this.state.edit && 
          this.handleEditDropdown( event_id ) 
        }
        <ul>
          { this.displayStaff() }
        </ul>
      </section>
    )
  }
}
