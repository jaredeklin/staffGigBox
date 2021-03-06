import React, { Component } from 'react';
import './Schedule.css';
import { StaffDropdownContainer } from '../StaffDropdownContainer/StaffDropdownContainer';
import { Api } from '../Api/Api';
import PropTypes from 'prop-types';
import DisplayStaff from '../DisplayStaff/DisplayStaff';

const moment = require('moment');

export class Schedule extends Component {
  constructor(props) {
    super(props);
    this.api = new Api();
    this.state = {
      staff_id: '',
      event_id: '',
      schedule_id: '',
      edit: false,
      currentStaffPerson: {}
    };
  }

  updateEventStaff = async ({ staff_id, event_id }) => {
    const staff = {
      schedule_id: this.state.schedule_id,
      staff_id,
      event_id
    };
    const scheduleChange = await this.api.modifySchedule([staff]);

    this.props.editSchedule(scheduleChange[0]);
    this.setState({ edit: false });
  };

  closeModal = () => {
    this.setState({ edit: false });
  };

  handleEditClick = person => {
    this.setState({
      edit: !this.state.edit,
      schedule_id: person.schedule_id,
      currentStaffPerson: person
    });
  };

  render() {
    const { venue, name, date, time, ass_bar_manager } = this.props.event;

    return (
      <section className="schedule-card">
        <div className="schedule-container">
          <h4>{moment(date).format('MMM D, YYYY')}</h4>
          <h4>{venue}</h4>
          <h4>{time}</h4>
        </div>
        <h2>{name}</h2>
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
        {this.state.edit && (
          <StaffDropdownContainer
            staff={this.props.staff}
            event={this.props.event}
            updateEventStaff={this.updateEventStaff}
            closeModal={this.closeModal}
            currentPerson={this.state.currentStaffPerson}
          />
        )}
      </section>
    );
  }
}

Schedule.propTypes = {
  admin: PropTypes.bool,
  updateSchedule: PropTypes.func,
  editSchedule: PropTypes.func,
  event: PropTypes.object,
  staffList: PropTypes.array,
  deleteFromSchedule: PropTypes.func
};
