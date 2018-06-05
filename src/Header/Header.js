import React, { Component } from 'react';
import { auth, provider } from '../firebase.js';
import './styles.css';
import PropTypes from 'prop-types';

export class Header extends Component {
  constructor(props) {
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
  }

  logout = async () => {
    await auth.signOut();
    this.setState({ user: null });
    this.props.addUser(null);
  }

  componentDidMount = () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      }

      this.props.addUser(user);
    });
  }

  render () {

    return (
      <header>
        <h1 className='app-title'>Staff Gig Box</h1>
        { this.state.user ?
          <div className='log-out-container'>
            <img className='user-img' src={ this.state.user.photoURL } alt='profile pic'/>
            <button onClick={ this.logout }>Log Out</button>
          </div>
          :
          <button onClick={ this.login }>Log In</button>
        }
      </header>
    );
  }
}

Header.propTypes = {
  addUser: PropTypes.func
};
