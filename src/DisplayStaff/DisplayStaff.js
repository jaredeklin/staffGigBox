import React from 'react';
import PropTypes from 'prop-types';
import { Api } from '../Api/Api';
const api = new Api();

const DisplayStaff = ({
  event,
  staffRole,
  deleteFromSchedule,
  handleEditClick,
  admin
}) => {
  const mapStaff = staffRole => {
    const { staff } = event;

    return staff
      .filter(staffMember => staffMember.role === staffRole)
      .map(person => {
        const { schedule_id, name } = person;

        return (
          <li key={schedule_id} className="individual-staff-name">
            {name}
            {admin && (
              <div className="edit-container">
                <button
                  className="delete"
                  onClick={() => deleteFromSchedule(person)}
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
