import { Api } from './Api';


describe('Api', () => {
  let mockStaff;
  let api;
  const url = 'http://localhost:3000/api/v1/';

  beforeEach(() => {
    api = new Api();
    mockStaff = [
      { name: 'taco' },
      { name: 'hipster pant' }
    ];

    window.fetch = jest.fn(() => Promise.resolve({
      status: 200,
      json: () => Promise.resolve({
        staff: mockStaff
      })
    }));
  });

  it('should get staff', async () => {
    const expected = 'http://localhost:3000/api/v1/staff';
    await api.getStaff();

    expect(window.fetch).toHaveBeenCalledWith(expected);
  });

  it('should get events', async () => {
    const expected = 'http://localhost:3000/api/v1/events';
    await api.getEvents();

    expect(window.fetch).toHaveBeenCalledWith(expected);
  });

  it('generateSchedule should be called with the correct params', async () => {
    const expected = 'http://localhost:3000/api/v1/schedule';
    const mockStaff = [{}];
    const mockSchedule = [{ staff_id: null }];
    const expectedReturn = [{ staff_id: null }];

    window.fetch = jest.fn(() => Promise.resolve({
      status: 200,
      json: () => Promise.resolve(mockSchedule)
    }));

    await api.generateSchedule(mockStaff);
    expect(window.fetch).toHaveBeenCalledWith(expected);
    expect(await api.generateSchedule(mockStaff)).toEqual(expectedReturn);
  });

  it('should get getNumberOfStaff', () => {
    const mockEvent = {
      bartenders: 4,
      barbacks: 2,
      bar_manager: true,
      ass_bar_manager: true
    };

    expect(api.getNumberOfStaff(mockEvent)).toEqual(8);
  });


  it('should get the schedules', async () => {
    const mockSchedule = { schedule: 'thebesten' };
    const expected = 'http://localhost:3000/api/v1/schedule';

    api.cleanScheduleData = jest.fn();
    api.combineStaffAndEvent = jest.fn().mockReturnValue(mockSchedule);

    await api.getSchedule();
    expect(window.fetch).toHaveBeenCalledWith(expected);
    expect(api.cleanScheduleData).toHaveBeenCalled();
    expect(api.combineStaffAndEvent).toHaveBeenCalled();
    expect(await api.getSchedule()).toEqual(mockSchedule);
  });

  it('should get a specific schedule', async () => {
    const mockSchedule = { schedule: 'thebesten' };
    const expected = 'http://localhost:3000/api/v1/schedule?event_id=23';

    api.cleanScheduleData = jest.fn();
    api.combineStaffAndEvent = jest.fn().mockReturnValue(mockSchedule);

    await api.getSchedule(23);
    expect(window.fetch).toHaveBeenCalledWith(expected);
    expect(api.cleanScheduleData).toHaveBeenCalled();
    expect(api.combineStaffAndEvent).toHaveBeenCalled();
    expect(await api.getSchedule()).toEqual(mockSchedule);
  });


  it('should clean the schedule data', () => {
    const mockScheduleData = [
      { id: 1, event_id: 1, staff_id: 3 },
      { id: 2, event_id: 1, staff_id: 4 }
    ];

    const mockCleanScheduleData = {
      1: [
        { staff_events_id: 1, staff_id: 3 },
        { staff_events_id: 2, staff_id: 4 }
      ]
    };

    api.cleanScheduleData(mockScheduleData);

    expect(api.cleanScheduleData(mockScheduleData))
      .toEqual(mockCleanScheduleData);
  });

  it('should combine staff and event', async () => {
    const mockEventResponse = [{
      event_id: 1,
      venue: 'Bluebird',
      name: 'Elvis',
      date: 'today',
      time: '7 pm'
    }];

    window.fetch = jest.fn(() => Promise.resolve({
      status: 200,
      json: () => Promise.resolve(mockEventResponse)
    }));

    const mockCleanScheduleData = {
      1: [
        { staff_events_id: 1, staff_id: 3 },
        { staff_events_id: 2, staff_id: 4 }
      ]
    };

    api.getStaffNames = jest.fn();

    const expected = 'http://localhost:3000/api/v1/events/1';
    await api.combineStaffAndEvent(mockCleanScheduleData);

    expect(window.fetch).toHaveBeenCalledWith(expected);
    expect(api.getStaffNames).toHaveBeenCalled();
  });

  it('should get the names of the staff', async () => {
    const mockIds = [{ staff_events_id: 1, staff_id: 3 }];
    const expected = 'http://localhost:3000/api/v1/staff/3';

    window.fetch = jest.fn(() => Promise.resolve({
      status: 200,
      json: () => Promise.resolve([
        { id: 3, name: 'hotman' }
      ])
    }));

    await api.getStaffNames(mockIds);

    expect(await window.fetch).toHaveBeenCalledWith(expected);
  });

  it('should post schedules to the database', () => {
    const mockScheduleData = [
      { id: 2, event_id: 1, staff_id: 4 }
    ];

    const expected = [
      'http://localhost:3000/api/v1/schedule',
      {
        method: 'POST',
        body: JSON.stringify({ id: 2, event_id: 1, staff_id: 4 }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ];

    api.postSchedule(mockScheduleData);

    expect(window.fetch).toHaveBeenCalledWith(...expected);
  });

  it('cleanDateTime should reformat dates and times', () => {

    expect(api.cleanDateTime('2018-06-06', '18:00'))
      .toEqual({"date": "Jun 6, 2018", "time": "6:00 PM"});
  });

  it('modifySchedule should be called with the correct params', async () => {
    const mockSchedule = [{ staff_events_id: 23, staff_id:2, event_id: 4 }];

    const expected = [
      'http://localhost:3000/api/v1/schedule/23', {
        method: 'PUT',
        body: JSON.stringify({ staff_id: 2, event_id: 4 }),
        headers: { 'Content-Type': 'application/json' }
      }
    ];

    await api.modifySchedule(mockSchedule);

    expect(window.fetch).toHaveBeenCalledWith(...expected);
  });

  it('should buildScheduleWithRoles', () => {

    const mockEvent = {
      bar_manager: true, 
      ass_bar_manager: true, 
      bartenders: 3, 
      barbacks: 1,
      id: 23
    };

    const expected = [
      {
        "event_id": 23, 
        "role": "Bar Manager", 
        "staff_id": null
      }, {
        "event_id": 23, 
        "role": "Assistant Bar Manager", 
        "staff_id": null
      }, {
        "event_id": 23, 
        "role": "Bartender", 
        "staff_id": null
      }, {
        "event_id": 23, 
        "role": "Bartender", 
        "staff_id": null
      }, {
        "event_id": 23, 
        "role": "Bartender", 
        "staff_id": null
      }, {
        "event_id": 23, 
        "role": "Barback", 
        "staff_id": null
      }];

    expect(api.buildScheduleWithRoles(mockEvent)).toEqual(expected);
  });


  it('deleteAvailability should be called with the correct params', () => {

    const expected = [
      `${url}availability?staff_id=2&date_unavailable=June 30, 2018`, {
        method: 'DELETE' 
      }
    ];

    api.deleteAvailability(2, 'June 30, 2018');
    
    expect(window.fetch).toHaveBeenCalledWith(...expected);
  });

  it('getAvailability should be called with correct params when both id and date are provided', () => { // eslint-disable-line
    const expected = `${url}availability?staff_id=2&date_unavailable=June 30, 2018`; // eslint-disable-line

    api.getAvailability(2, 'June 30, 2018');
    
    expect(window.fetch).toHaveBeenCalledWith(expected);
  });

  it('getAvailability should be called with correct params when only the id is provided', () => { // eslint-disable-line
    const expected = 'http://localhost:3000/api/v1/availability?staff_id=2';

    api.getAvailability(2);
    
    expect(window.fetch).toHaveBeenCalledWith(expected);
  });


  it('postAvailability should be called with correct params', () => {
    const mockDate = 'June 30, 2018';
    const mockId = 2;
    const expected = [
      'http://localhost:3000/api/v1/availability',
      {
        method: 'POST',
        body: JSON.stringify({ 
          staff_id: mockId,
          date_unavailable: mockDate
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ];

    api.postAvailability(mockId, [mockDate]);

    expect(window.fetch).toHaveBeenCalledWith(...expected); 
  });
});
