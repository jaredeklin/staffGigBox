import React, { Component } from 'react'
import { Tab } from '../Tab/Tab'
import { EventForm } from '../EventForm/EventForm'
import { StaffForm } from '../StaffForm/StaffForm'
import { Schedule } from '../Schedule/Schedule'
// import { ManualMakeSchedule } from '../ManualMakeSchedule/ManualMakeSchedule'
import './TabContainer.css'

export class TabContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: 0,
      tabs: ['Event Form', 'Staff Form', 'Schedule'],
      manualSchedule: false,
      manualScheduleData: {}
    };
  }

  handleTabClick = (activeTabIndex) => this.setState({ activeTabIndex });

  checkManualSchedule = (eventData) => {
    this.setState({ 
      manualSchedule: true,
      manualScheduleData: eventData 
    })
    // console.log(eventData)
  }

  displayTabs = () => {
    const { tabs, activeTabIndex } = this.state

    return tabs.map((tabName, index) => {
      return (
        <Tab
          tabName={ tabName }
          tabIndex={ index }
          handleTabClick={ this.handleTabClick }
          isActive={ index === activeTabIndex }
          key={ tabName + index }
        />
      )
    })
  };

  checkForManuel = () => {
    if ( this.state.manualSchedule ) {
      // return <ManualMakeSchedule scheduleData={ this.state.manualScheduleData } staffList={ this.props.staff } />
      return (
        <Schedule 
          scheduleData={ this.state.manualScheduleData } 
          staffList={ this.props.staff } 
          event={ this.state.manualScheduleData }
          manualSchedule={ true }
        />)
    } else {
      return (
        <EventForm 
          scheduleGenerator={ this.props.scheduleGenerator }
          checkManualSchedule={ this.checkManualSchedule } 
        />
      );
    }
  }

  activeContent = () => {
    switch (this.state.activeTabIndex) {
      case 0: return this.checkForManuel()

      case 1: return <StaffForm addStaff={ this.props.addStaff } user={ this.props.user }/>;

      default: return this.props.schedule.map((event, index) => {
        return (
          <Schedule
            editSchedule={ this.props.editSchedule }
            staffList= { this.props.staff }
            event={ event }
            key={ event.event_id }
            deleteFromSchedule={this.props.deleteFromSchedule}
          />
        )
      })
    }
  }

  render() {
    return (
      <section className="tab-container">
        <ul>
          { this.displayTabs() }
        </ul>
        <article className="active-content">
          { this.activeContent() }
        </article>
      </section>
    );
  }
};
