import React, { Component } from 'react';
import './EventForm.css';


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
      <h4 className='event-header'>Add an event</h4>
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
          <input
            placeholder='Name'
            name='name' value={ name }
            onChange={ this.handleChange }
            className='input_event-form'
          />
          <input
            type='date'
            placeholder='Date'
            name='date' value={ date }
            onChange={ this.handleChange }
            onFocus={this.showCalendar}
            className='input_event-form'
            />
          <input
            placeholder='Time'
            name='time'
            value={ time }
            onChange={ this.handleChange }
            className='input_event-form'
          />
      </div>
      <div className='staff-info'>
        <label className='form-label'>
          Bar Manager needed?
          <input type='radio'
            id= 'yes'
            value={ true }
            name='bar_manager'
            onChange={ this.handleChange }
            
           />
          <label htmlFor='yes'>Yes</label>

          <input
            type='radio'
            id= 'no'
            value={ false }
            name='bar_manager'
            onChange={ this.handleChange }
          />
          <label htmlFor='no'>No</label>
        </label>
        <label className='form-label'>
          Assistant Bar Manager needed?
          <input type='radio'
            id= 'yes'
            value={ true }
            name='ass_bar_manager'
            onChange={ this.handleChange }
            
           />
          <label htmlFor='yes'>Yes</label>

          <input type='radio' id= 'no' value={ false } name='ass_bar_manager' onChange={ this.handleChange } />
          <label htmlFor='no'>No</label>

        </label>
        <input
          className='input_event-form'
          placeholder='Number of bartenders needed'
          name='bartenders'
          value={ bartenders }
          onChange={ this.handleChange } />
        <input
          className='input_event-form'
          placeholder='Number of barbacks needed'
          name='barbacks'
          value={ barbacks }
          onChange={ this.handleChange } />
        <label className='form-label'>
          Beer Bucket?
          <input type='radio'
            id= 'yes'
            value={ true }
            name='beer_bucket'
            onChange={ this.handleChange }
           />
          <label htmlFor='yes'>Yes</label>

          <input
            type='radio'
            id= 'no'
            value={ false }
            name='beer_bucket'
            onChange={ this.handleChange }

          />
          <label htmlFor='no'>No</label>
        </label>
      </div>
        <button className='add-event-btn'>Add Event</button>
      </form>
      <button className='generate-schedule-btn' onClick={ this.props.postSchedule }>Generate schedule</button>
    </div>
    )
  }
}
