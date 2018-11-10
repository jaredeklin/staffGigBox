import React from 'react';
import { shallow } from 'enzyme';
import DisplayStaffDropdown from './DisplayStaffDropdown';
import { mockStaff } from '../mockData';

describe('DisplayStaffDropdown', () => {
  it('should match the snapshot', () => {
    const mockRole = 'Bar Manager';
    const mockAvailableStaff = mockStaff;
    const mockHandleChange = jest.fn();

    const wrapper = shallow(
      <DisplayStaffDropdown
        staffRole={mockRole}
        availableStaff={mockAvailableStaff}
        handleChange={mockHandleChange}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
