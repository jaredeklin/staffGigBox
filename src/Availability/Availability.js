import React, { Component } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

export class Availability extends Component {
  constructor(props) {
    super(props);
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

  
  render() {
    return (
      <div>
        <h2>Select days you are unavailable</h2>
        <DayPicker
          selectedDays={ this.state.selectedDays }
          onDayClick={ this.handleDayClick }
        />
        <button>Submit Availability</button>
      </div>
    );
  }
}