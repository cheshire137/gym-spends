/* eslint-disable import/no-unassigned-import */

import React from 'react'
import 'whatwg-fetch'

import LocalStorage from '../models/local-storage'

export default class AuthLayout extends React.Component {
  logout(event) {
    event.preventDefault()

    LocalStorage.delete('foursquare-token')
    LocalStorage.delete('foursquare-user')
    LocalStorage.delete('foursquare-large-avatar')

    this.props.router.push('/')
  }

  logoutLink() {
    return (
      <a
        className="nav-item logout-link"
        href="#"
        onClick={e => this.logout(e)}
      >Log out of Swarm</a>
    )
  }

  render() {
    return (
      <div>
        <nav className="nav">
          <div className="container">
            <div className="nav-left">
              <a className="nav-item is-brand" href="/">Gym Spends</a>
            </div>
            <div className="nav-right nav-menu">
              {this.logoutLink()}
            </div>
          </div>
        </nav>
        <div className="content-container">
          {this.props.children}
        </div>
      </div>
    )
  }
}
