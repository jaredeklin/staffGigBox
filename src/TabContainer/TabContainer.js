import React, { Component } from 'react';
import { Tab } from '../Tab/Tab';
import { EventForm } from '../EventForm/EventForm';
import { StaffForm } from '../StaffForm/StaffForm';
import { Schedule } from '../Schedule/Schedule';
import { Api } from '../Api/Api';
import { Availability } from '../Availability/Availability';
import './TabContainer.css';
import PropTypes from 'prop-types';
import UnscheduledEventsContainer from '../UnscheduledEventsContainer/UnscheduledEventsContainer';

export class TabContainer extends Component {
  constructor(props) {
    super(props);
    this.api = new Api();
    this.state = {
      activeTabName: 'Schedule'
    };
  }

  handleTabClick = activeTabName => this.setState({ activeTabName });

  displayTabs = () => {
    const { activeTabName } = this.state;

    return this.props.tabs.map((tabName, index) => {
      return (
        <Tab
          tabName={tabName}
          handleTabClick={this.handleTabClick}
          isActive={tabName === activeTabName}
          key={tabName + index}
        />
      );
    });
  };

  activeContent = () => {
    switch (this.state.activeTabName) {
      case 'Add Event':
        return <EventForm addEvent={this.props.addEvent} />;

      case 'Submit Availability':
        return <Availability currentUserId={this.props.currentUserId} />;

      case 'Add New Staff':
        return (
          <StaffForm addStaff={this.props.addStaff} user={this.props.user} />
        );

      case 'Unscheduled Events':
        return <UnscheduledEventsContainer {...this.props} />;

      default:
        return this.props.schedule.map(event => {
          return (
            <Schedule
              editSchedule={this.props.editSchedule}
              staff={this.props.staff}
              event={event}
              key={event.event_id}
              deleteFromSchedule={this.props.deleteFromSchedule}
              admin={this.props.admin}
            />
          );
        });
    }
  };

  render() {
    return (
      <section className="tab-container">
        <ul className="tab-container-list">{this.displayTabs()}</ul>
        <article className="active-content">{this.activeContent()}</article>
      </section>
    );
  }
}

TabContainer.propTypes = {
  deleteFromSchedule: PropTypes.func,
  tabs: PropTypes.array,
  scheduleGenerator: PropTypes.func,
  staff: PropTypes.arrayOf(PropTypes.object),
  editSchedule: PropTypes.func,
  admin: PropTypes.bool,
  addStaff: PropTypes.func,
  user: PropTypes.object,
  schedule: PropTypes.arrayOf(PropTypes.object),
  unsheduledEvents: PropTypes.arrayOf(PropTypes.object),
  currentUserId: PropTypes.number
};
