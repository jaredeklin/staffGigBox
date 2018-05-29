import React, { Component } from 'react';
import './EventForm.css';

import DayPicker from 'react-day-picker'
import 'react-day-picker/lib/style.css';

export class EventForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      venue: 'Ogden Theatre',
      name: '',
      date: '',
      time: '',
      bar_manager: true,
      ass_bar_manager: true,
      bartenders: '',
      barbacks: '',
      beer_bucket: false
    }

    this.defaultState = this.state
  }

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()

    const response = await fetch('http://localhost:3000/api/v1/events', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: { 'Content-Type': 'application/json'}
    })

    const eventData = await response.json();
    console.log(eventData)

    this.setState(this.defaultState)
  }

  // showCalendar = (event) => {
  //   console.log(event)

  //   // return <DayPicker />
  // }

  render() {

    const { venue, name, date, time, bar_manager, ass_bar_manager, bartenders, barbacks, beer_bucket } = this.state

    return (
    <div className='event-div'>
      <form className= 'event-form' onSubmit={this.handleSubmit}>
        <div className='venue-info'>
          <label className='form-label'>
            Venue
            <select className='event-select' name='venue' value={ venue } onChange={ this.handleChange }>
              <option value='Ogden Theatre'>Ogden Theatre</option>
              <option value='Gothic Theatre'>Gothic Theatre</option>
              <option value='Bluebird Theater'>Bluebird Theater</option>
            </select>
          </label>
          <input placeholder='Name' name='name' value={ name } onChange={ this.handleChange } />
          <input
            type='date'
            placeholder='Date'
            name='date' value={ date }
            onChange={ this.handleChange }
            onFocus={this.showCalendar}
            />
          <input placeholder='Time' name='time' value={ time } onChange={ this.handleChange } />
      </div>
      <div className='staff-info'>
        <label className='form-label'>
          Bar Manager needed?
          <select name='bar_manager' value={ bar_manager } onChange={ this.handleChange }>
            <option value={ true }>Yes</option>
            <option value={ false }>No</option>
          </select>
        </label>
        <label className='form-label'>
          Assistant Bar Manager needed?
          <select name='ass_bar_manager' value={ ass_bar_manager } onChange={ this.handleChange }>
            <option value={ true }>Yes</option>
            <option value={ false }>No</option>
          </select>
        </label>
        <input placeholder='Number of bartenders needed' name='bartenders' value={ bartenders } onChange={ this.handleChange } />
        <input placeholder='Number of barbacks needed' name='barbacks' value={ barbacks } onChange={ this.handleChange } />
        <label className='form-label'>
          Beer Bucket?
          <select name='beer_bucket' value={ beer_bucket } onChange={ this.handleChange }>
            <option value={ true }>Yes</option>
            <option value={ false }>No</option>
          </select>
        </label>
      </div>
        <button className='add-event-btn'>Add Event</button>
      </form>
      <button className='generate-schedule-btn' onClick={ this.props.postSchedule }>Generate schedule</button>
    </div>
    )
  }
}
