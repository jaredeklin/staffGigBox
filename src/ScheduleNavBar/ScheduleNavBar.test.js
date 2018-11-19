import React from 'react';
import { shallow } from 'enzyme';
import ScheduleNavBar from './ScheduleNavBar';

describe('ScheduleNavBar', () => {
  it('should match the snapshot', () => {
    const wrapper = shallow(<ScheduleNavBar />);

    expect(wrapper).toMatchSnapshot();
  });
});
