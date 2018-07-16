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
        scheduleGenerator={mockScheduleGenerator} />);
  });

  it('should match the snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should update state on handleChange', () => {
    const mockEvent = {
      target: {
        name: 'time',
        value: '7 pm'
      }
    };

    wrapper.instance().handleChange(mockEvent);

    expect(wrapper.state('time')).toEqual('7 pm');
  });

  it('should post event on handle Submit', async () => {

    const mockEvent = {
      preventDefault: jest.fn()
    };

    const mockEventObj = {
      venue: 'Ogden Theatre',
      name: '',
      date: 'Jun 6, 2018',
      time: '6:00 pm',
      bar_manager: '',
      ass_bar_manager: '',
      bartenders: '',
      barbacks: '',
      beer_bucket: ''
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

    window.fetch = jest.fn(() => Promise.resolve({
      status: 201,
      json: () => Promise.resolve({})
    }));

    const date = { date: 'Jun 6, 2018', time: '6:00 pm' };

    wrapper.setState({ manualSchedule: true });
    wrapper.instance().api.postSchedule = jest.fn();
    wrapper.instance().api.buildScheduleWithRoles = jest.fn();
    wrapper.instance().api.getSchedule = jest.fn();
    wrapper.instance().api.cleanDateTime = jest.fn().mockReturnValue(date);

    await wrapper.instance().handleSubmit(mockEvent);
    expect(window.fetch).toHaveBeenCalledWith(...expected);

    expect(wrapper.instance().api.cleanDateTime).toHaveBeenCalled();
    expect(wrapper.instance().api.buildScheduleWithRoles).toHaveBeenCalled();
    expect(wrapper.instance().api.postSchedule).toHaveBeenCalled();
    expect(wrapper.instance().api.getSchedule).toHaveBeenCalled();   
    expect(mockCheck).toHaveBeenCalled();
    expect(wrapper.state()).toEqual(mockDefaultState);

    await wrapper.instance().handleSubmit(mockEvent)
    expect(mockScheduleGenerator).toHaveBeenCalled()
  });
});
