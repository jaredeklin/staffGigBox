import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './StaffDropdownContainer.css';
import { Api } from '../Api/Api';
import DisplayStaffDropdown from '../DisplayStaffDropdown/DisplayStaffDropdown';

export class StaffDropdownContainer extends Component {
  constructor(props) {
    super(props);
    this.api = new Api();
    this.state = {
      staff_id: null,
      availableStaff: []
    };
  }

  handleChange = async event => {
    this.setState({
      staff_id: event.target.value
    });
  };

  findAvailableStaff = async () => {
    const { date } = this.props.event;

    const alreadyScheduled = await this.api.checkSchedule(date);
    const notAvailable = await this.api.checkAvailability(date);
    const unavailable = [...alreadyScheduled, ...notAvailable];

    const availableStaff = this.props.staff.filter(staff => {
      return !unavailable.some(person => staff.staff_id === person.staff_id);
    });

    this.setState({ availableStaff });
  };

  handleSave = () => {
    const eventDetails = {
      staff_id: this.state.staff_id,
      event_id: this.props.event.event_id
    };

    this.props.updateEventStaff(eventDetails);
  };

  componentDidMount = () => {
    this.findAvailableStaff();
  };

  render() {
    const { name, role } = this.props.currentPerson;

    return (
      <section className="modal-container">
        <section className="modal-main">
          Replace {name} in a role of {role} with
          <DisplayStaffDropdown
            availableStaff={this.state.availableStaff}
            staffRole={role}
            handleChange={this.handleChange}
          />
          <button onClick={this.handleSave}>Save</button>
          <button onClick={this.props.closeModal}>Close</button>
        </section>
      </section>
    );
  }
}

StaffDropdownContainer.propTypes = {
  updateEventStaff: PropTypes.func,
  event_id: PropTypes.number,
  staff: PropTypes.array
};
