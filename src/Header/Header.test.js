import React from 'react';
import { shallow } from 'enzyme';
import Header from './Header';

describe('Header', () => {
  it('should match the snapshot', () => {
    const mockLocation = { pathname: '/schedule' };
    const wrapper = shallow(<Header location={mockLocation} />);

    expect(wrapper).toMatchSnapshot();
  });
});
