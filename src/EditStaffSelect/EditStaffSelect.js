import React, { Component } from 'react';

export class EditStaffSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      staff_id: null,
      event_id: this.props.event_id
    };
  }

  handleChange = async (event) => {
    await this.setState({
      staff_id: event.target.value
    });

    this.props.updateEventStaff(this.state);
  }

  displayStaff = () => {
    return this.props.staff.map(person => {
      
      return (
        <option key={ person.id } value={ person.id }>
          { person.name }
        </option>
      );
    });
  }

  render() {

    return (
      <form>
        <select onChange={ this.handleChange }>
          <option>Select staff</option>
          { this.displayStaff() }
        </select>
      </form>
    );
  }
}
