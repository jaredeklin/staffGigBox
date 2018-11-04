import React from 'react';
import PropTypes from 'prop-types';
import { Api } from '../Api/Api';

const DisplayStaff = ({
  event,
  staffRole,
  deleteFromSchedule,
  handleEditClick,
  admin
}) => {
  const api = new Api();

  const mapStaff = staffRole => {
    const { staff } = event;

    return staff
      .filter(staffMember => staffMember.role === staffRole)
      .map(person => {
        return (
          <li key={person.staff_events_id + staffRole}>
            {person.name}
            {admin && (
              <div className="edit-container">
                <button
                  className="delete"
                  onClick={() => deleteFromSchedule(person.staff_events_id)}
                />
                <button
                  className="edit"
                  onClick={() => handleEditClick(person)}
                />
              </div>
            )}
          </li>
        );
      });
  };

  const role =
    staffRole === 'Bartender' || staffRole === 'Barback'
      ? staffRole + 's'
      : staffRole;

  return (
    <ul className={api.getClassName(staffRole)}>
      <h4>{role}</h4>
      {mapStaff(staffRole)}
    </ul>
  );
};

export default DisplayStaff;

DisplayStaff.propTypes = {
  event: PropTypes.object,
  staffRole: PropTypes.string,
  admin: PropTypes.bool,
  deleteFromSchedule: PropTypes.func,
  handleEditClick: PropTypes.func
};
