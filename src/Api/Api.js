export class Api {
  constructor() {
    this.url = process.env.REACT_APP_API_HOST || 'http://localhost:3000/';
    this.availableStaff = [];
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

  postEvent = async event => {
    try {
      const response = await fetch(`${this.url}api/v1/events`, {
        method: 'POST',
        body: JSON.stringify(event),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return await response.json();
    } catch (error) {
      return error;
    }
  };

  checkSchedule = async date => {
    const response = await fetch(
      `${this.url}api/v1/schedule?event_date=${date}`
    );
    return await response.json();
  };

  getSchedule = async (staff, events) => {
    const response = await fetch(`${this.url}api/v1/schedule`);
    const rawSchedule = await response.json();

    const schedule = events.reduce(
      (schedAcc, event) => {
        const { event_id } = event;
        const staffId = rawSchedule.filter(
          sched => sched.event_id === event_id
        );

        const eventStaff = staffId.map(person => {
          const { role, schedule_id } = person;
          const staffObj = staff.find(
            member => person.staff_id === member.staff_id
          );

          if (!staffObj) {
            return {
              staff_id: null,
              name: 'Staff Needed',
              event_id,
              role,
              schedule_id
            };
          }

          return { ...staffObj, event_id, role, schedule_id };
        });

        const findUnscheduled = eventStaff.find(staff => !staff.staff_id);

        if (!findUnscheduled) {
          schedAcc.schedule = [
            ...schedAcc.schedule,
            { ...event, staff: eventStaff }
          ];
        } else {
          schedAcc.unscheduledEvents = [
            ...schedAcc.unscheduledEvents,
            { ...event, staff: eventStaff }
          ];
        }

        return schedAcc;
      },
      { schedule: [], unscheduledEvents: [] }
    );

    return schedule;
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
      const { schedule_id, staff_id, event_id } = event;

      const response = await fetch(
        `${this.url}api/v1/schedule/${schedule_id}`,
        {
          method: 'PUT',
          body: JSON.stringify({ staff_id, event_id }),
          headers: { 'Content-Type': 'application/json' }
        }
      );

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

  rolesRegex = role => {
    return role
      .toLowerCase()
      .replace(/ /gi, '_')
      .replace(/assistant/gi, 'ass');
  };

  findAvailableStaff = async (date, staff) => {
    const alreadyScheduled = await this.checkSchedule(date);
    const notAvailable = await this.checkAvailability(date);
    const unavailable = [...alreadyScheduled, ...notAvailable];

    const availableStaff = staff.filter(staff => {
      return !unavailable.some(person => staff.staff_id === person.staff_id);
    });

    this.availableStaff = this.shuffleStaffArray(availableStaff);

    return this.availableStaff;
  };

  fillRoles = events => {
    const fillStaffRoles = events.reduce((staffAcc, event) => {
      const getStaff = (event, role) => {
        const staffRole = this.rolesRegex(role);
        const staffList = event.staff.filter(staff => staff.role === role);
        const staffName = staffList.map(person => {
          if (person.staff_id) {
            return person;
          }

          const staff = this.availableStaff.find(staff => staff[staffRole]);
          this.availableStaff = this.availableStaff.filter(
            person => person !== staff
          );

          return { ...person, staff_id: staff.staff_id, name: staff.name };
        });

        return staffName;
      };
      const barManager = getStaff(event, 'Bar Manager');
      const assManager = getStaff(event, 'Assistant Bar Manager');
      const barbacks = getStaff(event, 'Barback');
      const bartenders = getStaff(event, 'Bartender');

      return [
        ...staffAcc,
        ...barManager,
        ...assManager,
        ...barbacks,
        ...bartenders
      ];
    }, []);

    return fillStaffRoles;
  };

  shuffleStaffArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  };

  getHeaderText = ({ pathname }) => {
    switch (pathname) {
      case '/availability':
        return 'Availability';

      case '/add-events':
        return 'Add Events';

      case '/add-staff':
        return 'Add Staff';

      case '/unscheduled-events':
        return 'Unscheduled Events';

      default:
        return 'Schedule';
    }
  };
}
