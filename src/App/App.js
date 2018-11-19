import React, { Component } from 'react';
import { Api } from '../Api/Api';
import { Sidebar } from '../Sidebar/Sidebar';
import './App.css';
import Header from '../Header';
import Routes from '../Routes';

class App extends Component {
  constructor(props) {
    super(props);
    this.api = new Api();
    this.url = process.env.REACT_APP_API_HOST || 'http://localhost:3000/';

    this.state = {
      staff: [],
      events: [],
      schedule: [],
      isCurrentStaff: false,
      addNewStaff: false,
      admin: false,
      unscheduledEvents: [],
      currentUser: {}
    };

    this.methods = {
      addEvent: this.addEvent,
      addStaff: this.addStaff,
      deleteFromSchedule: this.deleteFromSchedule,
      scheduleGenerator: this.scheduleGenerator,
      editSchedule: this.editSchedule
    };
  }

  addUser = async id => {
    const { staff } = this.state;

    if (id) {
      const staffMember = staff.find(person => person.google_id === id);

      if (staffMember) {
        this.setState({
          currentUser: staffMember,
          admin: staffMember.bar_manager
        });
      }
    }
  };

  deleteFromSchedule = async person => {
    const { schedule_id, event_id, role } = person;

    await fetch(`${this.url}api/v1/schedule/${schedule_id}`, {
      method: 'DELETE'
    });

    const schedule = this.state.schedule.reduce((schedAcc, event) => {
      if (event_id === event.event_id) {
        const updatedStaff = event.staff.filter(
          staff => staff.schedule_id !== schedule_id
        );

        if (role === 'Assistant Bar Manager') {
          event.ass_bar_manager = false;
        }

        event = { ...event, staff: updatedStaff };
      }

      return [...schedAcc, event];
    }, []);

    this.setState({ schedule });
  };

  editSchedule = updatedStaff => {
    const { schedule_id, staff_id, event_id } = updatedStaff;
    const staffObj = this.state.staff.find(
      staff => staff.staff_id === staff_id
    );

    const schedule = [...this.state.schedule, ...this.state.unscheduledEvents];
    const event = schedule.find(event => event.event_id === event_id);
    const { staff } = event;

    for (let index = 0; index < staff.length; index++) {
      if (staff[index].schedule_id === schedule_id) {
        staff[index] = {
          ...staffObj,
          role: staff[index].role,
          schedule_id,
          event_id
        };
        break;
      }
    }

    this.setState({ schedule });
  };

  addStaff = user => {
    this.setState({
      isCurrentStaff: true,
      addNewStaff: false,
      staff: [...this.state.staff, user]
    });
  };

  addEvent = (event, emptySchedule) => {
    const schedule = emptySchedule.map(staff => {
      return { ...staff, name: 'Staff Needed' };
    });
    const newScheduleObj = { ...event, staff: schedule };
    const events = [...this.state.events, event];
    const unscheduledEvents = [...this.state.unscheduledEvents, newScheduleObj];

    this.setState({ events, unscheduledEvents });
  };

  scheduleGenerator = async () => {
    const { staff, unscheduledEvents } = this.state;

    const combineDays = unscheduledEvents.reduce((acc, event) => {
      const { date } = event;
      if (!acc[date]) {
        acc[date] = [event];
      } else {
        acc[date] = [...acc[date], event];
      }
      return acc;
    }, {});

    for (const date in combineDays) {
      await this.api.findAvailableStaff(date, staff);
      const allStaff = this.api.fillRoles(combineDays[date]);
      await this.api.modifySchedule(allStaff);

      for (let i = 0; i < combineDays[date].length; i++) {
        const eventStaff = allStaff.filter(
          staff => staff.event_id === combineDays[date][i].event_id
        );
        combineDays[date][i].staff = eventStaff;
      }
    }

    const newSchedule = Object.keys(combineDays).reduce(
      (scheduleAcc, event) => {
        return [...scheduleAcc, ...combineDays[event]];
      },
      []
    );

    const schedule = [...this.state.schedule, ...newSchedule];

    this.setState({ schedule, unscheduledEvents: [] });
  };

  updateStateFromHelpers = async () => {
    const staff = await this.api.getStaff();
    const events = await this.api.getEvents();
    const schedules = await this.api.getSchedule(staff, events);
    const { schedule, unscheduledEvents } = schedules;

    this.setState({ staff, events, schedule, unscheduledEvents });
  };

  componentDidMount = () => {
    this.updateStateFromHelpers();
  };

  render() {
    return (
      <div className="app">
        <Sidebar addUser={this.addUser} />
        <div className="main-container">
          <Header />
          <div className="main-display-container">
            <Routes appState={this.state} methods={this.methods} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
