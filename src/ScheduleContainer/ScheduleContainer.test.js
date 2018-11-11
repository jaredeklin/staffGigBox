import React from 'react';
import { shallow } from 'enzyme';
import ScheduleContainer from './ScheduleContainer';
import { mockUnscheduledEvents } from '../mockData';

describe('ScheduleContainer', () => {
  it('should match the snapshot', () => {
    const wrapper = shallow(
      <ScheduleContainer schedule={mockUnscheduledEvents} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should match the snapshot when there are no unscheduled events', () => {
    const wrapper = shallow(
      <ScheduleContainer
        schedule={mockUnscheduledEvents}
        unscheduledEvents={[]}
        type="Unscheduled Events"
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
