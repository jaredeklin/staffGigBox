import React from 'react';
import { shallow } from 'enzyme';
import Header from './Header';
import { Api } from '../Api/Api';

describe('Header', () => {
  const api = new Api();
  it('should match the snapshot', () => {
    const mockLocation = { pathname: '/schedule' };
    api.getHeaderText = jest.fn(() => 'Schedule');

    const wrapper = shallow(<Header location={mockLocation} />);

    expect(wrapper).toMatchSnapshot();
  });
});
