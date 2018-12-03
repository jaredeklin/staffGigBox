import React from 'react';
import { shallow } from 'enzyme';
import ScheduleContainer from './ScheduleContainer';
import { mockFEScheduleData } from '../mockData';

describe('ScheduleContainer', () => {
  const mockSchedule = [{ ...mockFEScheduleData[0], venue: 'Ogden Theatre' }];
  const mockUnscheduledEvents = [];
  const mockCurrentUser = { staff_id: 3 };
  const mockApi = { getIndividualSchedules: jest.fn(() => mockSchedule) };
  const mockEditSchedule = jest.fn();
  const mockStaff = [];
  const mockDeleteFromSchedule = jest.fn();
  const mockAdmin = true;

  it('should match the snapshot', () => {
    const wrapper = shallow(
      <ScheduleContainer
        schedule={mockSchedule}
        unscheduledEvents={mockUnscheduledEvents}
        location={{ pathname: '/schedule/ogden' }}
        currentUser={mockCurrentUser}
        api={mockApi}
        editSchedule={mockEditSchedule}
        deleteFromSchedule={mockDeleteFromSchedule}
        staff={mockStaff}
        admin={mockAdmin}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  xit('should match the snapshot when there are no unscheduled events', () => {
    const mockLocation = { pathname: '/unscheduled-events' };
    const wrapper = shallow(
      <ScheduleContainer
        schedule={mockSchedule}
        unscheduledEvents={mockUnscheduledEvents}
        location={mockLocation}
        currentUser={mockCurrentUser}
        api={mockApi}
        editSchedule={mockEditSchedule}
        deleteFromSchedule={mockDeleteFromSchedule}
        staff={mockStaff}
        admin={mockAdmin}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
