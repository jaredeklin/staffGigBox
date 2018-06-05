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
      manualSchedule: false,
      manualScheduleData: {},
      activeTabName: this.props.tabs[0]
    };
  }

  handleTabClick = (activeTabName) => this.setState({ activeTabName });

  checkManualSchedule = (eventData, manualSchedule) => {
    this.setState({ 
      manualSchedule,
      manualScheduleData: eventData 
    })
    console.log(manualSchedule)
    if ( !manualSchedule ) {
      this.props.scheduleGenerator()
    }
  }

  updateSchedule = async (event_id) => {
    const manualScheduleData = await this.api.getSchedule(event_id)
    this.setState({ manualScheduleData })
  }

  displayTabs = () => {
    const { activeTabName } = this.state

    return this.props.tabs.map((tabName, index) => {
      return (
        <Tab
          tabName={ tabName }
          handleTabClick={ this.handleTabClick }
          isActive={ tabName === activeTabName }
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
          admin={ this.props.admin }
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
    switch (this.state.activeTabName) {
      case 'Add Event': return this.checkForManual()

      case 'Add New Staff': return <StaffForm addStaff={ this.props.addStaff } user={ this.props.user }/>;

      default: return this.props.schedule.map((event, index) => {
        return (
          <Schedule
            editSchedule={ this.props.editSchedule }
            staffList= { this.props.staff }
            event={ event }
            key={ event.event_id }
            deleteFromSchedule={this.props.deleteFromSchedule}
            admin={ this.props.admin }
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
