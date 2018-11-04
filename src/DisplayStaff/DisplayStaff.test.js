import React from 'react';
import { shallow } from 'enzyme';
import DisplayStaff from './DisplayStaff';

describe('DisplayStaff', () => {
  let wrapper;
  const mockEvent = { staff: [{ role: 'Bar Manager', staff_events_id: 34 }] };
  const mockDeleteSchedule = jest.fn();
  const mockHandleEditClick = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <DisplayStaff
        event={mockEvent}
        staffRole="Bar Manager"
        deleteFromSchedule={mockDeleteSchedule}
        handleEditClick={mockHandleEditClick}
        admin={true}
      />
    );
  });

  it('should match the snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should match the snapshot when the staffRole is Bartender', () => {
    wrapper = shallow(<DisplayStaff event={mockEvent} staffRole="Bartender" />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('click events', () => {
    it('should call deleteFromSchedule with correct params when clicked', () => {
      const expected = mockEvent.staff[0].staff_events_id;

      wrapper.find('.delete').simulate('click');
      expect(mockDeleteSchedule).toHaveBeenCalledWith(expected);
    });

    it('should call handleEditClick with correct params when clicked', () => {
      const expected = mockEvent.staff[0];

      wrapper.find('.edit').simulate('click');
      expect(mockHandleEditClick).toHaveBeenCalledWith(expected);
    });
  });
});
