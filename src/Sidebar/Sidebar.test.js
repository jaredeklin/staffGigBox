import React from 'react';
import { shallow } from 'enzyme';
import { Sidebar } from './Sidebar';
import { auth } from '../firebase.js';

describe('Sidebar', () => {
  let wrapper;
  const mockAddUser = jest.fn();
  const mockUserInfo = { displayName: 'taco', uid: 12345, photoURL: 'url' };

  beforeEach(() => {
    wrapper = shallow(<Sidebar addUser={mockAddUser} />, {
      disableLifecycleMethods: true
    });
  });

  it('should match the snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should login a user', async () => {
    auth.signInWithPopup = jest.fn().mockReturnValue({ user: mockUserInfo });

    await wrapper.instance().login();

    expect(auth.signInWithPopup).toHaveBeenCalled();
    expect(mockAddUser).toHaveBeenCalledWith(mockUserInfo.uid);
    expect(wrapper.state('user')).toEqual(mockUserInfo);
  });

  it('should logout a user', async () => {
    auth.signOut = jest.fn();

    await wrapper.instance().logout();

    expect(wrapper.state('user')).toEqual(null);
    expect(mockAddUser).toHaveBeenCalledWith(null);
  });

  describe('componentDidMount', () => {
    it('should call auth.onAuthStateChanged', async () => {
      auth.onAuthStateChanged = jest.fn();

      await wrapper.instance().componentDidMount();
      expect(auth.onAuthStateChanged).toHaveBeenCalled();
    });
  });
});
