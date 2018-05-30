import React, { Component } from 'react'
import { Tab } from '../Tab/Tab'
import { EventForm } from '../EventForm/EventForm'
import { StaffForm } from '../StaffForm/StaffForm'
import { Schedule } from '../Schedule/Schedule'
import './TabContainer.css'

export class TabContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: 0,
      tabs: ['Event Form', 'Staff Form', 'Schedule']
    };
  }

  handleTabClick = (activeTabIndex) => this.setState({ activeTabIndex });

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

  activeContent = () => {
    switch (this.state.activeTabIndex) {
      case 0: return <EventForm scheduleGenerator={ this.props.scheduleGenerator } />;

      case 1: return <StaffForm addStaff={ this.props.addStaff } user={ this.props.user }/>;

      default: return this.props.events.map((event, index) => <Schedule event={event} key={index} deleteFromSchedule={this.props.deleteFromSchedule}/>)
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