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
      wrapper.instance().api.postAvailability = jest.fn();
      wrapper.instance().api.deleteAvailability = jest.fn();

      wrapper.instance().handleSubmit();

      expect(wrapper.instance().api.postAvailability).toHaveBeenCalledWith(2, [
        '2018-06-30'
      ]);
    });

    it('should call deleteAvailability with correct params', async () => {
      wrapper.setState({
        originalDays: ['Fri Jun 29 2018 12:00:00 GMT-0700'],
        selectedDays: []
      });

      wrapper.instance().api.postAvailability = jest.fn();
      wrapper.instance().api.deleteAvailability = jest.fn();

      await wrapper.instance().handleSubmit();
      expect(wrapper.instance().api.deleteAvailability).toHaveBeenCalledWith(
        2,
        ['2018-06-29']
      );
    });
  });

  describe('cleanDate', () => {
    it('should return a parsed date', () => {
      const mockDay = ['Fri Jun 30 2018 12:00:00 GMT-0700'];
      const expected = ['2018-06-30'];

      expect(wrapper.instance().cleanDate(mockDay)).toEqual(expected);
    });
  });

  describe('componentDidMount', () => {
    const mockDate = [{ date_unavailable: '2018-06-30' }];

    it('should call getAvailability with correct params', () => {
      wrapper.instance().api.getAvailability = jest
        .fn()
        .mockReturnValue(mockDate);
      wrapper.instance().componentDidMount();

      expect(wrapper.instance().api.getAvailability).toHaveBeenCalledWith(
        mockCurrentUserId,
        null,
        true
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
});
