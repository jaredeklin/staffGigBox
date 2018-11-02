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
      'Submit Availability'
    ];

    wrapper = shallow(
      <TabContainer
        editSchedule={mockEditSchedule}
        tabs={mockAdminTabs}
        schedule={mockSchedule}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should match the snapshot when submit Availability is the active tab', () => { //eslint-disable-line
    wrapper.setState({ activeTabName: 'Submit Availability' });
    expect(wrapper).toMatchSnapshot();
  });

  it('should match the snapshot when Add New Staff is the active tab', () => {
    wrapper.setState({ activeTabName: 'Add New Staff' });
    expect(wrapper).toMatchSnapshot();
  });

  it('should set state when handleTabClick is called', () => {
    wrapper.instance().handleTabClick('Add Event');
    expect(wrapper.state('activeTabName')).toEqual('Add Event');
  });

  it('checkManualSchedule should update state and call scheduleGenerator', () => { //eslint-disable-line
    const mockManualSchedule = false;
    const mockEventData = { event_id: 2 };

    wrapper.instance().checkManualSchedule(mockEventData, mockManualSchedule);

    expect(wrapper.state('manualSchedule')).toEqual(false);
    expect(mockScheduleGenerator).toHaveBeenCalled();
  });

  it('updateSchedule should call getSchedule and update state', async () => {
    wrapper.instance().api.getSchedule = jest
      .fn()
      .mockReturnValue({ event_id: 2 });

    await wrapper.instance().updateSchedule(1);

    expect(wrapper.instance().api.getSchedule).toHaveBeenCalledWith(1);
    expect(wrapper.state('manualScheduleData')).toEqual({ event_id: 2 });
  });
});
