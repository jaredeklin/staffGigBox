import React from 'react';
import { shallow } from 'enzyme';
import { TabContainer } from './TabContainer';

describe('TabContainer', () => {

  let wrapper;
  let mockEditSchedule = jest.fn()

  beforeEach(() => {
    wrapper = shallow(<TabContainer editSchedule={ mockEditSchedule }/>);

  })
  it('should match the snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  })
})
