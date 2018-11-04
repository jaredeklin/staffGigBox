import React, { Component } from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { Api } from '../Api/Api';
import PropTypes from 'prop-types';

const moment = require('moment');

export class Availability extends Component {
  constructor(props) {
    super(props);
    this.api = new Api();
    this.state = {
      selectedDays: [],
      originalDays: []
    };
  }

  handleDayClick = async (day, { selected }) => {
    const { selectedDays } = this.state;
    const id = this.props.currentUserId;

    if (selected) {
      const selectedIndex = selectedDays.findIndex(
        selectedDay => selectedDay.toString() === day.toString()
      );
      const removedDay = selectedDays.splice(selectedIndex, 1);
      const removedDate = this.cleanDate(removedDay[0]);
      const isInDatabase = await this.api.getAvailability(id, removedDate);

      if (isInDatabase) {
        await this.api.deleteAvailability(id, removedDate);
      }
    } else {
      selectedDays.push(day);
    }

    this.setState({ selectedDays });
  };

  cleanDate = date => {
    const day = date.toString().substring(4, 15);
    return moment(day, 'MMM DD YYYY').format('MMM D, YYYY');
  };

  handleSubmit = async () => {
    const { selectedDays, originalDays } = this.state;
    const id = this.props.currentUserId;
    const daysToAdd = selectedDays.filter(day => !originalDays.includes(day));
    const daysToRemove = originalDays.filter(
      day => !selectedDays.includes(day)
    );

    if (daysToAdd.length) {
      const cleanDates = this.cleanDate(daysToAdd);

      await this.api.postAvailability(id, cleanDates);
        }

    if (daysToRemove.length) {
      const cleanDates = this.cleanDate(daysToRemove);

      await this.api.deleteAvailability(id, cleanDates);
    }
  };

  componentDidMount = async () => {
    const daysOff = await this.api.getAvailability(this.props.currentUserId);

    if (daysOff) {
      const selectedDays = daysOff.map(day => new Date(day.date_unavailable));

      this.setState({ selectedDays, originalDays: selectedDays });
    }
  };

  render() {
    return (
      <div>
        <h2>Select days you are unavailable</h2>
        <DayPicker
          selectedDays={this.state.selectedDays}
          onDayClick={this.handleDayClick}
        />
        <button onClick={this.handleSubmit}>Submit Availability</button>
      </div>
    );
  }
}

Availability.propTypes = {
  currentUserId: PropTypes.number
};
