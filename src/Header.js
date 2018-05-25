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
    this.setState({ user, result })
    this.props.addUser(user)
  }

  logout = async () => {
    await auth.signOut()
    this.setState({ user: null });
    this.props.addUser(null)
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