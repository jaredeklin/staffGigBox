import React, { Component } from 'react';
import './EventForm.css';
import { Api } from '../Api/Api';
import PropTypes from 'prop-types';

const moment = require('moment');

export class EventForm extends Component {
  constructor(props) {
    super(props);
    this.api = new Api();
    this.url = process.env.REACT_APP_API_HOST || 'http://localhost:3000/';
    this.state = {
      venue: 'Ogden Theatre',
      name: '',
      date: '',
      time: '18:00',
      bar_manager: '',
      ass_bar_manager: '',
      bartenders: '',
      barbacks: '',
      beer_bucket: ''
      // manualSchedule: ''
    };

    this.defaultState = this.state;
  }

  handleChange = event => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const { date, time } = this.state;
    const dateWithTime = date + ' ' + time;
    const eventObj = {
      ...this.state,
      time: moment(dateWithTime, 'YYYY-MM-DD H:mm').format('h:mm a')
    };

    const eventData = await this.postEvent(eventObj);
    const emptyScheduleArray = this.api.buildScheduleWithRoles(eventData);
    const emptyScheduleWithId = await this.api.postSchedule(emptyScheduleArray);

    const scheduleWithName = emptyScheduleWithId.map(schedule => {
      return { ...schedule, name: 'Staff Needed' };
    });

    this.props.addEvent(eventData, scheduleWithName);
    // if (manualSchedule === true) {
    //   // const newEventSchedule = await this.api.getSchedule(eventData.event_id);
    //   this.props.checkManualSchedule(newEventSchedule, manualSchedule);
    // } else {
    //   await this.props.scheduleGenerator();
    // }

    this.setState(this.defaultState);
  };

  render() {
    const { venue, name, date, time, bartenders, barbacks } = this.state;

    return (
      <div className="event-div">
        <h4 className="event-header">Add an event</h4>
        <form className="event-form" onSubmit={this.handleSubmit}>
          <div className="venue-info">
            <label className="form-label">
              Venue
              <select
                className="event-select"
                name="venue"
                value={venue}
                onChange={this.handleChange}
              >
                <option value="Ogden Theatre">Ogden Theatre</option>
                <option value="Gothic Theatre">Gothic Theatre</option>
                <option value="Bluebird Theater">Bluebird Theater</option>
              </select>
            </label>
            <input
              placeholder="Band name"
              name="name"
              value={name}
              onChange={this.handleChange}
              className="input_event-form"
              required
            />
            <input
              type="date"
              placeholder="Date"
              name="date"
              value={date}
              onChange={this.handleChange}
              className="input_event-form"
              required
            />
            <input
              placeholder="Time"
              type="time"
              name="time"
              value={time}
              onChange={this.handleChange}
              className="input_event-form"
              required
            />
          </div>
          <div className="staff-info">
            <label className="form-label">
              Bar Manager needed?
              <input
                type="radio"
                id="yes"
                value={true}
                name="bar_manager"
                onChange={this.handleChange}
              />
              <label htmlFor="yes">Yes</label>
              <input
                type="radio"
                id="no"
                value={false}
                name="bar_manager"
                onChange={this.handleChange}
              />
              <label htmlFor="no">No</label>
            </label>
            <label className="form-label">
              Assistant Bar Manager needed?
              <input
                type="radio"
                id="yes"
                value={true}
                name="ass_bar_manager"
                onChange={this.handleChange}
              />
              <label htmlFor="yes">Yes</label>
              <input
                type="radio"
                id="no"
                value={false}
                name="ass_bar_manager"
                onChange={this.handleChange}
              />
              <label htmlFor="no">No</label>
            </label>
            <input
              className="input_event-form"
              type="number"
              min="0"
              placeholder="Number of bartenders needed"
              name="bartenders"
              value={bartenders}
              onChange={this.handleChange}
            />
            <input
              className="input_event-form"
              type="number"
              min="0"
              placeholder="Number of barbacks needed"
              name="barbacks"
              value={barbacks}
              onChange={this.handleChange}
            />
            <label className="form-label">
              Beer Bucket?
              <input
                type="radio"
                id="yes"
                value={true}
                name="beer_bucket"
                onChange={this.handleChange}
              />
              <label htmlFor="yes">Yes</label>
              <input
                type="radio"
                id="no"
                value={false}
                name="beer_bucket"
                onChange={this.handleChange}
              />
              <label htmlFor="no">No</label>
            </label>
          </div>
          <button className="add-event-btn">Add Event</button>
        </form>
        <button
          className="generate-schedule-btn"
          onClick={this.props.scheduleGenerator}
        >
          Generate schedule
        </button>
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
