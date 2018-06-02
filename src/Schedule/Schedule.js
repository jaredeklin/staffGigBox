import React, { Component } from 'react'
import './Schedule.css';
import { EditStaffSelect } from '../EditStaffSelect/EditStaffSelect';
import { Api } from '../Api'

export class Schedule extends Component {
  constructor(props) {
    super(props);
    this.api = new Api()
    this.state = {
      staff_id: '',
      event_id: '',
      staff_events_id: '',
      edit: false,
      manualSchedule: false || this.props.manualSchedule
      // staffNeeded: this.api.getNumberOfStaff(this.props.scheduleData)
    }
  }

  updateEventStaff = async ({staff_id, event_id}) => {
    console.log('staff:', staff_id, 'event', event_id)
    const response = await fetch(`http://localhost:3000/api/v1/schedule/${this.state.staff_events_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        staff_id,
        event_id
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log(await response.json())
    this.props.editSchedule()
    this.setState({ edit: false })
  }


  handleEditClick = (person) => {
    console.log(person)
    this.setState({ edit: !this.state.edit })

    if ( !this.state.manualSchedule ) {
      this.setState({
        staff_events_id: person.staff_events_id
      })
    } 
  }

  displayEmpty = () => {
    let staffNeeded = this.api.getNumberOfStaff(this.props.scheduleData)
    const emptyStaffArray = []

    for (let i = 0; i < staffNeeded; i++) {
      emptyStaffArray.push(`Staff ${i + 1}`)
    }

    return emptyStaffArray.map((staff) => {

      return (
        <li>{staff}
          <button 
            className='edit' 
            onClick={ () => this.handleEditClick(this.props.event.event_id)}>
          </button>
        </li>)
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

  addSchedule = () => {

  }

  render() {
    const { venue, name, date, time, staff, event_id } = this.props.event

    const handleEditDropdown = (event_id) => {
      
      if( this.state.edit ) {

        return (
          <EditStaffSelect
            staff={ this.props.staffList }
            // manualSchedule={}
            // this.props.manualSchedule or this.state.manualSchdule ?
            // or none at all
            event_id={ event_id }
            updateEventStaff={ this.props.manualSchedule ? this.addSchedule : this.updateEventStaff }
          />
        ) 
      }
    }

    return (
      <section className='schedule-card'>
        <div className='schedule-container'>
          <h4>{ date }</h4>
          <h4>{ venue }</h4>
          <h4>{ time }</h4>
        </div>
        <h2>{ name }</h2>
        <h5>Crew</h5>
        { handleEditDropdown(event_id) }
        <ul>
          { this.props.manualSchedule ? this.displayEmpty() : this.displayStaff() }
        </ul>
      </section>
    )
  }
}
