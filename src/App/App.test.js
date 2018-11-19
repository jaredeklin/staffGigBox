import React from 'react';
import App from './App';
import { shallow } from 'enzyme';
import {
  mockStaff,
  mockUnscheduledEvents,
  mockFillRolesReturn,
  mockNewSchedule,
  mockEventInfo,
  mockEmptySchedule,
  mockUnscheduledEvent,
  mockSchedule
} from '../mockData';

describe('App', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<App />, { disableLifecycleMethods: true });
  });

  it('should match the snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('addUser', () => {
    it('should update state when there is a user', async () => {
      const mockStaff = [
        { google_id: 12345, name: 'Jared', bar_manager: true }
      ];
      wrapper.setState({ staff: mockStaff });

      await wrapper.instance().addUser(12345);

      expect(wrapper.state('currentUser')).toEqual(mockStaff[0]);
      expect(wrapper.state('admin')).toEqual(true);
    });
  });

  describe('addStaff', () => {
    it('should update state', () => {
      wrapper.instance().addStaff();
      expect(wrapper.state('isCurrentStaff')).toEqual(true);
      expect(wrapper.state('addNewStaff')).toEqual(false);
    });
  });

  describe('deleteFromSchedule', () => {
    const person = {
      event_id: 2,
      schedule_id: 34,
      role: 'Assistant Bar Manager'
    };

    beforeEach(() => {
      window.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          status: 200
        })
      );
    });

    it('fetch should be called with correct params', async () => {
      const expected = [
        'http://localhost:3000/api/v1/schedule/34',
        { method: 'DELETE' }
      ];

      wrapper.instance().deleteFromSchedule(person);

      expect(window.fetch).toHaveBeenCalledWith(...expected);
    });

    it('should set the state with new schedule', async () => {
      const mockSchedule = [
        {
          event_id: 2,
          ass_bar_manager: true,
          staff: [{ schedule_id: 34, role: 'Assistant Bar Manager' }]
        },
        { event_id: 1, staff: [{ schedule_id: 23 }] }
      ];

      const expected = [
        { event_id: 2, ass_bar_manager: false, staff: [] },
        { event_id: 1, staff: [{ schedule_id: 23 }] }
      ];

      wrapper.setState({ schedule: mockSchedule });

      await wrapper.instance().deleteFromSchedule(person);

      expect(wrapper.state('schedule')).toEqual(expected);
    });
  });

  describe('addEvent', () => {
    it('should update state with events and unscheduled events', () => {
      wrapper.instance().addEvent(mockEventInfo, mockEmptySchedule);

      expect(wrapper.state('unscheduledEvents')).toEqual([
        mockUnscheduledEvent
      ]);
      expect(wrapper.state('events')).toEqual([mockEventInfo]);
    });
  });

  describe('editSchedule', () => {
    it('should update state with new schedule', async () => {
      wrapper.setState({ staff: mockStaff, schedule: mockSchedule });
      const mockChange = { staff_id: 2, event_id: 3, schedule_id: 1 };

      wrapper.instance().editSchedule(mockChange);

      expect(wrapper.state('schedule')).toEqual(mockSchedule);
    });
  });

  describe('scheduleGenerator', () => {
    it('should generate a schedule', async () => {
      wrapper.instance().api.modifySchedule = jest.fn();
      wrapper.instance().api.findAvailableStaff = jest.fn(() => mockStaff);
      wrapper.instance().api.fillRoles = jest.fn(() => mockFillRolesReturn);
      wrapper.instance().api.availableStaff = mockStaff;

      wrapper.setState({
        staff: mockStaff,
        unscheduledEvents: mockUnscheduledEvents
      });

      await wrapper.instance().scheduleGenerator();

      expect(wrapper.instance().api.findAvailableStaff).toHaveBeenCalledWith(
        'Jul 20, 2018',
        mockStaff
      );
      expect(wrapper.instance().api.fillRoles).toHaveBeenCalledTimes(1);
      expect(wrapper.instance().api.modifySchedule).toHaveBeenCalledWith(
        mockFillRolesReturn
      );

      expect(wrapper.state('schedule')).toEqual(mockNewSchedule);
      expect(wrapper.state('unscheduledEvents')).toEqual([]);
    });
  });

  describe('updateStateFromHelpers', () => {
    it('should update the state with helpers', async () => {
      const mockStaff = [{ name: 'taco' }];
      const mockEvent = [{ name: 'test event' }];
      const mockSchedule = {
        schedule: [{ name: 'test' }],
        unscheduledEvents: [{ name: 'test1' }]
      };

      const expectedState = {
        addNewStaff: false,
        admin: false,
        events: [{ name: 'test event' }],
        isCurrentStaff: false,
        schedule: [{ name: 'test' }],
        staff: [{ name: 'taco' }],
        unscheduledEvents: [{ name: 'test1' }],
        currentUser: {}
      };

      wrapper.instance().api.getStaff = jest.fn().mockReturnValue(mockStaff);
      wrapper.instance().api.getEvents = jest.fn().mockReturnValue(mockEvent);
      wrapper.instance().api.getSchedule = jest
        .fn()
        .mockReturnValue(mockSchedule);

      await wrapper.instance().updateStateFromHelpers();

      expect(wrapper.instance().api.getStaff).toHaveBeenCalled();
      expect(wrapper.instance().api.getEvents).toHaveBeenCalled();
      expect(wrapper.instance().api.getSchedule).toHaveBeenCalledWith(
        mockStaff,
        mockEvent
      );

      expect(wrapper.state()).toEqual(expectedState);
    });
  });

  describe('componentDidMount', () => {
    it('should call updateStateFromHelpers in componentDidMount', () => {
      wrapper.instance().updateStateFromHelpers = jest.fn();

      wrapper.instance().componentDidMount();

      expect(wrapper.instance().updateStateFromHelpers).toHaveBeenCalled();
    });
  });
});
