import { Api } from './Api';


describe('Api', () => {
  let mockStaff;
  let api;

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

  it('should get getNumberOfStaff', () => {
    const mockEvent = {
      bartenders: 4,
      barbacks: 3,
      bar_manager: true,
      ass_bar_manager: false
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

    expect(api.cleanDateTime('"2018-06-06"', '18:00'))
      .toEqual({"date": "2018 M06 6", "time": "18:00"});
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
});
