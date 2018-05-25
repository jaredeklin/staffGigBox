import React, { Component } from 'react';
import './App.css'
import { Header } from './Header'
import { StaffForm } from './StaffForm';

import { EventForm } from './EventForm'

import { auth } from './firebase.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      staff: [],
      events: [],
      schedule: [],
      isCurrentStaff: false,
      addNewStaff: false
    };
  }

  addUser = async (user) => {
    const { staff } = this.state

    await this.setState({ user, isCurrentStaff: false })

    if (user) {
      const match = staff.find(person => person.google_id === user.uid)

      if( match) {
        this.setState({ isCurrentStaff: true })
      } else {
        this.setState({ addNewStaff: true })
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
    this.setState({ staff })
  }

  getEvents = async () => {
    const response = await fetch('http://localhost:3000/api/v1/events')

    const events = await response.json()

    await this.setState({ events })
    this.generateSchedule();
  }

  postSchedule = () => {
    this.state.schedule.forEach ( async (staffEvent) => {
      const response = await fetch('http://localhost:3000/api/v1/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(staffEvent)
      })

      const data = await response.json();
    })
  }

  getNumberOfStaff = (event) => {
    let staffNeeded = event.bartenders + event.barbacks;

    if (event.bar_manager) {
      staffNeeded++
    }

    if (event.ass_bar_manager) {
      staffNeeded++
    }
    return staffNeeded;
  }

  generateSchedule = async () => {
    const scheduleBefore = this.state.events.map((event) => {
      const staffNeeded = this.getNumberOfStaff(event);
      let staffArray = [];

      this.state.staff.forEach((person, index) => {
        if (staffNeeded > index) {
          const id = {
            event_id: event.id,
            staff_id: person.id
          }
          staffArray.push(id);
        }
      })

      return staffArray
    })
    const schedule = scheduleBefore.reduce((acc, eventStaff) => {
      return [...acc, ...eventStaff]

    },[])

    this.setState({ schedule })

  }

  componentDidMount = () => {
    this.getStaff()
    this.getEvents();
  }

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
        <button onClick={this.postSchedule}>Test</button>
      </div>
    );
  }
}

export default App;
