import React from 'react';
import App from './App';
import { shallow } from 'enzyme';
import {
  mockStaff,
  mockUnscheduledEvents,
  mockFillRolesReturn,
  mockNewSchedule
} from '../mockData';

describe('App', () => {
  let wrapper;
  let mockUser1;

  beforeEach(() => {
    wrapper = shallow(<App />, { disableLifecycleMethods: true });
    mockUser1 = {
      uid: 12345
    };
  });

  it('should match the snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('addUser', () => {
    it('should update state and call checkAuthorization when there is a user', async () => {
      const mockStaff = [
        {
          google_id: 12345
        }
      ];

      wrapper.instance().checkAuthorization = jest.fn();
      wrapper.setState({ staff: mockStaff });
      await wrapper.instance().addUser(mockUser1);

      expect(wrapper.state('user')).toEqual(mockUser1);
      expect(wrapper.state('isCurrentStaff')).toEqual(false);
      expect(wrapper.instance().checkAuthorization).toHaveBeenCalledWith({
        google_id: 12345
      });
    });

    it('should set admin and tabs state if not a user ', async () => {
      await wrapper.instance().addUser();

      expect(wrapper.state('tabs')).toEqual(['Schedule']);
      expect(wrapper.state('admin')).toEqual(false);
    });
  });

  describe('checkAuthorization', () => {
    it('should set state with correct values when authorized', () => {
      wrapper.instance().checkAuthorization({ google_id: 12345, staff_id: 3 });

      expect(wrapper.state('isCurrentStaff')).toEqual(true);
      expect(wrapper.state('tabs')).toEqual([
        'Schedule',
        'Submit Availability'
      ]);
      expect(wrapper.state('admin')).toEqual(false);
      expect(wrapper.state('currentUserId')).toEqual(3);

      wrapper.instance().checkAuthorization({
        google_id: 12345,
        staff_id: 3,
        bar_manager: true
      });

      expect(wrapper.state('isCurrentStaff')).toEqual(true);
      expect(wrapper.state('tabs')).toEqual([
        'Schedule',
        'Unscheduled Events',
        'Submit Availability',
        'Add Event',
        'Add New Staff'
      ]);
      expect(wrapper.state('admin')).toEqual(true);
      expect(wrapper.state('currentUserId')).toEqual(3);
    });

    it('should set state with correct values when not authorized', () => {
      wrapper.instance().checkAuthorization();

      expect(wrapper.state('addNewStaff')).toEqual(true);
      expect(wrapper.state('tabs')).toEqual(['Schedule', 'Add New Staff']);
    });
  });

  it('should add Staff', () => {
    wrapper.instance().addStaff();
    expect(wrapper.state('isCurrentStaff')).toEqual(true);
    expect(wrapper.state('addNewStaff')).toEqual(false);
  });

  describe('deleteFromSchedule', () => {
    it('fetch should be called with correct params', async () => {
      window.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          status: 200
            })
      );
      const expected = [
        'http://localhost:3000/api/v1/schedule/34',
        {
          method: 'DELETE'
        }
      ];
      const person = { event_id: 2, schedule_id: 34 };
      wrapper.instance().deleteFromSchedule(person);

      expect(window.fetch).toHaveBeenCalledWith(...expected);
    });

  it('should set the state with new schedule', async () => {
    window.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
          status: 200
          })
    );
      const mockSchedule = [
        { event_id: 2, staff: [{ schedule_id: 34 }] },
        { event_id: 1, staff: [{ schedule_id: 23 }] }
      ];

      const expected = [
        { event_id: 2, staff: [] },
        { event_id: 1, staff: [{ schedule_id: 23 }] }
      ];

      wrapper.setState({ schedule: mockSchedule });

      await wrapper
        .instance()
        .deleteFromSchedule({ event_id: 2, schedule_id: 34 });

      expect(wrapper.state('schedule')).toEqual(expected);
    });
  });

  describe('editSchedule', () => {
    it('should edit the schedule', async () => {
      /////////
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
      const mockStaff = { name: 'taco' };
      const mockEvent = { event: 'idone' };
      const mockSchedule = { schedule: ['test'], unscheduledEvents: ['test1'] };

      wrapper.instance().api.getStaff = jest.fn().mockReturnValue(mockStaff);
      wrapper.instance().api.getEvents = jest.fn().mockReturnValue(mockEvent);
      wrapper.instance().getSchedule = jest.fn().mockReturnValue(mockSchedule);

      await wrapper.instance().updateStateFromHelpers();

      expect(wrapper.instance().api.getStaff).toHaveBeenCalled();
      expect(wrapper.instance().api.getEvents).toHaveBeenCalled();
      expect(wrapper.instance().getSchedule).toHaveBeenCalledWith(
        mockStaff,
        mockEvent
      );

      expect(wrapper.state()).toEqual({
        addNewStaff: false,
        admin: false,
        currentUserId: null,
        events: { event: 'idone' },
        isCurrentStaff: false,
        schedule: ['test'],
        staff: { name: 'taco' },
        tabs: [],
        unscheduledEvents: ['test1'],
        user: null
      });
    });
  });

  it('should call updateStateFromHelpers in componentDidMount', () => {
    wrapper.instance().updateStateFromHelpers = jest.fn();

    wrapper.instance().componentDidMount();

    expect(wrapper.instance().updateStateFromHelpers).toHaveBeenCalled();
  });
});
