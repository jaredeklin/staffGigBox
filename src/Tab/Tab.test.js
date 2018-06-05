import React from 'react';
import { shallow } from 'enzyme';
import { Tab } from './Tab';

describe('Tab', () => {
  it('should match the snapshot', () => {
    const wrapper = shallow(<Tab />)
    expect(wrapper).toMatchSnapshot();
  })
})
