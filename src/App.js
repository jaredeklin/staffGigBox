import React, { Component } from 'react';
import './App.css'

import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDays: [],
    };

    this.availability = []
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
    this.availability = [...this.state.selectedDays]
    console.log(this.availability)
    /// POST request adding availability to staff members
  }

  render() {
    return (
      <div>
        <h1>Staff Gig Box</h1>
        <section className='calendar'>
          <DayPicker
            selectedDays={this.state.selectedDays}
            onDayClick={this.handleDayClick}
            className='calendar1'
          />
        </section>
        <button onClick={this.handleSubmit}>Submit</button>
      </div>
    );
  }
}

export default App;
