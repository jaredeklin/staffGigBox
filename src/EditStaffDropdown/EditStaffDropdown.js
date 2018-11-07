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
