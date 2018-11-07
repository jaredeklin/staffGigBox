import React, { Component } from 'react';
import './App.css';
import { Header } from '../Header/Header';
import { TabContainer } from '../TabContainer/TabContainer';
import { Api } from '../Api/Api';

class App extends Component {
  constructor(props) {
    super(props);
    this.api = new Api();
    this.url = process.env.REACT_APP_API_HOST || 'http://localhost:3000/';

    this.state = {
      user: null,
      staff: [],
      events: [],
      schedule: [],
      isCurrentStaff: false,
      addNewStaff: false,
      tabs: [],
      admin: false,
      currentUserId: null
    };
  }

  addUser = async user => {
    const { staff } = this.state;

    await this.setState({ user, isCurrentStaff: false });

    if (user) {
      const isAuthorized = staff.filter(person => {
        return person.google_id === user.uid;
      });

      this.checkAuthorization(isAuthorized[0]);
    } else {
      this.setState({
        tabs: ['Schedule'],
        admin: false
      });
    }
  };

  checkAuthorization = isAuthorized => {
    if (isAuthorized) {
      const isAdmin = isAuthorized.bar_manager;
      const adminTabs = [
        'Schedule',
        'Submit Availability',
        'Add Event',
        'Add New Staff'
      ];
      const staffTabs = ['Schedule', 'Submit Availability'];

      this.setState({
        isCurrentStaff: true,
        tabs: isAdmin ? adminTabs : staffTabs,
        admin: isAdmin ? true : false,
        currentUserId: isAuthorized.id
      });
    } else {
      this.setState({
        addNewStaff: true,
        tabs: ['Schedule', 'Add New Staff']
      });
    }
  };

  deleteFromSchedule = async id => {
    await fetch(`${this.url}api/v1/schedule/${id}`, {
      method: 'DELETE'
    });

    this.editSchedule();
  };

  editSchedule = async () => {
    const schedule = await this.api.getSchedule();

    this.setState({ schedule });
  };

  addStaff = () => {
    this.setState({
      isCurrentStaff: true,
      addNewStaff: false
    });
  };

  scheduleGenerator = async () => {
    const { staff } = this.state;
    const generatedSchedule = await this.api.generateSchedule(staff);
    // console.log(generatedSchedule);
    if (generatedSchedule) {
      await this.api.modifySchedule(generatedSchedule);
      this.editSchedule();
    }
  };

  updateStateFromHelpers = async () => {
    const staff = await this.api.getStaff();
    const events = await this.api.getEvents();
    const schedules = await this.getSchedule(staff, events);
    const { schedule, unscheduledEvents } = schedules;

    this.setState({ staff, events, schedule, unscheduledEvents });
  };

  componentDidMount = () => {
    this.updateStateFromHelpers();
  };

  render() {
    const { schedule, staff, user, tabs, admin, currentUserId } = this.state;

    return (
      <div className="app">
        <Header addUser={this.addUser} />
        <TabContainer
          editSchedule={this.editSchedule}
          schedule={schedule}
          scheduleGenerator={this.scheduleGenerator}
          staff={staff}
          addStaff={this.addStaff}
          user={user}
          deleteFromSchedule={this.deleteFromSchedule}
          tabs={tabs}
          admin={admin}
          currentUserId={currentUserId}
        />
      </div>
    );
  }
}

export default App;
