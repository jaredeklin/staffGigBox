import React from 'react';
import { shallow } from 'enzyme';
import { Availability } from './Availability';
const moment = require('moment');
const MockDate = require('mockdate');

describe('Availability', () => {
  MockDate.set(moment('2018-06-29T06:00:00.000Z'));
  let wrapper;
  let mockCurrentUserId = 2;
  const mockSelectedDay = 'Fri Jun 30 2018 12:00:00 GMT-0700';

  beforeEach(() => {
    wrapper = shallow(<Availability currentUserId={mockCurrentUserId} />, {
      disableLifecycleMethods: true
    });
    wrapper.setState({ selectedDays: [mockSelectedDay] });
  });

  describe('handleDayClick', () => {
    it('should update state when selected is undefined', () => {
      const mockSelected = { selected: undefined };
      const expected = [mockSelectedDay, mockSelectedDay];
      wrapper.instance().handleDayClick(mockSelectedDay, mockSelected);

      expect(wrapper.state().selectedDays).toEqual(expected);
    });

    it('should update state when selected is true', async () => {
      const mockSelected = { selected: true };
      wrapper.setState({ selectedDays: [new Date()] });
      wrapper
        .instance()
        .handleDayClick(new Date(mockSelectedDay), mockSelected);

      expect(wrapper.state('selectedDays')).toEqual([]);
    });
  });

  describe('handleSubmit', () => {
    it('should call getAvailability with correct params', () => {
      wrapper.instance().api.getAvailability = jest.fn().mockReturnValue(false);
      wrapper.instance().api.postAvailability = jest.fn();
      wrapper.instance().cleanDate = jest.fn(() => 'Jun 30, 2018');

      wrapper.instance().handleSubmit();

      expect(wrapper.instance().cleanDate).toHaveBeenCalledWith(
        mockSelectedDay
      );
      expect(wrapper.instance().api.getAvailability).toHaveBeenCalledWith(
        2,
        'Jun 30, 2018'
      );
    });
  });

  describe('cleanDate', () => {
    it('should return a parsed date', () => {
      const mockDay = 'Fri Jun 30 2018 12:00:00 GMT-0700';
      const expected = 'Jun 30, 2018';

      expect(wrapper.instance().cleanDate(mockDay)).toEqual(expected);
    });
  });

  describe('componentDidMount', () => {
    const mockDate = [{ date_unavailable: 'June 30, 2018' }];

    it('should call getAvailability', () => {
      wrapper.instance().api.getAvailability = jest
        .fn()
        .mockReturnValue(mockDate);
      wrapper.instance().componentDidMount();

      expect(wrapper.instance().api.getAvailability).toHaveBeenCalledWith(
        mockCurrentUserId
      );
    });

    it('should setState with selectedDays', () => {
      wrapper.instance().api.getAvailability = jest
        .fn()
        .mockReturnValue(mockDate);
      wrapper.instance().componentDidMount();

      expect(wrapper.state('selectedDays')).toEqual([mockSelectedDay]);
    });
  });

  describe('handleDayClick', () => {
    it('should setState for selectedDays', () => {
      // wrapper.instance().handleDayClick()
      expect(wrapper.state()).toEqual({
        selectedDays: [mockSelectedDay]
      });
    });
  });
});
