import React, { Component } from 'react'
import { Api } from '../Api'
import { EditStaffSelect } from '../EditStaffSelect/EditStaffSelect'

export class ManualMakeSchedule extends Component {
  constructor(props) {
    super(props)
    this.api = new Api()

    this.state = {
      staffNeeded: this.api.getNumberOfStaff(this.props.scheduleData)
    }
  }

   

  

  render() {
    const { date, venue, time, name, id } = this.props.scheduleData
    let staffNeeded = this.api.getNumberOfStaff(this.props.scheduleData)
    return (
      <section className='schedule-card'>
        <div className='schedule-container'>
          <h4>{ date }</h4>
          <h4>{ venue }</h4>
          <h4>{ time }</h4>
        </div>
        <h2>{ name }</h2>
        <h5>Crew</h5>
        <ul>
        {
          this.props.staffList.map((staff, index) => {
            if (index < staffNeeded) {
              return (
                <EditStaffSelect
                  staff={ this.props.staffList }
                  event_id={ id }
                />
              )
            }
          })
        }
        </ul>
      </section>    
    )
  }
}