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
    const days = [...this.state.selectedDays];

    if (selected) {
      const selectedIndex = days.findIndex(
        selectedDay => selectedDay.toDateString() === day.toDateString()
      );
      days.splice(selectedIndex, 1);
    } else {
      days.push(day);
    }

    this.setState({ selectedDays: days });
  };

  cleanDate = dates => {
    return dates.map(day => {
      const date = day.toString().substring(4, 15);
      return moment(date, 'MMM DD YYYY').format('YYYY-MM-DD');
    });
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
    const { currentUserId } = this.props;
    const days = await this.api.getAvailability(currentUserId, null, true);
    const selectedDays = days.map(day => moment(day.date_unavailable)._d);

    this.setState({ selectedDays, originalDays: selectedDays });
  };

  render() {
    return (
      <div>
        <h2>Select days you are unavailable</h2>
        <DayPicker
          selectedDays={this.state.selectedDays}
          disabledDays={[{ before: new Date() }]}
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
