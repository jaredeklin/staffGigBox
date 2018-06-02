import React, { Component } from 'react';

export class EditStaffSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      staff_id: null,
      event_id: this.props.event_id
    }
  }

  handleChange = async (event) => {
    // console.log(parseInt(event.target.value))
    await this.setState({
      staff_id: event.target.value
    })

    this.props.updateEventStaff(this.state)
  }

  displayStaff = () => {
    this.props.staff.map(person => {
      // console.log('map', person)
      return (
        <option key={person.id}>
          { person.name }
        </option>
      )
    })
  }

  render() {

    const displayStaff = this.props.staff.map(person => {
      return (
        <option
          key={ person.id }
          value={ person.id }
        >
          { person.name }
        </option>
      )
    })
    return (
      <form>
        <select onChange={ this.handleChange }>
          { displayStaff }
        </select>
      </form>
    )
  }
}
