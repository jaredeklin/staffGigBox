import React, { Component } from 'react';
import './App.css'
import { Header } from '../Header/Header'
import { TabContainer } from '../TabContainer/TabContainer'
import { Api } from '../Api'

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

    this.api = new Api()
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


  updateStateFromHelpers = async () => {
    const staff = await this.api.getStaff()
    const events = await this.api.getEvents()
    const schedule = await this.api.generateSchedule(staff, events)
    const cleanEvents = await this.api.getSchedule()
    
    this.setState({ staff, events, schedule ,cleanEvents })
  }

  componentDidMount = () => {
    this.updateStateFromHelpers()
  }

  render() {

    return (
      <div className='app'>
        <Header addUser={ this.addUser }/>
        <TabContainer 
          events={ this.state.cleanEvents } 
          schedule={ this.state.schedule }
          addStaff={ this.addStaff }
          user={ this.state.user } 
        />        
      </div>
    );
  }
}

export default App;
