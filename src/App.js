import React, { Component } from 'react';
import './App.css'

import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { EventForm } from './EventForm'

import firebase, { auth, provider } from './firebase.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDays: [],
      user: null,
      result: []
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

  login = async () => {
    const result = await auth.signInWithPopup(provider) 
    const { user } = await result
    this.setState({ user, result })
    //   .then((result) => {
    //     const { user } = result;
    //     this.setState({ user, result });
    // }
    // });
  }

  logout = async () => {
    await auth.signOut()
    this.setState({ user: null });
    //   .then(() => {
    //     this.setState({ user: null });
    // });
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
    // const name = this.state.user.displayName
    return (
      <div className='app'>
        <header>
          <h1>Staff Gig Box</h1>
          { this.state.user ?
            <div>
            <button onClick={this.logout}>Log Out</button>
            <img className='user-img' src={this.state.user.photoURL} />  
            </div>              
            :
            <button onClick={this.login}>Log In</button>              
          }
        </header>
        

        {
          this.state.user &&
          <EventForm name={this.state.user.uid} />
        }
      </div>
    );
  }
}

export default App;


