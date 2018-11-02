import React from 'react';
import { shallow } from 'enzyme';
import { StaffForm } from './StaffForm';

describe('StaffForm', () => {
  let wrapper;
  const mockAddStaff = jest.fn();
  const mockUser = {
    uid: 123456
  };

  beforeEach(() => {
    wrapper = shallow(<StaffForm addStaff={mockAddStaff} user={mockUser} />);
  });

  it('should match the snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should update state on handleChange', () => {
    const mockEvent = {
      target: {
        name: 'name',
        value: 'Esteban'
      }
    };

    wrapper.instance().handleChange(mockEvent);

    expect(wrapper.state('name')).toEqual('Esteban');
  });

  it('should post staff on handle Submit', async () => {
    const mockEvent = {
      preventDefault: jest.fn()
    };

    const mockState = {
      google_id: 123456,
      name: '',
      bar_manager: false,
      ass_bar_manager: false,
      bartender: false,
      barback: false,
      beer_bucket: false
    };

    const expected = [
      'http://localhost:3000/api/v1/staff',
      {
        method: 'POST',
        body: JSON.stringify(mockState),
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
    await wrapper.instance().handleSubmit(mockEvent);
    expect(window.fetch).toHaveBeenCalledWith(...expected);
    expect(mockAddStaff).toHaveBeenCalled();
  });
});
