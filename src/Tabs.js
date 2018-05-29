import React, { Component } from 'react'
import { Tab } from './Tab'
import { EventForm } from './EventForm/EventForm'
import { StaffForm } from './StaffForm/StaffForm'
import { Schedule } from './Schedule/Schedule'

export class Tabs extends Component {

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
        />
      )
    })
  };

  activeContent = () => {
    switch (this.state.activeTabIndex) {
      case 0: return <EventForm />;

      case 1: return <StaffForm />;

      case 2: return this.props.events.map((event, index) => <Schedule event={event} key={index} />)
    }
  }

  render() {
    return (
      <section className="tabs">
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