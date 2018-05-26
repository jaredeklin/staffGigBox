import React, { Component } from 'react';
import './App.css'
import { Header } from './Header'
import { StaffForm } from './StaffForm';
import { FormContainer } from './FormContainer'
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
      addNewStaff: false,
      cleanEvents: []
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

  viewSchedule = () => {

  }

  getSchedule = async () => {
    const response = await fetch('http://localhost:3000/api/v1/schedule')
    const scheduleData = await response.json()
    const scheduleObj = this.cleanScheduleData(scheduleData)
    const cleanEvents = await this.combineStaffAndEvent(scheduleObj)

    console.log(cleanEvents)  
    cleanEvents.sort( (a,b) => {
      return a.date - b.date
    })
    console.log(cleanEvents)
    this.setState({ cleanEvents })
  }

  cleanScheduleData = (schedule) => {
    const scheduleObj = schedule.reduce((obj, event) => {

      if(!obj[event.event_id]) {
        obj[event.event_id] = []
      }  

      obj[event.event_id] = [...obj[event.event_id], event.staff_id]

      return obj
    }, {})   

    return scheduleObj 
  }

  combineStaffAndEvent = (eventObj) => {
    const backflips = Object.keys(eventObj).map(async events => {

      const eventResponse = await fetch(`http://localhost:3000/api/v1/events/${events}`)
      const eventData = await eventResponse.json()
      const staffNames = await this.getStaffNames(eventObj[events])
      const event = {
        venue: eventData[0].venue,
        name: eventData[0].name,
        date: eventData[0].date,
        time: eventData[0].time,
        staff: staffNames
      }

      return event
    })

    return Promise.all(backflips)    
  }

  getStaffNames = (ids) => {
    
    const promise = ids.map(async person => {
      const staffResponse = await fetch(`http://localhost:3000/api/v1/staff/${person}`)
      const staffData = await staffResponse.json()
      
      return staffData[0].name
    })

    return Promise.all(promise)
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

    // this.setState({ schedule: scheduleBefore })
    this.setState({ schedule })

  }

  componentDidMount = () => {
    this.getStaff()
    this.getEvents();
    this.getSchedule()
  }

  render() {
    return (
      <div className='app'>
        <Header addUser={ this.addUser }/>
        <FormContainer schedule={ this.state.cleanEvents }/>
        
        <button onClick={ this.postSchedule }>Generate schedule</button>
      </div>
    );
  }
}

export default App;
