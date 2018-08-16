/* eslint-disable */
export const mockStaff = [{
  id: 5,
  name: 'TK',
  bartender: true,
  barback: false,
  bar_manager: true,
  ass_bar_manager: true,
  beer_bucket: false,
  google_id: '1pLSNLEaSVT7hvRa5q4Vyy37IIN1'
}, {
  id: 2,
  name: 'Jared',
  bartender: true,
  barback: false,
  bar_manager: false,
  ass_bar_manager: true,
  beer_bucket: false,
  google_id: '1pLSNLEaSVT7hvRa5q4Vyy37IIN2'
}, {
  id: 3,
  name: 'Jesse',
  bartender: true,
  barback: false,
  bar_manager: false,
  ass_bar_manager: false,
  beer_bucket: false,
  google_id: '1pLSNLEaSVT7hvRa5q4Vyy37IIN1'
}, {
  id: 4,
  name: 'Ross',
  bartender: false,
  barback: true,
  bar_manager: false,
  ass_bar_manager: false,
  beer_bucket: false,
  google_id: '1pLSNLEaSVT7hvRa5q4Vyy37IIN2'
}
];

export const expectedStaff = [{
  id: 5,
  name: 'TK',
  bartender: true,
  barback: false,
  bar_manager: true,
  ass_bar_manager: true,
  beer_bucket: false,
  google_id: '1pLSNLEaSVT7hvRa5q4Vyy37IIN1' 
}];

export const expectedStaffRoles = [
  {event_id: 3, role: "Bar Manager", staff_id: 5}, 
  {event_id: 3, role: "Assistant Bar Manager", staff_id: 2}, 
  {event_id: 3, role: "Bartender", staff_id: 3}, 
  {event_id: 3, role: "Barback", staff_id: 4}
];


