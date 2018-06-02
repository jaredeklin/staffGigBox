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

    window.fetch = jest.fn(
      () => Promise.resolve({
        status: 200,
        json: () => Promise.resolve({
          staff: mockStaff
        })
      })
    )
    // window.fetch = jest.fn().mockResolvedValue(mockStaff);
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
    const mockSchedule = { schedule: 'thebesten'}
    // const mockScheduleData = [
    //   { id: 1, event_id: 1, staff_id: 3 },
    //   { id: 2, event_id: 1, staff_id: 4 }
    // ]
    //
    // const mockCleanScheduleData = {"1": [
    //   {"staff_events_id": 1, "staff_id": 3},
    //   {"staff_events_id": 2, "staff_id": 4}
    // ]}

    const expected = 'http://localhost:3000/api/v1/schedule';
    api.cleanScheduleData = jest.fn();
    api.combineStaffAndEvent = jest.fn().mockReturnValue(mockSchedule);


    await api.getSchedule();
    expect(window.fetch).toHaveBeenCalledWith(expected)
    expect(api.cleanScheduleData).toHaveBeenCalled();
    expect(api.combineStaffAndEvent).toHaveBeenCalled();
    expect(await api.getSchedule()).toEqual(mockSchedule);
  })


  it('should clean the schedule data', () => {
    // const api = new Api();
    // api.cleanScheduleData() = mockClear()

    const mockScheduleData = [
      { id: 1, event_id: 1, staff_id: 3 },
      { id: 2, event_id: 1, staff_id: 4 }
    ]

    const mockCleanScheduleData = {"1": [
      {"staff_events_id": 1, "staff_id": 3},
      {"staff_events_id": 2, "staff_id": 4}
    ]}

    api.cleanScheduleData(mockScheduleData)

    expect(api.cleanScheduleData(mockScheduleData)).toEqual(mockCleanScheduleData)
  })

  it.skip('should combine staff and event', async () => {
    const mockEventResponse = [{
      event_id: 1,
      venue: 'Bluebird',
      name: 'Elvis',
      date: 'today',
      time: '7 pm'
    }]

    window.fetch = jest.fn(
      () => Promise.resolve({
        status: 200,
        json: () => Promise.resolve({
          eventData: mockEventResponse
        })
      })
    )

    const mockCleanScheduleData = {"1": [
      {"staff_events_id": 1, "staff_id": 3},
      {"staff_events_id": 2, "staff_id": 4}
    ]}

    // api.getStaffNames = jest.fn().mockReturnValue()

    const expected = 'http://localhost:3000/api/v1/events/1';
    await api.combineStaffAndEvent(mockCleanScheduleData);

    // expect(window.fetch).toHaveBeenCalledWith(expected)
  })

  it('should get the names of the staff', () => {
    
  })
})
