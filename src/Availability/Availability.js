import React, { Component } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { Api } from '../Api/Api'

export class Availability extends Component {
  constructor(props) {
    super(props);
    this.api = new Api();
    this.state = {
      selectedDays: [],
    };
  }

  handleDayClick = (day, { selected }) => {
    const { selectedDays } = this.state;

    if (selected) {
      const selectedIndex = selectedDays.findIndex(selectedDay =>
        DateUtils.isSameDay(selectedDay, day)
      );
      selectedDays.splice(selectedIndex, 1);
    } else {
      selectedDays.push(day);
    }
    this.setState({ selectedDays });
  }

  handleSubmit = () => {

    const dates = this.state.selectedDays.map(day => this.api.cleanDate(day))
    const daysOff = {
      staff_id: this.props.currentUserId,
      days_requested_off: dates
    }
    console.log(daysOff)
  }

  render() {
    return (
      <div>
        <h2>Select days you are unavailable</h2>
        <DayPicker
          selectedDays={ this.state.selectedDays }
          onDayClick={ this.handleDayClick }
        />
        <button onClick={ this.handleSubmit }>Submit Availability</button>
      </div>
    );
  }
}