import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './EditStaffDropdown.css';
import { Api } from '../Api/Api';

export class EditStaffDropdown extends Component {
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

  displayStaff = role => {
    const { availableStaff } = this.state;
    const staffRole = role
      .toLowerCase()
      .replace(/ /gi, '_')
      .replace(/assistant/gi, 'ass');

    const available = availableStaff.filter(staff => staff[staffRole]);

    return available.map(person => {
      return (
        <option key={person.staff_id} value={person.staff_id}>
          {person.name}
        </option>
      );
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
    return (
      <form>
        <select onChange={this.handleChange}>
          <option>Select staff</option>
          {this.displayStaff()}
        </select>
      </form>
    );
  }
}

EditStaffDropdown.propTypes = {
  updateEventStaff: PropTypes.func,
  event_id: PropTypes.number,
  staff: PropTypes.array
};
