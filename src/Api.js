export class Api  {

  getStaff = async () => {
    const response = await fetch('http://localhost:3000/api/v1/staff')

    return await response.json()
  }

  getEvents = async () => {
    const response = await fetch('http://localhost:3000/api/v1/events')

    return await response.json()
  }

  generateSchedule = (staff, events) => {
    const scheduleBefore = events.map((event) => {
      const staffNeeded = this.getNumberOfStaff(event);
      let staffArray = [];
      /// should probably refactor this to a filter
      staff.forEach((person, index) => {
        if (staffNeeded > index) {
          const id = {
            event_id: event.id,
            staff_id: person.id
          }
          staffArray.push(id);
        }
      })

      return staffArray
    })

    return scheduleBefore.reduce((acc, eventStaff) => {

      return [...acc, ...eventStaff]
    },[])
  }

  getNumberOfStaff = (event) => {
    let staffNeeded = event.bartenders + event.barbacks;

    if (event.bar_manager) {
      staffNeeded++
    }

    if (event.ass_bar_manager) {
      staffNeeded++
    }

    return staffNeeded;
  }

  getSchedule = async () => {
    const response = await fetch('http://localhost:3000/api/v1/schedule')
    const scheduleData = await response.json()
    const scheduleObj = this.cleanScheduleData(scheduleData)
    const cleanEvents = await this.combineStaffAndEvent(scheduleObj)

    return cleanEvents
  }

  cleanScheduleData = (schedule) => {
    const scheduleObj = schedule.reduce((obj, event) => {
      if(!obj[event.event_id]) {
        obj[event.event_id] = []
      }

      obj[event.event_id] = [...obj[event.event_id], { staff_id: event.staff_id, staff_events_id: event.id }]

      return obj
    }, {})

    return scheduleObj
  }

  combineStaffAndEvent = (eventObj) => {
    const eventWithStaff = Object.keys(eventObj).map(async events => {

      const eventResponse = await fetch(`http://localhost:3000/api/v1/events/${events}`)
      const eventData = await eventResponse.json()
      const staffNames = await this.getStaffNames(eventObj[events])
      const event = {
        
        event_id: eventData[0].id,
        venue: eventData[0].venue,
        name: eventData[0].name,
        date: eventData[0].date,
        time: eventData[0].time,
        staff: staffNames
      }

      return event
    })

    return Promise.all(eventWithStaff)
  }

  getStaffNames = (ids) => {

    const promise = ids.map(async person => {
      const staffResponse = await fetch(`http://localhost:3000/api/v1/staff/${person.staff_id}`)
      const staffData = await staffResponse.json()
      const staff = {
        name: staffData[0].name,
        staff_events_id: person.staff_events_id
      }

      return staff
    })

    return Promise.all(promise)
  }

  postSchedule = (schedule) => {
    schedule.forEach ( async (staffEvent) => {
      const response = await fetch('http://localhost:3000/api/v1/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(staffEvent)
      })

      const data = await response.json();
      console.log(data)
    })
  }


}
