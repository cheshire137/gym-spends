import React from 'react'

import Config from '../public/config'

export default class Auth extends React.Component {
  render() {
    const host = 'https://foursquare.com'
    const redirectUri = `${window.location.protocol}//${window.location.host}/auth`
    const authUrl = `${host}/oauth2/authenticate?response_type=token` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&client_id=${Config.foursquare.clientId}`
    return (
      <section className="hero">
        <div className="hero-body">
          <div className="container">
            <h2 className="subtitle">
              Sign in with your Foursquare account to track how many times you go to the gym.
            </h2>
            <p>
              <a
                href={authUrl}
                className="foursquare-button is-primary button is-large"
              >Sign into Foursquare</a>
            </p>
          </div>
        </div>
      </section>
    )
  }
}
