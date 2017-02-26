import React from 'react'

import LocalStorage from '../models/local-storage'
import Fetcher from '../models/fetcher'

export default class AuthLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      token: LocalStorage.get('foursquare-token'),
      username: LocalStorage.get('foursquare-user')
    }
  }

  componentDidMount() {
    if (!this.state.username) {
      this.fetchUser()
    }
  }

  fetchUser() {
    const fetcher = new Fetcher()
    fetcher.get(`/me?token=${this.state.token}`).then(json => {
      console.log(json)
      LocalStorage.set('foursquare-user-id', json.id)
      const username = `${json.firstName} ${json.lastName}`
      LocalStorage.set('foursquare-user', username)
      this.setState({ username })
    })
  }

  logout(event) {
    event.preventDefault()
    LocalStorage.delete('foursquare-user-id')
    LocalStorage.delete('foursquare-token')
    LocalStorage.delete('foursquare-user')
    this.props.router.push('/')
  }

  logoutLink() {
    if (!this.state.username) {
      return
    }
    return (
      <a
        className="nav-item logout-link"
        href="#"
        onClick={e => this.logout(e)}
      >
        <span>Log out </span>
        <span className="username">{this.state.username}</span>
      </a>
    )
  }

  render() {
    return (
      <div>
        <div className="container">
          <nav className="nav">
            <div className="nav-left">
              <a className="nav-item is-brand" href="/">Gym Spends</a>
            </div>
            <div className="nav-right nav-menu">
              {this.logoutLink()}
            </div>
          </nav>
        </div>
        <div className="content-container">
          {this.props.children}
        </div>
      </div>
    )
  }
}
