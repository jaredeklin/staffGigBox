import React, { Component } from 'react';
import './EventForm.css';
import { Api } from '../Api/Api';
import PropTypes from 'prop-types';


export class EventForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      venue: 'Ogden Theatre',
      name: '',
      date: '',
      time: '18:00',
      bar_manager: '',
      ass_bar_manager: '',
      bartenders: '',
      barbacks: '',
      beer_bucket: '',
      manualSchedule: ''
    };

    this.defaultState = this.state;
    this.api = new Api();
    this.url = process.env.REACT_APP_API_HOST || 'http://localhost:3000/';
  }

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { 
      venue, 
      name,  
      bar_manager, 
      ass_bar_manager, 
      bartenders,
      barbacks, 
      beer_bucket, 
      manualSchedule 
    } = this.state;

    const dateTime = this.api.cleanDateTime(this.state.date, this.state.time);
    const { date, time } = dateTime; 

    const eventObj = {
      venue,
      name,
      date,
      time,
      bar_manager,
      ass_bar_manager,
      bartenders,
      barbacks,
      beer_bucket
    };

    const response = await fetch(`${this.url}api/v1/events`, {
      method: 'POST',
      body: JSON.stringify(eventObj),
      headers: { 'Content-Type': 'application/json'}
    });

    if (response.status === 201) {
      const eventData = await response.json();

      if ( manualSchedule ) {
        const newEventStaffArray = this.api.buildScheduleWithRoles(eventData);

        await this.api.postSchedule(newEventStaffArray);

        const newEventSchedule = await this.api.getSchedule(eventData.id);
        
        this.props.checkManualSchedule(newEventSchedule, manualSchedule);
        this.setState(this.defaultState);
      }
    }
  }

  render() {

    const { venue, name, date, time, bartenders, barbacks } = this.state;

    return (
      <div className='event-div'>
        <h4 className='event-header'>Add an event</h4>
        <form className= 'event-form' onSubmit={this.handleSubmit}>
          <div className='venue-info'>
            <label className='form-label'>
              Venue
              <select 
                className='event-select' 
                name='venue' 
                value={ venue } 
                onChange={ this.handleChange }
              >
                <option value='Ogden Theatre'>Ogden Theatre</option>
                <option value='Gothic Theatre'>Gothic Theatre</option>
                <option value='Bluebird Theater'>Bluebird Theater</option>
              </select>
            </label>
            <input
              placeholder='Band name'
              name='name' value={ name }
              onChange={ this.handleChange }
              className='input_event-form'
            />
            <input
              type='date'
              placeholder='Date'
              name='date' 
              value={ date }
              onChange={ this.handleChange }
              onFocus={this.showCalendar}
              className='input_event-form'
            />
            <input
              placeholder='Time'
              type='time'
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

              <input
                type='radio'
                id= 'no' value={ false }
                name='ass_bar_manager'
                onChange={ this.handleChange }
              />
              <label htmlFor='no'>No</label>

            </label>
            <input
              className='input_event-form'
              type='number'
              min='0'
              placeholder='Number of bartenders needed'
              name='bartenders'
              value={ bartenders }
              onChange={ this.handleChange } />
            <input
              className='input_event-form'
              type='number'
              min='0'
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
            <label className='form-label'>
            Would like to assign staff to this event?
              <input type='radio'
                id= 'yes'
                value={ true }
                name='manualSchedule'
                onChange={ this.handleChange }
              />
              <label htmlFor='yes'>Yes</label>
              <input
                type='radio'
                id= 'no'
                value={ false }
                name='manualSchedule'
                onChange={ this.handleChange }
              />
              <label htmlFor='no'>No</label>
            </label>
          </div>
          <button className='add-event-btn'>Add Event</button>
        </form>
        <button
          className='generate-schedule-btn'
          onClick={ this.props.scheduleGenerator }
        >Generate schedule</button>
      </div>
    );
  }
}

EventForm.propTypes = {
  venue: PropTypes.string,
  name: PropTypes.string,
  date: PropTypes.string,
  time: PropTypes.string,
  bar_manager: PropTypes.string,
  ass_bar_manager: PropTypes.string,
  bartenders: PropTypes.string,
  barbacks: PropTypes.string,
  beer_bucket: PropTypes.string,
  manualSchedule: PropTypes.string,
  checkManualSchedule: PropTypes.func,
  scheduleGenerator: PropTypes.func
};
