/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';
import { Availability } from './Availability';

describe('Availability', () => {
  let wrapper;
  let mockCurrentUserId = 2;

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
  	
  		wrapper.instance().handleSubmit();

  		expect(wrapper.instance().api.cleanDate).toHaveBeenCalledWith(new Date('June 30, 2018'));
  		expect(wrapper.instance().api.getAvailability).toHaveBeenCalledWith(2, "June 30, 2018");
  		// expect(wrapper.instance().api.postAvailability).toHaveBeenCalled();
  	});
  });

  describe('componentDidMount', () => {

  	const mockDate = [{ date_unavailable: 'June 30, 2018'}]

  	it('should call getAvailability', () => {
  		wrapper.instance().api.getAvailability = jest.fn().mockReturnValue(mockDate);
  		wrapper.instance().componentDidMount();

  		expect(wrapper.instance().api.getAvailability).toHaveBeenCalledWith(mockCurrentUserId)
   	})

  	it('should setState with selectedDays', () => {
  		wrapper.instance().api.getAvailability = jest.fn().mockReturnValue(mockDate);
  		wrapper.instance().componentDidMount();

  		expect(wrapper.state('selectedDays')).toEqual([ new Date('June 30, 2018') ])
  	})
  })

  // describe('handleDayClick', () => {

  // 	it('should setState for selectedDays', () => {

  // 		wrapper.instance().handleDayClick()
  // 		expect(wrapper.state()).toEqual()
  // 	})
  // })
});