

export class Api  {
  constructor() {
    this.url = process.env.REACT_APP_API_HOST || 'http://localhost:3000';
  }

  getStaff = async () => {
    const response = await fetch(`${this.url}api/v1/staff`);

    return await response.json();
  }

  getEvents = async () => {
    const response = await fetch(`${this.url}api/v1/events`);

    return await response.json();
  }

  // ripe for refactor
  generateSchedule = async (staff) => {
    const response = await fetch(`${this.url}api/v1/schedule`);
    const currentScheduleData = await response.json();
    const unscheduledEvents = currentScheduleData.filter(schedule => schedule.staff_id === null);
    const schedule = unscheduledEvents.reduce((array, event) => {

      event.staff_id = Math.floor(Math.random() * staff.length) + 1;

      return [...array, event];
    });

    return schedule;
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

      scheduleObj[event.event_id] = [...scheduleObj[event.event_id], { staff_id, staff_events_id: id, role}];

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
        const staffResponse = await fetch(`${this.url}api/v1/staff/${person.staff_id}`);
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
      const response = await fetch(`${this.url}api/v1/schedule/${staff_events_id ? staff_events_id : id}`, {
        method: 'PUT',
        body: JSON.stringify({ staff_id, event_id }),
        headers: { 'Content-Type': 'application/json' }
      });

      return await response.json();
    });

    return Promise.all(promise);
  }

  buildScheduleWithRoles = (event) => {
    let { bar_manager, ass_bar_manager, bartenders, barbacks } = event;
    const newEventStaffArray = [];

    if ( bar_manager ) {
      bar_manager = false;
      newEventStaffArray.push({
        staff_id: null,
        event_id: event.id,
        role: 'Bar Manager'
      });
    }

    if ( ass_bar_manager ) {
      ass_bar_manager = false;
      newEventStaffArray.push({
        staff_id: null,
        event_id: event.id,
        role: 'Assistant Bar Manager'
      });
    }

    for (let index = 0; index < bartenders; index++) {
      newEventStaffArray.push({
        staff_id: null,
        event_id: event.id,
        role: 'Bartender'
      });
    }

    for (let index = 0; index < barbacks; index++) {
      newEventStaffArray.push({
        staff_id: null,
        event_id: event.id,
        role: 'Barback'
      });
    }

    return newEventStaffArray;
  }
}
