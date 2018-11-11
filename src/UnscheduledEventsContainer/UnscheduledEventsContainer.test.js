import React from 'react';
import { shallow } from 'enzyme';
import UnscheduledEventsContainer from './UnscheduledEventsContainer';
import { mockUnscheduledEvents } from '../mockData';

describe('UnscheduledEventsContainer', () => {
  it('should match the snapshot', () => {
    const wrapper = shallow(
      <UnscheduledEventsContainer unscheduledEvents={mockUnscheduledEvents} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should match the snapshot when there are no unscheduled events', () => {
    const wrapper = shallow(
      <UnscheduledEventsContainer unscheduledEvents={[]} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
