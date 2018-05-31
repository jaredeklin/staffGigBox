import React, { Component } from 'react'
import './Schedule.css';
import { EditStaffSelect } from '../EditStaffSelect/EditStaffSelect';

export class Schedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      staff_id: '',
      event_id: '',
      staff_events_id: '',
      edit: false
    }
  }

  updateEventStaff = async ({staff_id, event_id}) => {
    console.log(event_id)
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


  render() {
    const { venue, name, date, time, staff, event_id } = this.props.event

    const displayStaff = staff.map((person, index) => {

      return (
        <li key={ person.staff_events_id }>
          {person.name}
          <button
            className='delete'
            onClick={() => this.props.deleteFromSchedule(person.staff_events_id)}
            ></button>
            <button className='edit'
              onClick={() => this.setState({
                edit: !this.state.edit,
                staff_events_id: person.staff_events_id
              })}></button>
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
        {
          this.state.edit &&
          <EditStaffSelect
            staff={ this.props.staffList }
            event_id={ event_id }
            updateEventStaff={ this.updateEventStaff }
          />
        }
        <ul>
          { displayStaff }
        </ul>
      </section>
    )
  }
}
