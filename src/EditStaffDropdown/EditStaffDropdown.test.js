import React from 'react';
import { shallow } from 'enzyme';
import { EditStaffDropdown } from './EditStaffDropdown';

describe('EditStaffDropdown', () => {
  let wrapper;
  let mockStaff = [{ id: 2, name: 'Jared' }];
  let mockEvent = { event_id: 1, date: '2018-06-06' };
  let mockUpdateEventStaff = jest.fn();
  const mockCurrentPerson = { name: 'Jared', role: 'Bartender' };
  const mockCloseModal = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <EditStaffDropdown
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

  it('handleChange should update state and call updateEventStaff', () => {
    const mockEvent = { target: { value: 'oh yeah' } };

    wrapper.instance().handleChange(mockEvent);

    expect(wrapper.state('staff_id')).toEqual('oh yeah');
  });
});
