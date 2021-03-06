import React from 'react';
import PropTypes from 'prop-types';
import { Api } from '../Api/Api';

const api = new Api();

const DisplayStaffDropdown = ({ staffRole, availableStaff, handleChange }) => {
  const role = api.rolesRegex(staffRole);
  const available = availableStaff.filter(staff => staff[role]);

  const staff = available.map(person => {
    return (
      <option key={person.staff_id} value={person.staff_id}>
        {person.name}
      </option>
    );
  });

  return (
    <select onChange={handleChange}>
      <option>Select staff</option>
      {staff}
    </select>
  );
};

DisplayStaffDropdown.propTypes = {
  staffRole: PropTypes.string,
  availableStaff: PropTypes.arrayOf(PropTypes.object),
  handleChange: PropTypes.func
};

export default DisplayStaffDropdown;
