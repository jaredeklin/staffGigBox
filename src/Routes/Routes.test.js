import React from 'react';
import { shallow } from 'enzyme';
import { Routes } from './Routes';

describe('Routes', () => {
  it('should match the snapshot', () => {
    const mockUser = {
      staff_id: 1,
      google_id: '34567G'
    };
    const wrapper = shallow(<Routes currentUser={mockUser} />);
    expect(wrapper).toMatchSnapshot();
  });
});
