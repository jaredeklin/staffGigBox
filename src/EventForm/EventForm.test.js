import React from 'react';
import { shallow } from 'enzyme';
import { Api } from '../Api/Api';
import { EventForm } from './EventForm';

describe('EventForm', () => {
  let wrapper;
  let api;
  let mockCheck = jest.fn();

  beforeEach(() => {
    api = new Api();
    wrapper = shallow(<EventForm checkManualSchedule={mockCheck}/>)
  });

  it('should match the snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should update state on handleChange', () => {
    const mockEvent = {
      target: {
        name: 'time',
        value: '7 pm'
      }
    }

    wrapper.instance().handleChange(mockEvent);

    expect(wrapper.state('time')).toEqual('7 pm')
  });

  it('should post event on handle Submit', async () => {
    const mockEvent = {
      preventDefault: jest.fn()
    }

    const mockEventObj = {
      venue: 'Ogden Theatre',
      name: '',
      date: '',
      time: '',
      bar_manager: '',
      ass_bar_manager: '',
      bartenders: '',
      barbacks: '',
      beer_bucket: ''
    }

    const mockDefaultState = {
      venue: 'Ogden Theatre',
      name: '',
      date: '',
      time: '',
      bar_manager: '',
      ass_bar_manager: '',
      bartenders: '',
      barbacks: '',
      beer_bucket: '',
      manualSchedule: ''
    }

    const expected = [
      'http://localhost:3000/api/v1/events',
      {
        method: 'POST',
        body: JSON.stringify(mockEventObj),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ]

    window.fetch = jest.fn(
      () => Promise.resolve({
        status: 201,
        json: () => Promise.resolve({

        })
      })
    )
    await wrapper.instance().handleSubmit(mockEvent)
    expect(window.fetch).toHaveBeenCalledWith(...expected);
    expect(mockCheck).toHaveBeenCalled();
    expect(wrapper.state()).toEqual(mockDefaultState);
  });
});
