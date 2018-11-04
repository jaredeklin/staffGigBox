import React, { Component } from 'react';
import './Schedule.css';
import { EditStaffDropdown } from '../EditStaffDropdown/EditStaffDropdown';
import { Api } from '../Api/Api';
import PropTypes from 'prop-types';
import DisplayStaff from '../DisplayStaff/DisplayStaff';

export class Schedule extends Component {
  constructor(props) {
    super(props);
    this.api = new Api();
    this.state = {
      staff_id: '',
      event_id: '',
      staff_events_id: '',
      edit: false,
      manualSchedule: false || this.props.manualSchedule
    };
  }

  updateEventStaff = async ({ staff_id, event_id }) => {
    const staff = {
      staff_events_id: this.state.staff_events_id,
      staff_id,
      event_id
    };

    await this.api.modifySchedule([staff]);

    if (this.state.manualSchedule) {
      this.props.updateSchedule(event_id);
    } else {
      this.props.editSchedule();
    }

    this.setState({ edit: false });
  };

  handleEditClick = person => {
    this.setState({
      edit: !this.state.edit,
      staff_events_id: person.staff_events_id
    });
  };

  render() {
    const {
      venue,
      name,
      date,
      time,
      event_id,
      ass_bar_manager
    } = this.props.event;

    return (
      <section className="schedule-card">
        <div className="schedule-container">
          <h4>{date}</h4>
          <h4>{venue}</h4>
          <h4>{time}</h4>
        </div>
        <h2>{name}</h2>
        {this.state.edit && (
          <EditStaffDropdown
            staff={this.props.staffList}
            createEventStaff={this.createEventStaff}
            manualSchedule={this.state.manualSchedule}
            event_id={event_id}
            updateEventStaff={this.updateEventStaff}
          />
        )}
        <section className="staff-container">
          <article className="managers">
            <DisplayStaff
              {...this.props}
              staffRole="Bar Manager"
              handleEditClick={this.handleEditClick}
            />
            {ass_bar_manager && (
              <DisplayStaff
                {...this.props}
                staffRole="Assistant Bar Manager"
                handleEditClick={this.handleEditClick}
              />
            )}
          </article>
          <DisplayStaff
            {...this.props}
            staffRole="Bartender"
            handleEditClick={this.handleEditClick}
          />
          <DisplayStaff
            {...this.props}
            staffRole="Barback"
            handleEditClick={this.handleEditClick}
          />
        </section>
      </section>
    );
  }
}

Schedule.propTypes = {
  admin: PropTypes.bool,
  manualSchedule: PropTypes.bool,
  updateSchedule: PropTypes.func,
  editSchedule: PropTypes.func,
  event: PropTypes.object,
  staffList: PropTypes.array,
  deleteFromSchedule: PropTypes.func
};
