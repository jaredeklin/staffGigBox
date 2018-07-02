/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';
import { Availability } from './Availability';

describe('Availability', () => {
  let wrapper;
  let mockCurrentUserId = 1;

  beforeEach( () => {
    wrapper = shallow(<Availability currentUserId={ mockCurrentUserId } />, 
    	{ disableLifecycleMethods: true });
    wrapper.setState({ selectedDays: [new Date('June 30, 2018')] });
  });

  // it('should match the snapshot', () => {
  //   expect(wrapper).toMatchSnapshot();
  // });

  describe('handleSubmit', () => {

  	it('should call cleanDate, getAvailability, postAvailability', () => {
  		wrapper.instance().api.cleanDate = jest.fn().mockReturnValue('June 30, 2018');
  		wrapper.instance().api.getAvailability = jest.fn().mockReturnValue(false);
  		wrapper.instance().api.postAvailability = jest.fn();

  		// expect(wrapper.state()).toEqual()

  		wrapper.instance().handleSubmit();

  		expect(wrapper.instance().api.cleanDate).toHaveBeenCalled();
  		expect(wrapper.instance().api.getAvailability).toHaveBeenCalledWith(1, "June 30, 2018");
  		// expect(wrapper.instance().api.postAvailability).toHaveBeenCalledWith();

  	});

  });
});