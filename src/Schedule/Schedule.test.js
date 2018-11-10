import React from 'react';
import { shallow } from 'enzyme';
import { Schedule } from './Schedule';

describe('Schedule', () => {
  let wrapper;
  let mockEditSchedule = jest.fn();
  let mockStaffList = [];
  let mockEvent = {
    venue: 'Ogden',
    name: 'Ratatat',
    date: '2018-06-30',
    time: '7 pm',
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

  beforeEach(() => {
    wrapper = shallow(
      <Schedule
        editSchedule={mockEditSchedule}
        staffList={mockStaffList}
        event={mockEvent}
        deleteFromSchedule={mockDeleteFromSchedule}
        admin={mockAdmin}
        updateSchedule={mockUpdateSchedule}
      />
    );
  });

  it('should match the snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should match the snapshot when admin is true', () => {
    wrapper = shallow(
      <Schedule
        editSchedule={mockEditSchedule}
        staffList={mockStaffList}
        event={mockEvent}
        deleteFromSchedule={mockDeleteFromSchedule}
        admin={true}
        updateSchedule={mockUpdateSchedule}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should match the snapshot when Ass man is needed', () => {
    let mockEvent1 = { ...mockEvent, ass_bar_manager: true };

    wrapper = shallow(
      <Schedule
        editSchedule={mockEditSchedule}
        staffList={mockStaffList}
        event={mockEvent1}
        deleteFromSchedule={mockDeleteFromSchedule}
        admin={true}
        updateSchedule={mockUpdateSchedule}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe('updateEventStaff', () => {
    it('should call modifySchedule and editSchedule, update state', async () => {
      const mockObj = {
        staff_id: 3,
        event_id: 3
      };

      const mockCallObj = { ...mockObj, schedule_id: 12 };
      const mockReturn = [{ ...mockCallObj, role: 'Bartender' }];

      wrapper.instance().api.modifySchedule = jest
        .fn()
        .mockReturnValue(mockReturn);
      wrapper.setState({ schedule_id: 12, edit: true });

      await wrapper.instance().updateEventStaff(mockObj);

      expect(wrapper.instance().api.modifySchedule).toHaveBeenCalledWith([
        mockCallObj
      ]);
      expect(mockEditSchedule).toHaveBeenCalled();
      expect(wrapper.state('edit')).toEqual(false);
    });
  });

  describe('handleEditClick', () => {
    it('should update state', () => {
      const mockPerson = { schedule_id: 12 };

      wrapper.instance().handleEditClick(mockPerson);
      expect(wrapper.state('edit')).toEqual(true);
      expect(wrapper.state('schedule_id')).toEqual(12);
    });
  });

  describe('closeModal', () => {
    it('should set the edit state value to false', () => {
      wrapper.setState({ edit: true });
      wrapper.instance().closeModal();
      expect(wrapper.state('edit')).toEqual(false);
    });
  });
});
