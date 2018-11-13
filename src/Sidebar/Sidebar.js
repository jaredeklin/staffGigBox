import React, { Component } from 'react';
import { auth, provider } from '../firebase.js';
import './Sidebar.css';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

export class Sidebar extends Component {
  constructor() {
    super();
    this.state = {
      user: null
    };
  }

  login = async () => {
    const result = await auth.signInWithPopup(provider);
    const { user } = await result;

    this.setState({ user });
    this.props.addUser(user);
  };

  logout = async () => {
    await auth.signOut();
    this.setState({ user: null });
    this.props.addUser(null);
  };

  componentDidMount = () => {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      }

      this.props.addUser(user);
    });
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
            <button onClick={this.logout}>Log Out</button>
          </div>
        ) : (
          <button onClick={this.login}>Log In</button>
        )}
        <hr />
        <ul>
          <li>
            <NavLink to="/schedule" className="nav">
              Schedule
            </NavLink>
          </li>
          <li>
            <NavLink to="/unscheduled-events" className="nav">
              Unscheduled Events
            </NavLink>
          </li>
          <li>
            <NavLink to="/availability" className="nav">
              Availability
            </NavLink>
          </li>
          <li>
            <NavLink to="/add-staff" className="nav">
              Add Staff
            </NavLink>
          </li>
          <li>
            <NavLink to="/add-events" className="nav">
              Add Events
            </NavLink>
          </li>
        </ul>
      </aside>
    );
  }
}

Sidebar.propTypes = {
  addUser: PropTypes.func
};
