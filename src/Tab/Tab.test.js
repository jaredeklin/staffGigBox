import React from 'react';
import { shallow } from 'enzyme';
import { Tab } from './Tab';

describe('Tab', () => {
  let wrapper;
  const mockHandleTabClick = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <Tab
        handleTabClick={mockHandleTabClick}
        isActive={true}
        tabName="Schedule"
      />
    );
  });

  it('should match the snapshot when isActive is true', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should match the snapshot when isActive is false', () => {
    wrapper = shallow(
      <Tab
        handleTabClick={mockHandleTabClick}
        isActive={false}
        tabName="Schedule"
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should call handleTabClick with correct params when clicked', () => {
    wrapper.find('li').simulate('click');
    expect(mockHandleTabClick).toHaveBeenCalledWith('Schedule');
  });
});
