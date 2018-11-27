import { Api } from './Api';
import {
  mockStaff,
  mockBuildRolesReturn,
  mockEventToFillRoles,
  mockFillRolesReturn,
  mockApiSchedule,
  mockEventInfo,
  mockApiScheduleReturn,
  mockEventsInfo,
  mockUnscheduledEvents,
  mockFEScheduleData
} from '../mockData';

describe('Api', () => {
  let api;
  const url = 'http://localhost:3000/api/v1/';

  beforeEach(() => {
    api = new Api();

    window.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            staff: mockStaff
          })
      })
    );
  });

  describe('getStaff', () => {
    it('should call fetch with correct params', async () => {
      const expected = 'http://localhost:3000/api/v1/staff';
      await api.getStaff();

      expect(window.fetch).toHaveBeenCalledWith(expected);
    });
  });

  describe('postEvent', () => {
    const mockEventObj = {
      venue: 'Gothic Theatre',
      name: 'Ratatat',
      date: '2018-06-06',
      time: '6:00 pm'
    };
    beforeEach(() => {
      window.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockEventObj)
        })
      );
    });

    it('should call fetch with correct params', () => {
      const expected = [
        'http://localhost:3000/api/v1/events',
        {
          method: 'POST',
          body: JSON.stringify(mockEventObj),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ];
      api.postEvent(mockEventObj);
      expect(window.fetch).toHaveBeenCalledWith(...expected);
    });

    it('should return the correct value', async () => {
      expect(await api.postEvent(mockEventObj)).toEqual(mockEventObj);
    });

    it('should throw an error if response is bad', async () => {
      window.fetch = jest.fn(() =>
        Promise.resolve({ ok: false, statusText: 'Not Found' })
      );

      expect(await api.postEvent()).toEqual(Error('Not Found'));
    });
  });

  it('should post schedules to the database', () => {
    const mockScheduleData = [{ id: 2, event_id: 1, staff_id: 4 }];

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

  it('modifySchedule should be called with the correct params', async () => {
    const mockSchedule = [{ schedule_id: 23, staff_id: 2, event_id: 4 }];

    const expected = [
      'http://localhost:3000/api/v1/schedule/23',
      {
        method: 'PUT',
        body: JSON.stringify({ staff_id: 2, event_id: 4 }),
        headers: { 'Content-Type': 'application/json' }
      }
    ];

    await api.modifySchedule(mockSchedule);

    expect(window.fetch).toHaveBeenCalledWith(...expected);
  });

  describe('buildScheduleWithRoles', () => {
    it('should build a schedule with roles and default names', () => {
      const mockEvent = {
        venue: 'Ogden Theatre',
        name: 'Ratatat',
        date: '2018-06-30',
        time: '6:00 pm',
        bar_manager: true,
        ass_bar_manager: true,
        bartenders: 4,
        barbacks: 2,
        beer_bucket: false,
        event_id: 24
      };

      expect(api.buildScheduleWithRoles(mockEvent)).toEqual(
        mockBuildRolesReturn
      );
    });
  });

  describe('deleteAvailability', () => {
    it('should be called with the correct params', () => {
      const expected = [
        `${url}availability?staff_id=2&date_unavailable=2018-06-30`,
        { method: 'DELETE' }
      ];

      api.deleteAvailability(2, ['2018-06-30']);

      expect(window.fetch).toHaveBeenCalledWith(...expected);
    });
  });

  describe('getAvailability', () => {
    it('should be called with correct params when both id and date are provided', () => {
      const expected = `${url}availability?staff_id=2&date_unavailable=June 30, 2018`;

      api.getAvailability(2, 'June 30, 2018');

      expect(window.fetch).toHaveBeenCalledWith(expected);
    });

    it('should be called with correct params when only the id is provided', () => {
      const expected = 'http://localhost:3000/api/v1/availability?staff_id=2';

      api.getAvailability(2);

      expect(window.fetch).toHaveBeenCalledWith(expected);
    });

    it('should be called with correct params when future is truthy', () => {
      const expected = `${url}availability?staff_id=2&future=true`;

      api.getAvailability(2, null, true);

      expect(window.fetch).toHaveBeenCalledWith(expected);
    });
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

  describe('getEvents', () => {
    const mockEventData = [
      {
        id: 3,
        name: 'Lupe Fiasco'
      }
    ];

    beforeEach(() => {
      window.fetch = jest.fn(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve(mockEventData)
        })
      );
    });

    it('should call fetch with correct params', () => {
      const url = 'http://localhost:3000/api/v1/events';

      api.getEvents();
      expect(window.fetch).toHaveBeenCalledWith(url);
    });

    it('should call fetch with correct params when there is a date', () => {
      const url = 'http://localhost:3000/api/v1/events?date=2018-06-30';

      api.getEvents('2018-06-30');
      expect(window.fetch).toHaveBeenCalledWith(url);
    });

    it('should return correct event information', async () => {
      expect(await api.getEvents()).toEqual(mockEventData);
    });
  });

  describe('getClassName', () => {
    it('should return correct class names', () => {
      expect(api.getClassName('Bar Manager')).toEqual('bar-manager');
      expect(api.getClassName('Assistant Bar Manager')).toEqual(
        'ass-bar-manager'
      );
      expect(api.getClassName('Bartender')).toEqual('bartenders');
      expect(api.getClassName('Barback')).toEqual('barbacks');
      expect(api.getClassName()).toEqual(undefined);
    });
  });

  describe('checkAvailability', () => {
    const mockReturnValue = {
      availability_id: 1,
      staff_id: 2,
      date_unavailable: '2018-06-30'
    };
    beforeEach(() => {
      window.fetch = jest.fn(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve(mockReturnValue)
        })
      );
    });
    it('should call fetch with correct params', () => {
      const url =
        'http://localhost:3000/api/v1/availability?date_unavailable=2018-06-30';

      api.checkAvailability('2018-06-30');
      expect(window.fetch).toHaveBeenCalledWith(url);
    });

    it('should return the correct value', async () => {
      expect(await api.checkAvailability('2018-06-30')).toEqual(
        mockReturnValue
      );
    });
  });

  describe('findAvailableStaff', () => {
    it('should return the correct value', async () => {
      api.checkSchedule = jest.fn(() => []);
      api.checkAvailability = jest.fn(() => []);
      api.shuffleStaffArray = jest.fn(() => mockStaff);

      const mockReturn = await api.findAvailableStaff(
        'Jul 20, 2018',
        mockStaff
      );

      expect(api.checkSchedule).toHaveBeenCalledWith('Jul 20, 2018');
      expect(api.checkAvailability).toHaveBeenCalledWith('Jul 20, 2018');
      expect(mockReturn).toEqual(mockStaff);
    });
  });

  describe('shuffleStaffArray', () => {
    it('should return the correct value', () => {
      Math.random = jest.fn(() => 0.5);
      const staffArray = [{ name: 'jared' }, { name: 'tk' }];
      expect(api.shuffleStaffArray(staffArray)).toEqual(staffArray);
    });
  });

  describe('rolesRegex', () => {
    it('should return a cleaned word', () => {
      const expReturn = api.rolesRegex('Assistant Bar Manager');
      expect(expReturn).toEqual('ass_bar_manager');
    });
  });

  describe('fillRoles', () => {
    it('should return correct roles with staff', () => {
      api.availableStaff = mockStaff;
      expect(api.fillRoles(mockEventToFillRoles)).toEqual(mockFillRolesReturn);
    });
  });

  describe('getSchedule', () => {
    beforeEach(() => {
      window.fetch = jest.fn(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve(mockApiSchedule)
        })
      );
    });

    it('should call fetch with correct params', () => {
      const url = 'http://localhost:3000/api/v1/schedule';
      api.getSchedule(mockStaff, mockEventsInfo);
      expect(window.fetch).toHaveBeenCalledWith(url);
    });

    it('should return correct values', async () => {
      const expReturn = await api.getSchedule(mockStaff, [mockEventInfo]);

      expect(expReturn).toEqual(mockApiScheduleReturn);
    });
  });

  describe('checkSchedule', () => {
    it('should call fetch with correct params', () => {
      window.fetch = jest.fn(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve()
        })
      );

      const url = 'http://localhost:3000/api/v1/schedule?event_date=2018-07-20';

      api.checkSchedule('2018-07-20');
      expect(window.fetch).toHaveBeenCalledWith(url);
    });
  });
  describe('getHeaderText', () => {
    it('should return correct text', () => {
      expect(api.getHeaderText({ pathname: '/availability' })).toEqual(
        'Availability'
      );
      expect(api.getHeaderText({ pathname: '/add-events' })).toEqual(
        'Add Events'
      );
      expect(api.getHeaderText({ pathname: '/add-staff' })).toEqual(
        'Add Staff'
      );
      expect(api.getHeaderText({ pathname: '/unscheduled-events' })).toEqual(
        'Unscheduled Events'
      );
      expect(api.getHeaderText({ pathname: '/schedule' })).toEqual('Schedule');
    });
  });

  describe('getIndividualSchedules', () => {
    const mockCurrentUser = { staff_id: 3 };
    const mockSchedules = [
      { ...mockFEScheduleData[0], venue: 'Bluebird Theater' },
      { ...mockFEScheduleData[0], venue: 'Gothic Theatre' },
      { ...mockFEScheduleData[0], venue: 'Ogden Theatre' }
    ];

    it('should return the schedule when path is schedule', () => {
      expect(
        api.getIndividualSchedules('/schedule', mockFEScheduleData)
      ).toEqual(mockFEScheduleData);
    });

    it('should return unscheduled events when path is unscheduled events', () => {
      expect(
        api.getIndividualSchedules(
          '/unscheduled-events',
          mockFEScheduleData,
          mockUnscheduledEvents
        )
      ).toEqual(mockUnscheduledEvents);
    });

    it('should return an individual schedule', () => {
      expect(
        api.getIndividualSchedules(
          '/schedule/individual',
          mockSchedules,
          mockUnscheduledEvents,
          mockCurrentUser
        )
      ).toEqual(mockSchedules);
    });

    it('should return the bluebird schedule', () => {
      expect(
        api.getIndividualSchedules('/schedule/bluebird', mockSchedules)
      ).toEqual([mockSchedules[0]]);
    });

    it('should return the gothic schedule', () => {
      expect(
        api.getIndividualSchedules('/schedule/gothic', mockSchedules)
      ).toEqual([mockSchedules[1]]);
    });

    it('should return the Ogden schedule', () => {
      expect(
        api.getIndividualSchedules('/schedule/ogden', mockSchedules)
      ).toEqual([mockSchedules[2]]);
    });
  });
});
