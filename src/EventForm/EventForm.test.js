import React from 'react';
import { shallow } from 'enzyme';
import { EventForm } from './EventForm';
import { mockBuildRolesReturn, mockPostScheduleReturn } from '../mockData';

describe('EventForm', () => {
  let wrapper;
  const mockAddEvent = jest.fn();
  const mockState = {
    venue: 'Ogden Theatre',
    name: 'Ratatat',
    date: '2018-06-30',
    time: '18:00',
    bar_manager: true,
    ass_bar_manager: true,
    bartenders: 4,
    barbacks: 2,
    beer_bucket: false
  };

  beforeEach(() => {
    wrapper = shallow(<EventForm addEvent={mockAddEvent} />);
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

  describe('handleSubmit', () => {
    jest.useFakeTimers();

    const mockEvent = {
      preventDefault: jest.fn()
    };
    let expectedState;
    let mockPostReturn;
    let mockPostEvent;
    let mockBuildSchedule;
    let mockPostSchedule;

    beforeEach(() => {
      expectedState = { ...mockState, time: '6:00 pm' };
      mockPostReturn = { ...expectedState, event_id: 24 };

      wrapper.setState(mockState);
      mockPostEvent = wrapper.instance().api.postEvent = jest.fn(
        () => mockPostReturn
      );
      mockBuildSchedule = wrapper.instance().api.buildScheduleWithRoles = jest.fn(
        () => mockBuildRolesReturn
      );
      mockPostSchedule = wrapper.instance().api.postSchedule = jest.fn(
        () => mockPostScheduleReturn
      );
    });

    it('should call all methods with correct params', async () => {
      await wrapper.instance().handleSubmit(mockEvent);

      expect(mockPostEvent).toHaveBeenCalledWith(expectedState);
      expect(mockBuildSchedule).toHaveBeenCalledWith(mockPostReturn);
      expect(mockPostSchedule).toHaveBeenCalledWith(mockBuildRolesReturn);
      expect(mockAddEvent).toHaveBeenCalledWith(
        mockPostReturn,
        mockPostScheduleReturn
      );

      expect(wrapper.state()).toEqual({ ...mockState, showMessage: true });
    });

    it('should call setTimeout and setState after 2 seconds', async () => {
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
        showMessage: false
      };

      await wrapper.instance().handleSubmit(mockEvent);

      jest.runAllTimers();
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 2000);
      expect(wrapper.state()).toEqual(mockDefaultState);
    });
  });
});
