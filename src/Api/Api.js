export class Api  {
  constructor() {
    this.url = process.env.REACT_APP_API_HOST || 'http://localhost:3000/';
  }

  getStaff = async () => {
    const response = await fetch(`${this.url}api/v1/staff`);

    return await response.json();
  }

  getEvents = async () => {
    const response = await fetch(`${this.url}api/v1/events`);

    return await response.json();
  }

  getSpecificEvent = async (id) => {
    console.log('hit')
    const response = await fetch(`${this.url}api/v1/events/${id}`);

    return await response.json()
  }

  generateSchedule = async (staff) => {
    const response = await fetch(`${this.url}api/v1/schedule`);
    const currentScheduleData = await response.json();
    const unscheduledEvents = await currentScheduleData.filter(schedule => { 
      return schedule.staff_id === null; 
    });

    // const barManager = []
    // const assBarManager = []
    // const barbacks = []
    // const bartenders = []

    // staff.forEach((person, index) => {
    //   if (person.bar_manager) {
    //     barManager.push(person)
    //   } else if (person.ass_bar_manager) {
    //     assBarManager.push(assBarManager)
    //   } else if (person.barback) {
    //     barbacks.push(person) 
    //   } else {
    //     bartenders.push(person)
    //   }
    // })

    // console.log(unscheduledEvents)
    const eventData = await this.getEventData(unscheduledEvents)
    // console.log(eventData)

    const result = Object.keys(eventData[0]).map(eventInfo => {
      console.log(eventData[0][eventInfo][0].id)
      const singleEvent = unscheduledEvents.filter(concert => eventData[0][eventInfo][0].id === concert.event_id)
      const needAssMan = eventData[0][eventInfo][0].ass_bar_manager

      const barManagers = []
      const assBarManagers = []
      const barbacks = []
      const bartenders = []

      staff.forEach((person, index) => {
        if (person.bar_manager) {
          barManagers.push(person)
        } else if (person.ass_bar_manager) {
          assBarManagers.push(person)
        } else if (person.barback) {
          barbacks.push(person) 
        } else {
          bartenders.push(person)
        }
      })


        console.log(singleEvent)
      const schedule = singleEvent.reduce((array, event) => {

        if (event.role === 'Bar Manager') {
          const managerIndex = Math.floor(Math.random() * barManagers.length)

          event.staff_id = barManagers[managerIndex].id
          barManagers.splice(managerIndex, 1)

          if ( needAssMan ) {
            assBarManagers.push(barManagers)
          } else {
            bartenders.push(barManagers)
          }
        }

        if (event.role === 'Assistant Bar Manager') {
          const assManagerIndex = Math.floor(Math.random() * assBarManagers.length)

          event.staff_id = assBarManagers[assManagerIndex].id
          assBarManagers.splice(assManagerIndex, 1)

          bartenders.push(assBarManagers)
        }

        if (event.role === 'Bartender') {
          const bartenderIndex = Math.floor(Math.random() * bartenders.length)

          event.staff_id = bartenders[bartenderIndex].id
          bartenders.splice(bartenderIndex, 1)
        }

        if (event.role === 'Barback') {
          const barbackIndex = Math.floor(Math.random() * barbacks.length)

          event.staff_id = barbacks[barbackIndex].id
          barbacks.splice(barbackIndex, 1)
        }

        return [...array, event];
      }, []);

      return schedule
    })

    console.log(result)


    // console.log(schedule)
    // return schedule;
  }

  getEventData = (events) => {
    let obj = {}

    return events.reduce( async (array, event) => {

      if (!obj[event.event_id]) {
        obj[event.event_id] = await this.getSpecificEvent(event.event_id)
      }

      return [{...obj}]

    }, [])
  }

  getNumberOfStaff = (event) => {

    if ( event ) {

      let staffNeeded = event.bartenders + event.barbacks;

      if (event.bar_manager) {
        staffNeeded++;
      }

      if (event.ass_bar_manager) {
        staffNeeded++;
      }

      return staffNeeded;
    }
  }

  getSchedule = async (id) => {
    let response;

    if (id) {
      response = await fetch(`${this.url}api/v1/schedule?event_id=${id}`);
    } else {
      response = await fetch(`${this.url}api/v1/schedule`);
    }

    const scheduleData = await response.json();
    const scheduleObj = await this.cleanScheduleData(scheduleData);
    const cleanEvents = await this.combineStaffAndEvent(scheduleObj);

    return id ? cleanEvents[0] : cleanEvents;
  }

  cleanScheduleData = (schedule) => {
    
    const scheduleObj = schedule.reduce((scheduleObj, event) => {
      const { staff_id, id, role } = event;
      
      if (!scheduleObj[event.event_id]) {
        scheduleObj[event.event_id] = [];
      }

      scheduleObj[event.event_id] = [...scheduleObj[event.event_id], { 
        staff_id, 
        staff_events_id: id, 
        role
      }];

      return scheduleObj;
    }, {});

    return scheduleObj;
  }

  combineStaffAndEvent = (eventObj) => {
    const eventWithStaff = Object.keys(eventObj).map(async events => {
      const eventResponse = await fetch(`${this.url}api/v1/events/${events}`);
      const eventData = await eventResponse.json();
      const staffNames = await this.getStaffNames(eventObj[events]);
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
      };
      return event;
    });

    return Promise.all(eventWithStaff);
  }

  getStaffNames = (ids) => {
    
    const promise = ids.map(async person => {
      const { staff_events_id, role } = person;
      let staff = {
        name: 'Staff Needed',
        staff_events_id,
        role
      };

      if ( person.staff_id !== null ){
        const staffResponse = 
          await fetch(`${this.url}api/v1/staff/${person.staff_id}`);

        const staffData = await staffResponse.json();

        staff.name = staffData[0].name;
      }

      return staff;
    });

    return Promise.all(promise);
  }

  postSchedule = (schedule) => {
    const promise = schedule.map( async (staffEvent) => {
      var response = await fetch(`${this.url}api/v1/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(staffEvent)
      });

      return await response.json();
    });

    return Promise.all(promise);
  }

  modifySchedule = (schedule) => {
    const promise = schedule.map( async (event) => {
      const { staff_events_id, staff_id, event_id, id } = event;
      const eventId = staff_events_id ? staff_events_id : id;

      const response = await fetch(`${this.url}api/v1/schedule/${ eventId }`, {
        method: 'PUT',
        body: JSON.stringify({ staff_id, event_id }),
        headers: { 'Content-Type': 'application/json' }
      });

      return await response.json();
    });

    return Promise.all(promise);
  }

  buildScheduleWithRoles = (event) => {
    let { bar_manager, ass_bar_manager, bartenders, barbacks, id } = event;
    const newEventStaffArray = [];

    if ( bar_manager ) {
      bar_manager = false;
      newEventStaffArray.push({
        staff_id: null,
        event_id: id,
        role: 'Bar Manager'
      });
    }

    if ( ass_bar_manager ) {
      ass_bar_manager = false;
      newEventStaffArray.push({
        staff_id: null,
        event_id: id,
        role: 'Assistant Bar Manager'
      });
    }

    for (let index = 0; index < bartenders; index++) {
      newEventStaffArray.push({
        staff_id: null,
        event_id: id,
        role: 'Bartender'
      });
    }

    for (let index = 0; index < barbacks; index++) {
      newEventStaffArray.push({
        staff_id: null,
        event_id: id,
        role: 'Barback'
      });
    }

    return newEventStaffArray;
  }


  cleanDateTime = (originalDate, orginalTime) => {
    const date = new Date(originalDate).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const time = new Date(`${originalDate} ${orginalTime}`)
      .toLocaleTimeString([], {
        hour: '2-digit', 
        minute: '2-digit'
      });

    return { date, time };
  }
}
