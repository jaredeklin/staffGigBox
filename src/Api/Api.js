export class Api {
  constructor() {
    this.url = process.env.REACT_APP_API_HOST || 'http://localhost:3000/';
  }

  getStaff = async () => {
    const response = await fetch(`${this.url}api/v1/staff`);

    return await response.json();
  };

  getEvents = async date => {
    let response;

    if (date) {
      response = await fetch(`${this.url}api/v1/events?date=${date}`);
    } else {
      response = await fetch(`${this.url}api/v1/events`);
    }

    return await response.json();
  };

  getSpecificEvent = async id => {
    const response = await fetch(`${this.url}api/v1/events/${id}`);

    return await response.json();
  };

  generateSchedule = async staff => {
    const response = await fetch(`${this.url}api/v1/schedule`);
    const scheduleData = await response.json();
    const unscheduledEvents = scheduleData.filter(
      schedule => schedule.staff_id === null
    );

    if (unscheduledEvents.length) {
      const eventData = await this.getEventData(unscheduledEvents);
      let eventArray = [];

      for (const eventInfo of eventData) {
        const unscheduledStaff = await this.getUnscheduledStaff(
          staff,
          eventInfo.date
        );
        const schedule = this.fillScheduleRoles(
          unscheduledEvents,
          unscheduledStaff,
          eventInfo
        );

        eventArray = [...eventArray, ...schedule];
      }

      return eventArray;
    } else {
      return console.log('All events currently scheduled'); // eslint-disable-line
    }
  };

  fillScheduleRoles = (unscheduledEvents, unscheduledStaff, eventInfo) => {
    const singleEvent = unscheduledEvents.filter(
      concert => eventInfo.id === concert.event_id
    );
    let barManagers = [];
    let assBarManagers = [];
    let barbacks = [];
    let bartenders = [];

    // staff should just be the available staff for the day
    unscheduledStaff.forEach(person => {
      if (person.bar_manager) {
        barManagers.push(person);
      } else if (person.ass_bar_manager) {
        assBarManagers.push(person);
      } else if (person.barback) {
        barbacks.push(person);
      } else {
        bartenders.push(person);
      }
    });

    const schedule = singleEvent.reduce((array, event) => {
      if (event.role === 'Bar Manager') {
        const managerIndex = Math.floor(Math.random() * barManagers.length);

        event.staff_id = barManagers[managerIndex].id;
        barManagers.splice(managerIndex, 1);

        if (eventInfo.ass_bar_manager) {
          assBarManagers = [...assBarManagers, ...barManagers];
        } else {
          bartenders = [...bartenders, ...barManagers];
        }
      }

      if (event.role === 'Assistant Bar Manager') {
        const assManagerIndex = Math.floor(
          Math.random() * assBarManagers.length
        );

        event.staff_id = assBarManagers[assManagerIndex].id;
        assBarManagers.splice(assManagerIndex, 1);

        bartenders = [...bartenders, ...assBarManagers];
      }

      if (event.role === 'Bartender') {
        const bartenderIndex = Math.floor(Math.random() * bartenders.length);

        event.staff_id = bartenders[bartenderIndex].id;
        bartenders.splice(bartenderIndex, 1);
      }

      if (event.role === 'Barback') {
        const barbackIndex = Math.floor(Math.random() * barbacks.length);

        event.staff_id = barbacks[barbackIndex].id;
        barbacks.splice(barbackIndex, 1);
      }

      return [...array, event];
    }, []);

    return schedule;
  };

  getUnscheduledStaff = async (staff, date) => {
    const events = await this.getEvents(date);
    let availableStaff = [...staff];

    for (const event of events) {
      const scheduledStaff = await this.getSchedule(event.id);

      availableStaff = availableStaff.filter(member => {
        return !scheduledStaff.staff.some(person => {
          return member.id === person.staff_id;
        });
      });
    }

    return Promise.all(availableStaff);
  };

  getEventData = async events => {
    const eventArray = [];

    for (const event of events) {
      const found = eventArray.find(concert => concert.id === event.event_id);

      if (!found) {
        const eventDetails = await this.getSpecificEvent(event.event_id);

        eventArray.push(eventDetails[0]);
      }
    }

    return eventArray;
  };

  getNumberOfStaff = event => {
    if (event) {
      let staffNeeded = event.bartenders + event.barbacks;

      if (event.bar_manager) {
        staffNeeded++;
      }

      if (event.ass_bar_manager) {
        staffNeeded++;
      }

      return staffNeeded;
    }
  };

  checkSchedule = async date => {
    const response = await fetch(
      `${this.url}api/v1/schedule?event_date=${date}`
    );
    return await response.json();
  };

  getSchedule = async id => {
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
  };

  cleanScheduleData = schedule => {
    const scheduleObj = schedule.reduce((scheduleObj, event) => {
      const { staff_id, id, role } = event;

      if (!scheduleObj[event.event_id]) {
        scheduleObj[event.event_id] = [];
      }

      scheduleObj[event.event_id] = [
        ...scheduleObj[event.event_id],
        {
          staff_id,
          staff_events_id: id,
          role
        }
      ];

      return scheduleObj;
    }, {});

    return scheduleObj;
  };

  combineStaffAndEvent = async eventObj => {
    const eventWithStaff = Object.keys(eventObj).map(async eventId => {
      const eventResponse = await fetch(`${this.url}api/v1/events/${eventId}`);
      const eventData = await eventResponse.json();

      const staffNames = await this.getStaffNames(eventObj[eventId]);

      return { ...eventData, staff: staffNames };
    });

    return Promise.all(eventWithStaff);
  };

  getStaffNames = ids => {
    const promise = ids.map(async person => {
      const { schedule_id, staff_id, role } = person;
      let staff = { name: 'Staff Needed', staff_id, schedule_id, role };

      if (person.staff_id !== null) {
        const staffResponse = await fetch(
          `${this.url}api/v1/staff/${person.staff_id}`
        );

        const staffData = await staffResponse.json();

        staff.name = staffData[0].name;
      }

      return staff;
    });

    return Promise.all(promise);
  };

  postSchedule = schedule => {
    const promise = schedule.map(async staffEvent => {
      const response = await fetch(`${this.url}api/v1/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(staffEvent)
      });

      return await response.json();
    });

    return Promise.all(promise);
  };

  modifySchedule = schedule => {
    const promise = schedule.map(async event => {
      const { staff_events_id, staff_id, event_id, id } = event;
      const eventId = staff_events_id ? staff_events_id : id;

      const response = await fetch(`${this.url}api/v1/schedule/${eventId}`, {
        method: 'PUT',
        body: JSON.stringify({ staff_id, event_id }),
        headers: { 'Content-Type': 'application/json' }
      });

      return await response.json();
    });

    return Promise.all(promise);
  };

  buildScheduleWithRoles = event => {
    let {
      bar_manager,
      ass_bar_manager,
      bartenders,
      barbacks,
      event_id,
      date
    } = event;
    const scheduleArray = [];
    const info = { staff_id: null, event_id, event_date: date };

    if (bar_manager) {
      scheduleArray.push({ ...info, role: 'Bar Manager' });
    }

    if (ass_bar_manager) {
      scheduleArray.push({
        ...info,
        role: 'Assistant Bar Manager'
      });
    }

    while (bartenders > 0) {
      scheduleArray.push({ ...info, role: 'Bartender' });
      bartenders--;
    }

    while (barbacks > 0) {
      scheduleArray.push({ ...info, role: 'Barback' });
      barbacks--;
    }

    return scheduleArray;
  };

  postAvailability = (id, dates) => {
    const promise = dates.map(async day => {
      const response = await fetch(`${this.url}api/v1/availability`, {
        method: 'POST',
        body: JSON.stringify({
          staff_id: id,
          date_unavailable: day
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      return await response.json();
    });

    return Promise.all(promise);
  };

  checkAvailability = async date => {
    const dateQuery = `date_unavailable=${date}`;
    const response = await fetch(`${this.url}api/v1/availability?${dateQuery}`);

    return response.json();
  };

  getAvailability = async (id, date, futureDates) => {
    let response;

    if (futureDates) {
      const futureQuery = `staff_id=${id}&future=${futureDates}`;
      response = await fetch(`${this.url}api/v1/availability?${futureQuery}`);
    } else if (id && date && !futureDates) {
      const dateQuery = `staff_id=${id}&date_unavailable=${date}`;
      response = await fetch(`${this.url}api/v1/availability?${dateQuery}`);
    } else {
      response = await fetch(`${this.url}api/v1/availability?staff_id=${id}`);
    }

    return await response.json();
  };

  deleteAvailability = async (id, dates) => {
    const promise = dates.map(async day => {
      const query = `staff_id=${id}&date_unavailable=${day}`;
      const response = await fetch(`${this.url}api/v1/availability?${query}`, {
        method: 'DELETE'
      });

      return await response.json();
    });

    return Promise.all(promise);
  };

  getClassName = role => {
    switch (role) {
      case 'Bar Manager':
        return 'bar-manager';

      case 'Assistant Bar Manager':
        return 'ass-bar-manager';

      case 'Bartender':
        return 'bartenders';

      case 'Barback':
        return 'barbacks';

      default:
        break;
    }
  };
}
