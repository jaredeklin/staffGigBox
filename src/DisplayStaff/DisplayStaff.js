import React from 'react';

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

  const getClassName = role => {
    switch (role) {
      case 'Bar Manager':
        return 'bar-manager';

      case 'Assistand Bar Manager':
        return 'ass-bar-manager';

      case 'Bartender':
        return 'bartenders';

      case 'Barback':
        return 'barbacks';

      default:
        break;
    }
  };

  const role =
    staffRole === 'Bartender' || staffRole === 'Barback'
      ? staffRole + 's'
      : staffRole;

  return (
    <ul className={getClassName(staffRole)}>
      <h4>{role}</h4>
      {mapStaff(staffRole)}
    </ul>
  );
};

export default DisplayStaff;
