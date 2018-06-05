import React from 'react';
import { shallow } from 'enzyme';
import { EditStaffSelect } from './EditStaffSelect';

describe('EditStaffSelect', () => {

  let wrapper;
  let mockStaff = [{ id: 2, name: 'Jared' }]
  let mockEventID = 1
  let mockUpdateEventStaff = jest.fn()

  beforeEach(() => {
    wrapper = shallow(
      <EditStaffSelect 
        staff={ mockStaff }
        event_id={ mockEventID }
        updateEventStaff={ mockUpdateEventStaff }
      />
    )
  })

  it('should match the snapshot' , () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('handleChange should update state and call updateEventStaff', async() => {
    const mockEvent = { target: { value: 'oh yeah' }}

    await wrapper.instance().handleChange(mockEvent)

    expect(wrapper.state('staff_id')).toEqual('oh yeah')
    expect(mockUpdateEventStaff).toHaveBeenCalledWith(wrapper.state())
  })

})