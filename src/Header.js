import React, { Component } from 'react';
import { auth, provider } from './firebase.js';

export class Header extends Component {
  constructor(props) {
    super()
    this.state = {
      user: null,
      result: []
    }
  }

  login = async () => {
    const result = await auth.signInWithPopup(provider) 
    const { user } = await result
    this.setState({ user })
    this.props.addUser(user)
  }

  logout = async () => {
    await auth.signOut()
    this.setState({ user: null });
    this.props.addUser(null)
  }

  componentDidMount = () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      } 
      this.props.addUser(user)
    });
  }

  render () {

    return (
      <header>
        <h1>Staff Gig Box</h1>
        { this.state.user ?
          <div>
          <button onClick={ this.logout }>Log Out</button>
          <img className='user-img' src={ this.state.user.photoURL } />  
          </div>              
          :
          <button onClick={ this.login }>Log In</button>              
        }
      </header>
    )
  }
}