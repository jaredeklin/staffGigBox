/* eslint-disable */
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

  handleDayClick = async (day, { selected }) => {
    const { selectedDays } = this.state;
    const id = this.props.currentUserId;

    if ( selected ) {
      const selectedIndex = selectedDays.findIndex(selectedDay =>
        DateUtils.isSameDay(selectedDay, day)
      );
      const removedDay = selectedDays.splice(selectedIndex, 1);
      const cleanRemovedDate = this.api.cleanDate(removedDay[0]);
      const isInDatabase = await this.api.getAvailability(id, cleanRemovedDate);
      
      if ( isInDatabase ) {
	    	await this.api.deleteAvailability(id, cleanRemovedDate); 	
      }

    } else {
    	selectedDays.push(day);
    }
    
  	this.setState({ selectedDays });
  }

  handleSubmit = async () => {
  	const id = this.props.currentUserId;
    const notInDb = [];
    const dates = await this.state.selectedDays.reduce(async (dateArray, day) => {
    	const cleanDay = this.api.cleanDate(day);
    	const isInDatabase = await this.api.getAvailability(id, cleanDay);

    	if (!isInDatabase) {
 				notInDb.push(cleanDay);
    	}
    	
    	return [...dateArray, ...notInDb];
    }, []);

    if (dates.length) {
	    await this.api.postAvailability(id, dates);
    }
  }


  componentDidMount = async () => {
  	const daysOff = await this.api.getAvailability(this.props.currentUserId);
  	
  	if ( daysOff ) {
  		const daysSelected = daysOff.map(day => new Date(day.date_unavailable));

  		this.setState({ selectedDays: daysSelected});
  	}
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

