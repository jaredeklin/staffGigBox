import React, { Component } from 'react';
import './App.css'
import { Header } from './Header'
import { StaffForm } from './StaffForm'
// import DayPicker, { DateUtils } from 'react-day-picker';
// import 'react-day-picker/lib/style.css';

import { EventForm } from './EventForm'

import { auth } from './firebase.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // selectedDays: [],
      user: null,
      staff: [],
      events: [],
      schedule: [],
      isCurrentStaff: false,
      addNewStaff: false
    };
  }

  // handleDayClick = (day, { selected }) => {
  //   const { selectedDays } = this.state;

  //   if (selected) {
  //     const selectedIndex = selectedDays.findIndex(selectedDay =>
  //       DateUtils.isSameDay(selectedDay, day)
  //     );
  //     selectedDays.splice(selectedIndex, 1);
  //   } else {
  //     selectedDays.push(day);
  //   }
  //   this.setState({ selectedDays });
  // }

  addUser = async (user) => {
    const { staff } = this.state

    await this.setState({ user, isCurrentStaff: false })

    if (user) {
      const match = staff.find(person => person.google_id === user.uid)

      if( match) {
        this.setState({ isCurrentStaff: true })
      } else {
        // console.log(this.state.user)
        this.setState({
          addNewStaff: true,

        })
      }

    }
  }

  addStaff = () => {
    this.setState({
      isCurrentStaff: true,
      addNewStaff: false
    })
  }

  getStaff = async () => {
    const response = await fetch('http://localhost:3000/api/v1/staff')
    const staff = await response.json()
    // console.log(staff)
    this.setState({ staff })
  }

  getEvents = async () => {
    const response = await fetch('http://localhost:3000/api/v1/events')

    const events = await response.json()

    await this.setState({ events })
    this.generateSchedule();
  }

  generateSchedule = async () => {
    const schedule = this.state.events.map((event) => {
      let staffNeeded = event.bartenders + event.barbacks;

      if (event.bar_manager) {
        staffNeeded++
      }

      if (event.ass_bar_manager) {
        staffNeeded++
      }

      let staffArray = []

        this.state.staff.forEach((person, index) => {
          if (staffNeeded > index) {
            console.log('person',person)
            const id = {
              event_id: event.id,
              staff_id: person.id
            }
            staffArray.push(id);
          }


      })

      console.log('ho')

      return staffArray
    })
    const mergedArray = schedule.reduce((acc, eventStaff) => {
      return [...acc, ...eventStaff]

    },[])
    
    this.setState({ mergedArray })

  }

  componentDidMount = () => {
    this.getStaff()
    this.getEvents();
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
          this.state.isCurrentStaff &&
          <EventForm name={ this.state.user.uid } />
        }
        {
          this.state.addNewStaff &&
          <StaffForm user={ this.state.user } addStaff={ this.addStaff }/>
        }
      </div>
    );
  }
}

export default App;
