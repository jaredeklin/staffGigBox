import React, { Component } from 'react';
import './styles.css';

export class StaffForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      google_id: this.props.user.uid,
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
        <form className='staff-form' onSubmit={this.handleSubmit}>
        <h4>Add new staff member</h4>
          <input
            className='input-name'
            placeholder='Name'
            name='name' value={ name }
            onChange={ this.handleChange }
          />
          <label className='form-label form-header'>Select all that apply:</label>
         <label className='form-label'>
            Are you a Bar Manager?
            <input type='radio'
            id= 'yes'
            value={ true }
            name='bar_manager'
            onChange={ this.handleChange }
            
           />
          <label htmlFor='yes'>Yes</label>
          <input
            type='radio'
            id= 'no'
            value={ false }
            name='bar_manager'
            onChange={ this.handleChange }
          />
          <label htmlFor='no'>No</label>
          </label>
         <label className='form-label'>
            Are you an Assistant Bar Manager?
            <input type='radio'
            id= 'yes'
            value={ true }
            name='ass_bar_manager'
            onChange={ this.handleChange }
            
           />
          <label htmlFor='yes'>Yes</label>
          <input
            type='radio'
            id= 'no'
            value={ false }
            name='ass_bar_manager'
            onChange={ this.handleChange }
          />
          <label htmlFor='no'>No</label>
          </label>
         <label className='form-label'>
            Are you Bartender?
            <input type='radio'
            id= 'yes'
            value={ true }
            name='bartender'
            onChange={ this.handleChange }
            
           />
          <label htmlFor='yes'>Yes</label>
          <input
            type='radio'
            id= 'no'
            value={ false }
            name='bartender'
            onChange={ this.handleChange }
          />
          <label htmlFor='no'>No</label>
          </label>
         <label className='form-label'>
            Are you Barback?
            <input type='radio'
            id= 'yes'
            value={ true }
            name='barback'
            onChange={ this.handleChange }
            
           />
          <label htmlFor='yes'>Yes</label>
          <input
            type='radio'
            id= 'no'
            value={ false }
            name='barback'
            onChange={ this.handleChange }
          />
          <label htmlFor='no'>No</label>
          </label>
         <label className='form-label'>
            Do you work the Beer Bucket?
            <input type='radio'
            id= 'yes'
            value={ true }
            name='beer_bucket'
            onChange={ this.handleChange }
            
           />
          <label htmlFor='yes'>Yes</label>
          <input
            type='radio'
            id= 'no'
            value={ false }
            name='beer_bucket'
            onChange={ this.handleChange }
          />
          <label htmlFor='no'>No</label>
          </label>
          <button className='add-staff-btn'>Add Staff Member</button>
        </form>
    )
  }
}
