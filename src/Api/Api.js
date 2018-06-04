export class Api  {

  getStaff = async () => {
    const response = await fetch('http://localhost:3000/api/v1/staff')

    return await response.json()
  }

  getEvents = async () => {
    const response = await fetch('http://localhost:3000/api/v1/events')

    return await response.json()
  }

  // ripe for refactor
  generateSchedule = async (staff, events) => {
    const response = await fetch('http://localhost:3000/api/v1/schedule')
    const currentScheduleData = await response.json()
    const unscheduledEvents = events.reduce((array, event) => {

      const match = currentScheduleData.find(schedule => event.id === schedule.event_id)
      const x = []  

      if (!match) {
        x.push(event)
      }

      return  [...x]
    }, [])


    const scheduleBefore = unscheduledEvents.map((event) => {
      let { bar_manager, ass_bar_manager, bartenders, barbacks } = event
      let bartenderCount = 0
      let barbackCount = 0
      const staffNeeded = this.getNumberOfStaff(event)
      const staffArray = []
      
      staff.forEach((person, index) => {
        if ( index < staffNeeded ) {

          if ( bar_manager ) {
            bar_manager = false
            staffArray.push({
              event_id: event.id,
              staff_id: person.id,
              role: "Bar Manager"
            })
          }

          if ( ass_bar_manager ) {
            ass_bar_manager = false
            staffArray.push({
              event_id: event.id,
              staff_id: person.id,
              role: 'Assistant Bar Manager'
            })
          }

          if ( bartenderCount < bartenders ) {
            bartenderCount++
            staffArray.push({
              event_id: event.id,
              staff_id: person.id,
              role: 'Bartender'
            })
          } else if ( barbackCount < barbacks ) {
            barbackCount++
            staffArray.push({
              event_id: event.id,
              staff_id: person.id,
              role: 'Barback'
            })
          }
        }
      })
      return staffArray
    })

    return scheduleBefore.reduce((acc, eventStaff) => {
      return [...acc, ...eventStaff]
    },[])

  }

  getNumberOfStaff = (event) => {

    if( event ) {

      let staffNeeded = event.bartenders + event.barbacks;

      if (event.bar_manager) {
        staffNeeded++
      }

      if (event.ass_bar_manager) {
        staffNeeded++
      }

      return staffNeeded;
    }
  }

  getSchedule = async (id) => {
    let response;

    if (id) {
      response = await fetch(`http://localhost:3000/api/v1/schedule?event_id=${id}`)
    } else {
      response = await fetch('http://localhost:3000/api/v1/schedule')
    }

    const scheduleData = await response.json()
    const scheduleObj = await this.cleanScheduleData(scheduleData)
    const cleanEvents = await this.combineStaffAndEvent(scheduleObj)

    return id ? cleanEvents[0] : cleanEvents
  }

  cleanScheduleData = (schedule) => {
    
    const scheduleObj = schedule.reduce((obj, event) => {
      const { staff_id, id, role } = event
      if(!obj[event.event_id]) {
        obj[event.event_id] = []
      }

      obj[event.event_id] = [...obj[event.event_id], { staff_id, staff_events_id: id, role}]

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
        staff: staffNames,
        ass_bar_manager: eventData[0].ass_bar_manager,
        bar_manager: eventData[0].bar_manager,
        beer_bucket: eventData[0].beer_bucket
      }
      return event
    })

    return Promise.all(eventWithStaff)
  }

  getStaffNames = (ids) => {
    
    const promise = ids.map(async person => {
      const { staff_events_id, role } = person
      let staff = {
        name: 'Staff Needed',
        staff_events_id,
        role
      }

      if ( person.staff_id !== null ){
        const staffResponse = await fetch(`http://localhost:3000/api/v1/staff/${person.staff_id}`)
        const staffData = await staffResponse.json()

        staff.name = staffData[0].name
      }

      return staff
    })

    return Promise.all(promise)
  }

  postSchedule = (schedule) => {
    const promise = schedule.map( async (staffEvent) => {
      var response = await fetch('http://localhost:3000/api/v1/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(staffEvent)
      })

      return await response.json()
    })

    return Promise.all(promise)
  }
}
