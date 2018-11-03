import React from 'react';
import { shallow } from 'enzyme';
import { EventForm } from './EventForm';

describe('EventForm', () => {
  let wrapper;
  const mockCheck = jest.fn();
  const mockScheduleGenerator = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <EventForm
        checkManualSchedule={mockCheck}
        scheduleGenerator={mockScheduleGenerator}
      />
    );
  });

  it('should match the snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should update state on handleChange', () => {
    const mockEvent = { target: { name: 'time', value: '19:00' } };
    const mockEvent2 = { target: { name: 'date', value: '2018-06-06' } };

    wrapper.instance().handleChange(mockEvent);
    expect(wrapper.state('time')).toEqual('19:00');

    wrapper.instance().handleChange(mockEvent2);
    expect(wrapper.state('date')).toEqual('2018-06-06');
  });

  it('should post event on handle Submit', async () => {
    const mockEvent = {
      preventDefault: jest.fn()
    };

    const mockDefaultState = {
      venue: 'Ogden Theatre',
      name: '',
      date: '',
      time: '18:00',
      bar_manager: '',
      ass_bar_manager: '',
      bartenders: '',
      barbacks: '',
      beer_bucket: '',
      manualSchedule: ''
    };

    const mockEventObj = {
      ...mockDefaultState,
      date: 'Jun 6, 2018',
      time: '6:00 pm'
    };
    delete mockEventObj.manualSchedule;

    const expected = [
      'http://localhost:3000/api/v1/events',
      {
        method: 'POST',
        body: JSON.stringify(mockEventObj),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ];

    window.fetch = jest.fn(() =>
      Promise.resolve({
        status: 201,
        json: () => Promise.resolve({})
      })
    );

    wrapper.setState({
      manualSchedule: true,
      date: '2018-06-06',
      time: '18:00'
    });
    wrapper.instance().api.postSchedule = jest.fn();
    wrapper.instance().api.buildScheduleWithRoles = jest.fn();
    wrapper.instance().api.getSchedule = jest.fn();

    await wrapper.instance().handleSubmit(mockEvent);
    expect(window.fetch).toHaveBeenCalledWith(...expected);

    expect(wrapper.instance().api.buildScheduleWithRoles).toHaveBeenCalled();
    expect(wrapper.instance().api.postSchedule).toHaveBeenCalled();
    expect(wrapper.instance().api.getSchedule).toHaveBeenCalled();
    expect(mockCheck).toHaveBeenCalled();
    expect(wrapper.state()).toEqual(mockDefaultState);

    await wrapper.instance().handleSubmit(mockEvent);
    expect(mockScheduleGenerator).toHaveBeenCalled();
  });
});
