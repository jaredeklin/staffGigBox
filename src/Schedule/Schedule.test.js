import React from 'react';
import { shallow } from 'enzyme';
import { Schedule } from './Schedule';

describe('Schedule', () => {

  let wrapper;
  let mockEditSchedule = jest.fn();
  let mockStaffList = [];
  let mockEvent = { 
    staff: [
      { role: 'Bartender' }, 
      { role: 'Barback' }, 
      { role: 'Bar Manager' }, 
      { role: 'Assistant Bar Manager' }
    ]
  };
  let mockDeleteFromSchedule = jest.fn();
  let mockAdmin = false;
  let mockUpdateSchedule = jest.fn();
  let mockManualSchedule = false;

  beforeEach(() => {
    wrapper = shallow(
      <Schedule 
        editSchedule={ mockEditSchedule }
        staffList={ mockStaffList }
        event={ mockEvent }
        deleteFromSchedule={ mockDeleteFromSchedule }
        admin={ mockAdmin }
        updateSchedule={ mockUpdateSchedule } 
        manualSchedule={ mockManualSchedule }
      />);
  });

  it('should match the snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should match the snapshot when admin is true', () => {
    wrapper = shallow(
      <Schedule 
        editSchedule={ mockEditSchedule }
        staffList={ mockStaffList }
        event={ mockEvent }
        deleteFromSchedule={ mockDeleteFromSchedule }
        admin={ true }
        updateSchedule={ mockUpdateSchedule } 
        manualSchedule={ mockManualSchedule }
      />);
    expect(wrapper).toMatchSnapshot();
  });

  it('updateEventstaff should update state, call modifySchedule and editSchedule', async () => { //eslint-disable-line

    const mockObj = {
      staff_id: 3,
      event_id: 3
    };

    wrapper.instance().api.modifySchedule = jest.fn();
    wrapper.setState({ staff_event_id: 12, edit: true });

    await wrapper.instance().updateEventStaff(mockObj);
    
    expect(wrapper.instance().api.modifySchedule).toHaveBeenCalled();
    expect(mockEditSchedule).toHaveBeenCalled();
    expect(wrapper.state('edit')).toEqual(false);
  });

  it('updateEventstaff should update state, call modifySchedule and updateSchedule when manualSchedule is true', async () => { //eslint-disable-line

    const mockObj = {
      staff_id: 3,
      event_id: 3
    };

    wrapper.instance().api.modifySchedule = jest.fn();
    wrapper.setState({ staff_event_id: 12, edit: true, manualSchedule: true });

    await wrapper.instance().updateEventStaff(mockObj);
    
    expect(wrapper.instance().api.modifySchedule).toHaveBeenCalled();
    expect(mockUpdateSchedule).toHaveBeenCalled();
    expect(wrapper.state('edit')).toEqual(false);
  });


  it('handleEditClick should update state', () => {
    const mockPerson = { staff_events_id: 12 };

    wrapper.instance().handleEditClick(mockPerson);
    expect(wrapper.state('edit')).toEqual(true);
    expect(wrapper.state('staff_events_id')).toEqual(12);
  });
});