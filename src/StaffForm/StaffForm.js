import React, { Component } from 'react'

export class StaffForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // google_id: this.props.user.uid,
      // name: this.props.user.displayName,
      name: '',
      bar_manager: false,
      ass_bar_manager: false,
      bartender: false,
      barback: false,
      beer_bucket: false
    }
  }

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()

    const response = await fetch('http://localhost:3000/api/v1/staff', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: { 'Content-Type': 'application/json'}
    })

    // const staffData = await response.json();

    this.props.addStaff()
  }


  render() {
    const { name, bar_manager, ass_bar_manager, bartender, barback, beer_bucket } = this.state

    return (
      <form onSubmit={this.handleSubmit}>
        <input placeholder='Name' name='name' value={ name } onChange={ this.handleChange } />
        <label className='form-label'> Select all that apply:</label>
       <label className='form-label'>
          Are you a Bar Manager?
          <select name='bar_manager' value={ bar_manager } onChange={ this.handleChange }>
            <option value={ true }>Yes</option>
            <option value={ false }>No</option>
          </select>
        </label>
       <label className='form-label'>
          Are you an Assistant Bar Manager?
          <select name='ass_bar_manager' value={ ass_bar_manager } onChange={ this.handleChange }>
            <option value={ true }>Yes</option>
            <option value={ false }>No</option>
          </select>
        </label>
       <label className='form-label'>
          Are you Bartender?
          <select name='bartender' value={ bartender } onChange={ this.handleChange }>
            <option value={ true }>Yes</option>
            <option value={ false }>No</option>
          </select>
        </label>
       <label className='form-label'>
          Are you Barback?
          <select name='barback' value={ barback } onChange={ this.handleChange }>
            <option value={ true }>Yes</option>
            <option value={ false }>No</option>
          </select>
        </label>
       <label className='form-label'>
          Do you work the Beer Bucket?
          <select name='beer_bucket' value={ beer_bucket } onChange={ this.handleChange }>
            <option value={ true }>Yes</option>
            <option value={ false }>No</option>
          </select>
        </label>
        <button>Add Staff Member</button>
      </form>
    )
  }
}
