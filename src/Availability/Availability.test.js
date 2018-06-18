import React from 'react';
import { shallow } from 'enzyme';
import { Availability } from './Availability';

describe('Availability', () => {
  it.skip('should match the snapshot', () => {
    const wrapper = shallow(<Availability />);
    expect(wrapper).toMatchSnapshot();
  });
});