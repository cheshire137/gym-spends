/* eslint-disable import/no-unassigned-import */

import React from 'react'
import 'whatwg-fetch'

import LocalStorage from '../models/local-storage'
import Fetcher from '../models/fetcher'

export default class AuthLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      token: LocalStorage.get('foursquare-token'),
      username: LocalStorage.get('foursquare-user'),
      avatar: LocalStorage.get('foursquare-avatar')
    }
  }

  componentDidMount() {
    if (!this.state.username) {
      this.fetchUser()
    }
  }

  fetchUser() {
    const fetcher = new Fetcher('')
    fetcher.get(`/me?token=${this.state.token}`).then(user => {
      const avatarUrl = `${user.photo.prefix}100x100${user.photo.suffix}`
      LocalStorage.set('foursquare-user-id', user.id)
      const username = `${user.firstName} ${user.lastName}`
      LocalStorage.set('foursquare-user', username)
      LocalStorage.set('foursquare-avatar', avatarUrl)
      this.setState({ username })
    })
  }

  logout(event) {
    event.preventDefault()
    LocalStorage.delete('foursquare-user-id')
    LocalStorage.delete('foursquare-token')
    LocalStorage.delete('foursquare-user')
    LocalStorage.delete('foursquare-avatar')
    this.props.router.push('/')
  }

  logoutLink() {
    const { username, avatar } = this.state
    if (!username) {
      return
    }
    let image = ''
    if (avatar) {
      image = <img src={avatar} className="icon foursquare-avatar" />
    }
    return (
      <a
        className="nav-item logout-link"
        href="#"
        onClick={e => this.logout(e)}
      >
        {image}
        <span>Log out </span>
        <span className="username">{username}</span>
      </a>
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
