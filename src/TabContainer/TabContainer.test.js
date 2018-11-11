import React from 'react';
import { shallow } from 'enzyme';
import { TabContainer } from './TabContainer';

describe('TabContainer', () => {
  let wrapper;
  let mockEditSchedule = jest.fn();
  let mockTabs = ['Schedule'];
  let mockSchedule = [{ event_id: 1 }];
  let mockScheduleGenerator = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <TabContainer
        editSchedule={mockEditSchedule}
        tabs={mockTabs}
        schedule={mockSchedule}
        scheduleGenerator={mockScheduleGenerator}
        unscheduledEvents={mockSchedule}
      />
    );
  });
  it('should match the snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should match the snapshot with admin tabs', () => {
    const mockAdminTabs = [
      'Add Event',
      'Add New Staff',
      'Schedule',
      'Submit Availability',
      'Unscheduled Events'
    ];

    wrapper = shallow(
      <TabContainer
        editSchedule={mockEditSchedule}
        tabs={mockAdminTabs}
        schedule={mockSchedule}
        unscheduledEvents={mockSchedule}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should match the snapshot when submit Availability is the active tab', () => {
    wrapper.setState({ activeTabName: 'Submit Availability' });
    expect(wrapper).toMatchSnapshot();
  });

  it('should match the snapshot when Add New Staff is the active tab', () => {
    wrapper.setState({ activeTabName: 'Add New Staff' });
    expect(wrapper).toMatchSnapshot();
  });

  it('should match the snapshot when Unscheduled Events is the active tab', () => {
    wrapper.setState({ activeTabName: 'Unscheduled Events' });
    expect(wrapper).toMatchSnapshot();
  });

  it('should set state when handleTabClick is called', () => {
    wrapper.instance().handleTabClick('Add Event');
    expect(wrapper.state('activeTabName')).toEqual('Add Event');
  });
});
