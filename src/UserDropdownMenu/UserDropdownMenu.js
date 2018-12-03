import React, { Component } from 'react';
import PropTypes from 'prop-types';

class UserDropdownMenu extends Component {
  componentDidMount() {
    document.addEventListener('click', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false);
  }

  handleClick = event => {
    if (event.target.parentNode.className === 'dropdown-content') {
      return null;
    } else {
      this.props.handleDropdown();
    }
  };

  render() {
    return (
      <div className="dropdown-content">
        <li onClick={this.props.logout}>Log Out</li>
      </div>
    );
  }
}

export default UserDropdownMenu;

UserDropdownMenu.propTypes = {
  handleDropdown: PropTypes.func,
  logout: PropTypes.func
};
