import React from 'react';
import { shallow } from 'enzyme';
import { StaffDropdownContainer } from './StaffDropdownContainer';

describe('StaffDropdownContainer', () => {
  let wrapper;
  let mockStaff = [{ id: 2, name: 'Jared' }];
  let mockEvent = { event_id: 1, date: '2018-06-06' };
  let mockUpdateEventStaff = jest.fn();
  const mockCurrentPerson = { name: 'Jared', role: 'Bartender' };
  const mockCloseModal = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <StaffDropdownContainer
        staff={mockStaff}
        event={mockEvent}
        updateEventStaff={mockUpdateEventStaff}
        currentPerson={mockCurrentPerson}
        closeModal={mockCloseModal}
      />,
      { disableLifecycleMethods: true }
    );
  });

  it('should match the snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('handleChange', () => {
    it('should update state and call updateEventStaff', () => {
      const mockEvent = { target: { value: 'oh yeah' } };

      wrapper.instance().handleChange(mockEvent);

      expect(wrapper.state('staff_id')).toEqual('oh yeah');
    });
  });

  describe('findAvailableStaff', () => {
    it('should update state with correct value', async () => {
      wrapper.instance().api.checkSchedule = jest.fn(() => []);
      wrapper.instance().api.checkAvailability = jest.fn(() => []);

      await wrapper.instance().findAvailableStaff();
      expect(wrapper.instance().api.checkSchedule).toHaveBeenCalledWith(
        mockEvent.date
      );
      expect(wrapper.instance().api.checkAvailability).toHaveBeenCalledWith(
        mockEvent.date
      );

      expect(wrapper.state('availableStaff')).toEqual(mockStaff);
    });
  });

  describe('handleSave', () => {
    it('should call updateEventsrtaff with correct params', () => {
      const expected = { event_id: 1, staff_id: 3 };

      wrapper.setState({ staff_id: 3 });
      wrapper.instance().handleSave();

      expect(mockUpdateEventStaff).toHaveBeenCalledWith(expected);
    });
  });

  describe('componentDidMount', () => {
    it('should call findAvailableStaff', () => {
      wrapper.instance().findAvailableStaff = jest.fn();
      wrapper.instance().componentDidMount();

      expect(wrapper.instance().findAvailableStaff).toHaveBeenCalled();
    });
  });
});
