import React, { Component } from 'react';

export default class EditStaffSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      staff_id: '',
      event_id: this.props.event_id
    }
  }

  handleChange = (event) => {

    this.setState({
      staff_id: event.target.value
    })
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
          name='staff_id'
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
