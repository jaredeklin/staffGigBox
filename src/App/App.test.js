import React from 'react';
import App from './App';
import { shallow } from 'enzyme';

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
      wrapper.instance().checkAuthorization({ google_id: 12345, id: 3 });

      expect(wrapper.state('isCurrentStaff')).toEqual(true);
      expect(wrapper.state('tabs')).toEqual([
        'Schedule',
        'Submit Availability'
      ]);
      expect(wrapper.state('admin')).toEqual(false);
      expect(wrapper.state('currentUserId')).toEqual(3);

      wrapper
        .instance()
        .checkAuthorization({ google_id: 12345, id: 3, bar_manager: true });

      expect(wrapper.state('isCurrentStaff')).toEqual(true);
      expect(wrapper.state('tabs')).toEqual([
        'Schedule',
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

  it('should delete userId and event Id from schedule', async () => {
    window.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            mockUser1
          })
      })
    );
    const expected = [
      'http://localhost:3000/api/v1/schedule/1',
      {
        method: 'DELETE'
      }
    ];

    wrapper.instance().api.getSchedule = jest.fn();

    await wrapper.instance().deleteFromSchedule(1);

    expect(window.fetch).toHaveBeenCalledWith(...expected);
  });

  it('should set the state with new schedule', async () => {
    window.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            mockUser1
          })
      })
    );
    wrapper.instance().editSchedule = jest.fn();

    await wrapper.instance().deleteFromSchedule(1);

    expect(wrapper.instance().editSchedule).toHaveBeenCalled();
  });

  it('should edit the schedule', async () => {
    const mockSchedule = {
      event_id: 1,
      date: '05/16/18',
      name: 'Sparklehorse'
    };

    wrapper.instance().api.getSchedule = jest
      .fn()
      .mockReturnValue(mockSchedule);

    await wrapper.instance().editSchedule();

    expect(wrapper.state('schedule')).toEqual(mockSchedule);
  });

  it('should generate a schedule', async () => {
    wrapper.instance().api.generateSchedule = jest.fn().mockReturnValue(true);
    wrapper.instance().api.modifySchedule = jest.fn();
    wrapper.instance().editSchedule = jest.fn();

    await wrapper.instance().scheduleGenerator();

    expect(wrapper.instance().api.generateSchedule).toHaveBeenCalled();
    expect(wrapper.instance().api.modifySchedule).toHaveBeenCalled();
    expect(wrapper.instance().editSchedule).toHaveBeenCalled();
  });

  it('should update the state with helpers', async () => {
    const mockStaff = { name: 'taco' };
    const mockEvent = { event: 'idone' };
    const mockSchedule = { schedule: 'thebesten' };

    wrapper.instance().api.getStaff = jest.fn().mockReturnValue(mockStaff);
    wrapper.instance().api.getEvents = jest.fn().mockReturnValue(mockEvent);
    wrapper.instance().api.getSchedule = jest
      .fn()
      .mockReturnValue(mockSchedule);

    await wrapper.instance().updateStateFromHelpers();

    expect(wrapper.instance().api.getStaff).toHaveBeenCalled();
    expect(wrapper.instance().api.getEvents).toHaveBeenCalled();
    expect(wrapper.instance().api.getSchedule).toHaveBeenCalled();

    expect(wrapper.state()).toEqual({
      addNewStaff: false,
      admin: false,
      tabs: [],
      events: { event: 'idone' },
      isCurrentStaff: false,
      schedule: { schedule: 'thebesten' },
      staff: { name: 'taco' },
      user: null,
      currentUserId: null
    });
  });

  it('should call updateStateFromHelpers in componentDidMount', () => {
    wrapper.instance().updateStateFromHelpers = jest.fn();

    wrapper.instance().componentDidMount();

    expect(wrapper.instance().updateStateFromHelpers).toHaveBeenCalled();
  });
});
