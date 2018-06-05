import React from 'react';
import { shallow } from 'enzyme';
import { Header } from './Header';
import { auth, provider } from '../firebase.js';

describe('Header', () => {
  let wrapper;
  const mockAddUser = jest.fn();

  beforeEach(() => {
    wrapper = shallow(<Header addUser={mockAddUser} />);
  });

  it('should match the snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should login a user', async () => {
    const result = {
      user: 'taco'
    };
    auth.signInWithPopup = jest.fn().mockReturnValue(result);

    await wrapper.instance().login();

    expect(auth.signInWithPopup).toHaveBeenCalled();
    expect(wrapper.state('user')).toEqual('taco');
    expect(mockAddUser).toHaveBeenCalled();
  });

  it('should logout a user', async () => {
    auth.signOut = jest.fn();

    await wrapper.instance().logout();

    expect(wrapper.state('user')).toEqual(null);
    expect(mockAddUser).toHaveBeenCalled();
  });
});
