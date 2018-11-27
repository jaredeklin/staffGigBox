export const mockStaff = [
  {
    staff_id: 5,
    name: 'TK',
    bartender: true,
    barback: false,
    bar_manager: true,
    ass_bar_manager: true,
    beer_bucket: false,
    google_id: '1pLSNLEaSVT7hvRa5q4Vyy37IIN1'
  },
  {
    staff_id: 2,
    name: 'Jared',
    bartender: true,
    barback: false,
    bar_manager: false,
    ass_bar_manager: true,
    beer_bucket: false,
    google_id: '1pLSNLEaSVT7hvRa5q4Vyy37IIN2'
  },
  {
    staff_id: 3,
    name: 'Jesse',
    bartender: true,
    barback: false,
    bar_manager: false,
    ass_bar_manager: false,
    beer_bucket: false,
    google_id: '1pLSNLEaSVT7hvRa5q4Vyy37IIN1'
  },
  {
    staff_id: 4,
    name: 'Ross',
    bartender: false,
    barback: true,
    bar_manager: false,
    ass_bar_manager: false,
    beer_bucket: false,
    google_id: '1pLSNLEaSVT7hvRa5q4Vyy37IIN2'
  }
];

export const expectedStaff = [
  {
    id: 5,
    name: 'TK',
    bartender: true,
    barback: false,
    bar_manager: true,
    ass_bar_manager: true,
    beer_bucket: false,
    google_id: '1pLSNLEaSVT7hvRa5q4Vyy37IIN1'
  }
];

export const expectedStaffRoles = [
  { event_id: 3, role: 'Bar Manager', staff_id: 5 },
  { event_id: 3, role: 'Assistant Bar Manager', staff_id: 2 },
  { event_id: 3, role: 'Bartender', staff_id: 3 },
  { event_id: 3, role: 'Barback', staff_id: 4 }
];

export const mockUnscheduleStaff = [
  { event_id: 3, role: 'Bar Manager', staff_id: null, name: 'Staff Needed' },
  {
    event_id: 3,
    role: 'Assistant Bar Manager',
    staff_id: null,
    name: 'Staff Needed'
  },
  { event_id: 3, role: 'Bartender', staff_id: null, name: 'Staff Needed' },
  { event_id: 3, role: 'Barback', staff_id: null, name: 'Staff Needed' }
];

export const mockEmptySchedule = [
  {
    event_id: 3,
    role: 'Bar Manager',
    staff_id: null,
    event_date: '2018-07-20T07:00:00.000Z',
    schedule_id: 1
  },
  {
    event_id: 3,
    role: 'Assistant Bar Manager',
    staff_id: null,
    event_date: '2018-07-20T07:00:00.000Z',
    schedule_id: 2
  },
  {
    event_id: 3,
    role: 'Bartender',
    staff_id: null,
    event_date: '2018-07-20T07:00:00.000Z',
    schedule_id: 3
  },
  {
    event_id: 3,
    role: 'Barback',
    staff_id: null,
    event_date: '2018-07-20T07:00:00.000Z',
    schedule_id: 5
  }
];

export const mockEmptyScheduleWName = [
  {
    event_id: 3,
    role: 'Bar Manager',
    staff_id: null,
    name: 'Staff Needed',
    event_date: '2018-07-20T07:00:00.000Z',
    schedule_id: 1
  },
  {
    event_id: 3,
    role: 'Assistant Bar Manager',
    staff_id: null,
    name: 'Staff Needed',
    event_date: '2018-07-20T07:00:00.000Z',
    schedule_id: 2
  },
  {
    event_id: 3,
    role: 'Bartender',
    staff_id: null,
    name: 'Staff Needed',
    event_date: '2018-07-20T07:00:00.000Z',
    schedule_id: 3
  },
  {
    event_id: 3,
    role: 'Barback',
    staff_id: null,
    name: 'Staff Needed',
    event_date: '2018-07-20T07:00:00.000Z',
    schedule_id: 5
  }
];

export const mockEventInfo = {
  ass_bar_manager: true,
  bar_manager: true,
  barbacks: 1,
  bartenders: 1,
  date: 'Jul 20, 2018',
  event_id: 3,
  name: 'Billy Prince Billy'
};

export const mockEvent2Info = {
  ass_bar_manager: true,
  bar_manager: true,
  barbacks: 1,
  bartenders: 1,
  date: 'Jul 20, 2018',
  event_id: 4,
  name: 'Not Billy Prince Billy'
};

export const mockUnscheduledEvent = {
  ass_bar_manager: true,
  bar_manager: true,
  barbacks: 1,
  bartenders: 1,
  date: 'Jul 20, 2018',
  event_id: 3,
  name: 'Billy Prince Billy',
  staff: mockEmptyScheduleWName
};

export const mockEventsInfo = [mockEventInfo, mockEvent2Info];

export const mockSchedule = [
  { ...mockEventInfo, staff: mockEmptyScheduleWName }
];

export const mockFEScheduleData = [{ ...mockEventInfo, staff: mockStaff }];

export const mockFillRolesReturn = [
  { event_id: 3, role: 'Bar Manager', staff_id: 5, name: 'TK' },
  {
    event_id: 3,
    role: 'Assistant Bar Manager',
    staff_id: 2,
    name: 'Jared'
  },
  { event_id: 3, role: 'Barback', staff_id: 4, name: 'Ross' },
  { event_id: 3, role: 'Bartender', staff_id: 3, name: 'Jesse' }
];
////////////////
export const mockUnscheduledEvents = [
  { ...mockEventInfo, staff: mockUnscheduleStaff },
  { ...mockEvent2Info, staff: mockUnscheduleStaff }
];

export const mockNewSchedule = [
  { ...mockEventInfo, staff: mockFillRolesReturn },
  { ...mockEvent2Info, staff: [] }
];

export const mockEventToFillRoles = [
  {
    ...mockEventInfo,
    staff: [
      {
        event_id: 3,
        role: 'Bar Manager',
        staff_id: null,
        name: 'Staff Needed'
      },
      {
        event_id: 3,
        role: 'Assistant Bar Manager',
        staff_id: null,
        name: 'Staff Needed'
      },
      { event_id: 3, role: 'Bartender', staff_id: 3, name: 'Jesse' },
      { event_id: 3, role: 'Barback', staff_id: null, name: 'Staff Needed' }
    ]
  }
];

export const mockBuildRolesReturn = [
  {
    staff_id: null,
    event_id: 24,
    event_date: '2018-06-30',
    role: 'Bar Manager'
  },
  {
    staff_id: null,
    event_id: 24,
    event_date: '2018-06-30',
    role: 'Assistant Bar Manager'
  },
  {
    staff_id: null,
    event_id: 24,
    event_date: '2018-06-30',
    role: 'Bartender'
  },
  {
    staff_id: null,
    event_id: 24,
    event_date: '2018-06-30',
    role: 'Bartender'
  },
  {
    staff_id: null,
    event_id: 24,
    event_date: '2018-06-30',
    role: 'Bartender'
  },
  {
    staff_id: null,
    event_id: 24,
    event_date: '2018-06-30',
    role: 'Bartender'
  },
  {
    staff_id: null,
    event_id: 24,
    event_date: '2018-06-30',
    role: 'Barback'
  },
  {
    staff_id: null,
    event_id: 24,
    event_date: '2018-06-30',
    role: 'Barback'
  }
];

export const mockPostScheduleReturn = [
  {
    staff_id: null,
    name: 'Staff Needed',
    event_id: 24,
    event_date: '2018-06-30',
    role: 'Bar Manager',
    schedule_id: 1
  },
  {
    staff_id: null,
    name: 'Staff Needed',
    event_id: 24,
    event_date: '2018-06-30',
    role: 'Assistant Bar Manager',
    schedule_id: 2
  },
  {
    staff_id: null,
    name: 'Staff Needed',
    event_id: 24,
    event_date: '2018-06-30',
    role: 'Bartender',
    schedule_id: 3
  },
  {
    staff_id: null,
    name: 'Staff Needed',
    event_id: 24,
    event_date: '2018-06-30',
    role: 'Bartender',
    schedule_id: 4
  },
  {
    staff_id: null,
    name: 'Staff Needed',
    event_id: 24,
    event_date: '2018-06-30',
    role: 'Bartender',
    schedule_id: 5
  },
  {
    staff_id: null,
    name: 'Staff Needed',
    event_id: 24,
    event_date: '2018-06-30',
    role: 'Bartender',
    schedule_id: 6
  },
  {
    staff_id: null,
    name: 'Staff Needed',
    event_id: 24,
    event_date: '2018-06-30',
    role: 'Barback',
    schedule_id: 7
  },
  {
    staff_id: null,
    name: 'Staff Needed',
    event_id: 24,
    event_date: '2018-06-30',
    role: 'Barback',
    schedule_id: 8
  }
];

export const mockApiSchedule = [
  { schedule_id: 1, event_id: 3, staff_id: 3, role: 'Bartender' },
  { schedule_id: 2, event_id: 3, staff_id: 4, role: 'Barback' },
  { schedule_id: 3, event_id: 3, staff_id: null, role: 'Bar Manager' },
  {
    schedule_id: 4,
    event_id: 3,
    staff_id: null,
    role: 'Assistant Bar Manager'
  },
  { schedule_id: 5, event_id: 4, staff_id: 3, role: 'Bartender' }
];

export const mockApiScheduleReturn = {
  schedule: [],
  unscheduledEvents: [
    {
      ass_bar_manager: true,
      bar_manager: true,
      barbacks: 1,
      bartenders: 1,
      date: 'Jul 20, 2018',
      event_id: 3,
      name: 'Billy Prince Billy',
      staff: [
        {
          staff_id: 3,
          name: 'Jesse',
          bartender: true,
          barback: false,
          bar_manager: false,
          ass_bar_manager: false,
          beer_bucket: false,
          google_id: '1pLSNLEaSVT7hvRa5q4Vyy37IIN1',
          event_id: 3,
          role: 'Bartender',
          schedule_id: 1
        },
        {
          staff_id: 4,
          name: 'Ross',
          bartender: false,
          barback: true,
          bar_manager: false,
          ass_bar_manager: false,
          beer_bucket: false,
          google_id: '1pLSNLEaSVT7hvRa5q4Vyy37IIN2',
          event_id: 3,
          role: 'Barback',
          schedule_id: 2
        },
        {
          staff_id: null,
          name: 'Staff Needed',
          event_id: 3,
          role: 'Bar Manager',
          schedule_id: 3
        },
        {
          staff_id: null,
          name: 'Staff Needed',
          event_id: 3,
          role: 'Assistant Bar Manager',
          schedule_id: 4
        }
      ]
    }
  ]
};
