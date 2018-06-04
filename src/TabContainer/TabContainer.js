import React, { Component } from 'react'
import { Tab } from '../Tab/Tab'
import { EventForm } from '../EventForm/EventForm'
import { StaffForm } from '../StaffForm/StaffForm'
import { Schedule } from '../Schedule/Schedule'
import { Api } from '../Api/Api'
import './TabContainer.css'

export class TabContainer extends Component {

  constructor(props) {
    super(props);
    this.api = new Api()
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
  }

  updateSchedule = async (event_id) => {
    const manualScheduleData = await this.api.getSchedule(event_id)
    this.setState({ manualScheduleData })
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

  checkForManual = () => {
    if ( this.state.manualSchedule ) {
      return (
        <Schedule 
          staffList={ this.props.staff }
          editSchedule={ this.props.editSchedule } 
          event={ this.state.manualScheduleData }
          manualSchedule={ true }
          updateSchedule={ this.updateSchedule}
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
      case 0: return this.checkForManual()

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
