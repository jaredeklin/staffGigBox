import React, { Component } from 'react';
import { auth, provider } from '../firebase.js';
import './Sidebar.css';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import UserDropdownMenu from '../UserDropdownMenu/UserDropdownMenu.js';

export class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      showDropdown: false
    };
  }

  login = async () => {
    const result = await auth.signInWithPopup(provider);
    const {
      user: { uid, photoURL, displayName }
    } = result;

    this.setState({
      user: {
        uid,
        photoURL,
        displayName
      }
    });
    this.props.addUser(uid);
  };

  logout = async () => {
    await auth.signOut();
    this.setState({ user: null, showDropdown: false });
    this.props.addUser(null);
  };

  componentDidMount = () => {
    auth.onAuthStateChanged(user => {
      if (user) {
        const { uid, photoURL, displayName } = user;

        this.setState({ user: { uid, photoURL, displayName } });
        this.props.addUser(user.uid);
      }
    });
  };

  handleDropdown = () => {
    this.setState({ showDropdown: !this.state.showDropdown });
  };

  render() {
    return (
      <aside>
        {this.state.user ? (
          <div className="log-out-container">
            <img
              className="user-img"
              src={this.state.user.photoURL}
              alt="profile pic"
            />
            <div className="user-dropdown-container">
              {this.state.user.displayName}
              <button
                onClick={this.handleDropdown}
                className="user-dropdown-container-btn"
              >
                &#9662;
              </button>

              {this.state.showDropdown && (
                <UserDropdownMenu
                  logout={this.logout}
                  handleDropdown={this.handleDropdown}
                />
              )}
            </div>
          </div>
        ) : (
          <button onClick={this.login}>Log In</button>
        )}
        <hr />
        <ul className="sidebar-nav-list">
          <NavLink to="/schedule" className="nav-link">
            <li>Schedule</li>
          </NavLink>

          <NavLink to="/unscheduled-events" className="nav-link">
            <li>Unscheduled Events</li>
          </NavLink>

          <NavLink to="/availability" className="nav-link">
            <li>Availability</li>
          </NavLink>

          <NavLink to="/add-staff" className="nav-link">
            <li>Add Staff</li>
          </NavLink>

          <NavLink to="/add-events" className="nav-link">
            <li>Add Events</li>
          </NavLink>
        </ul>
      </aside>
    );
  }
}

Sidebar.propTypes = {
  addUser: PropTypes.func,
  updateHeaderText: PropTypes.func
};
