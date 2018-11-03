import React from 'react';
import { shallow } from 'enzyme';
import { EditStaffDropdown } from './EditStaffDropdown';

describe('EditStaffDropdown', () => {
  let wrapper;
  let mockStaff = [{ id: 2, name: 'Jared' }];
  let mockEventID = 1;
  let mockUpdateEventStaff = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <EditStaffDropdown
        staff={mockStaff}
        event_id={mockEventID}
        updateEventStaff={mockUpdateEventStaff}
      />
    );
  });

  it('should match the snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('handleChange should update state and call updateEventStaff', async () => {
    const mockEvent = { target: { value: 'oh yeah' } };

    await wrapper.instance().handleChange(mockEvent);

    expect(wrapper.state('staff_id')).toEqual('oh yeah');
    expect(mockUpdateEventStaff).toHaveBeenCalledWith(wrapper.state());
  });
});
