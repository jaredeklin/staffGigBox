import React from 'react';
import { shallow } from 'enzyme';
import { TabContainer } from './TabContainer';

describe('TabContainer', () => {

  let wrapper;
  let mockEditSchedule = jest.fn()
  let mockTabs = ['schedule']
  let mockSchedule = [{ event_id: 1 }]

  beforeEach(() => {
    wrapper = shallow(
      <TabContainer 
        editSchedule={ mockEditSchedule } 
        tabs={ mockTabs }
        schedule={ mockSchedule }
      />);

  })
  it('should match the snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  })
})
