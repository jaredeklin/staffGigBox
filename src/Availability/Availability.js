import React, { Component } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { Api } from '../Api/Api';
import PropTypes from 'prop-types';

export class Availability extends Component {
  constructor(props) {
    super(props);
    this.api = new Api();
    this.state = {
      selectedDays: []
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

  handleSubmit = async () => {
  	const id = this.props.currentUserId;
    const dates = this.state.selectedDays.map(day => this.api.cleanDate(day));

    const response = await this.api.postAvailability(id, dates);
    console.log(response);
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

Availability.propTypes = {
  currentUserId: PropTypes.number 
};

