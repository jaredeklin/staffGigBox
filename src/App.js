import React, { Component } from 'react';
import './App.css'
import { Header } from './Header'
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { EventForm } from './EventForm'

import firebase, { auth, provider } from './firebase.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDays: [],
      user: null
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

  addUser = (user) => {
    this.setState({ user })
  }

  handleSubmit = async () => {
    // this.availability = { data: [...this.state.selectedDays]}
    // console.log(this.availability)
    // /// POST request adding availability to staff members
    // try {
    //   const response = await fetch('http://localhost:3000/api/v1/staff', {
    //     method: 'POST',
    //     body: JSON.stringify(this.availability),
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     mode: 'no-cors'
    //   })

    //   const data = await response.json()

    //   console.log(data)   
    // } catch (error) {
    //   console.log(error)
    // }

    const response = await fetch('http://localhost:3000/api/v1/staff')
    const data = await response.json()
    console.log(data)

  }

  componentDidMount = () => {
    auth.onAuthStateChanged((user) => {
      console.log(user)
      if (user) {
        this.setState({ user });
      } 
    });
  }

          // <section className='calendar'>
          // <DayPicker
            // selectedDays={this.state.selectedDays}
            // onDayClick={this.handleDayClick}
          // />
        // </section>
        // <button onClick={this.handleSubmit}>Submit</button>

  render() {
    
    return (
      <div className='app'>
       <Header addUser={ this.addUser }/>      

        {
          this.state.user &&
          <EventForm name={ this.state.user.uid } />
        }
      </div>
    );
  }
}

export default App;


