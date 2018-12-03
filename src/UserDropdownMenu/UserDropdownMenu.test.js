import React from 'react';
import { shallow } from 'enzyme';
import UserDropdownMenu from './UserDropdownMenu';

describe('UserDropdownMenu', () => {
  let wrapper;
  let mockHandleDropdown = jest.fn();
  let mockLogout = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <UserDropdownMenu
        handleDropdown={mockHandleDropdown}
        logout={mockLogout}
      />
    );
  });

  it('should match the snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('handleClick', () => {
    it('should close the dropdown when clicked outside container', () => {
      const mockEvent = { target: { parentNode: { className: 'app' } } };

      wrapper.instance().handleClick(mockEvent);
      expect(mockHandleDropdown).toHaveBeenCalled();
    });

    it('should do nothing when clicked in the dropdown container', () => {
      const mockEvent = {
        target: { parentNode: { className: 'dropdown-content' } }
      };

      expect(wrapper.instance().handleClick(mockEvent)).toEqual(null);
    });
  });

  describe('componentWillUnmount', () => {
    it('should remove the event listener', () => {
      document.removeEventListener = jest.fn();

      wrapper.instance().componentWillUnmount();
      expect(document.removeEventListener).toHaveBeenCalled();
    });
  });
});
