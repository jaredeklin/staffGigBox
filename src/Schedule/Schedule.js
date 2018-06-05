import React, { Component } from 'react';
import './Schedule.css';
import { EditStaffSelect } from '../EditStaffSelect/EditStaffSelect';
import { Api } from '../Api/Api';
import PropTypes from 'prop-types';

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

  updateEventStaff = async ({staff_id, event_id}) => {

    const staff = { staff_events_id: this.state.staff_events_id, staff_id, event_id };
    const response = await this.api.modifySchedule([staff]);

    if ( this.state.manualSchedule ) {
      this.props.updateSchedule(event_id);
    } else {
      this.props.editSchedule();
    }

    this.setState({ edit: false });
  }

  handleEditClick = (person) => {

    this.setState({
      edit: !this.state.edit,
      staff_events_id: person.staff_events_id
    });
  }

  displayStaff = (role) => {
    const { staff } = this.props.event;

    return staff.filter(staffMember => staffMember.role === role)
      .map((person, index) => {
        return (
          <li key={ person.staff_events_id }>
            {person.name}
            { this.props.admin &&
              <div>
                <button
                  className='delete'
                  onClick={ () => this.props.deleteFromSchedule(person.staff_events_id) }>
                </button>
                <button
                  className='edit'
                  onClick={ () => this.handleEditClick(person) }>
                </button>
              </div>
            }
          </li>
        );
      }
      );
  }


  handleEditDropdown = (event_id) => {
    return (
      <EditStaffSelect
        staff={ this.props.staffList }
        createEventStaff={ this.createEventStaff }
        manualSchedule={ this.state.manualSchedule }
        event_id={ event_id }
        updateEventStaff={ this.updateEventStaff }
      />
    );
  }

  render() {

    const { venue, name, date, time, event_id, ass_bar_manager } = this.props.event;

    return (
      <section className='schedule-card'>
        <div className='schedule-container'>
          <h4>{ date }</h4>
          <h4>{ venue }</h4>
          <h4>{ time }</h4>
        </div>
        <h2>{ name }</h2>
        {
          this.state.edit &&
          this.handleEditDropdown( event_id )
        }
        <section className='staff-container'>
          <article className='managers'>
            <ul className='bar-manager'>
              <h4>Bar Manager</h4>
              { this.displayStaff('Bar Manager') }
            </ul>
            { ass_bar_manager &&
              <ul className='ass-bar-manager'>
                <h4>Assistant Bar Manager</h4>
                { this.displayStaff('Assistant Bar Manager') }
              </ul>
            }
          </article>
          <ul className='bartenders'>
            <h4>Bartenders</h4>
            { this.displayStaff('Bartender') }
          </ul>
          <ul className='barbacks'>
            <h4>Barbacks</h4>
            { this.displayStaff('Barback') }
          </ul>
        </section>
      </section>
    );
  }
}

Schedule.propTypes = {
  adming: PropTypes.bool,
  manualSchedule: PropTypes.bool,
  updateSchedule: PropTypes.func,
  editSchedule: PropTypes.func,
  event: PropTypes.object
};
