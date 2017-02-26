import React from 'react'

import CheckinsList from './checkins-list.jsx'
import LocalStorage from '../models/local-storage'
import Fetcher from '../models/fetcher'

class Swarm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      token: LocalStorage.get('foursquare-token'),
      checkins: []
    }
  }

  componentDidMount() {
    this.fetchCheckins()
  }

  fetchCheckins() {
    const fetcher = new Fetcher('')
    fetcher.get(`/checkins?token=${this.state.token}`).
      then(json => this.onCheckinsFetched(json)).
      catch(err => this.onCheckinsFetchError(err))
  }

  onCheckinsFetched(checkins) {
    const gyms = checkins.items.filter(this.isCheckinAtGym)
    console.log(gyms)
    this.setState({ checkins: gyms })
  }

  isCheckinAtGym(checkin) {
    const categories = checkin.venue.categories
    return categories.filter(cat => cat.name === 'Gym').length > 0
  }

  onCheckinsFetchError(error) {
    console.error('failed to load your checkins', error)
    if (error.response.status === 401) {
      this.unauthorized()
    }
  }

  unauthorized() {
    LocalStorage.delete('foursquare-token')
    LocalStorage.delete('foursquare-user')
    LocalStorage.delete('foursquare-user-id')
    this.props.router.push('/')
  }

  checkinsList() {
    const { checkins } = this.state
    if (checkins.length < 1) {
      return <p>I have not been to the gym any this month. :(</p>
    }

    let times = 'time'
    if (checkins.length > 1) {
      times += 's'
    }
    return (
      <div className="content">
        <p>
          I have been to the gym
          <strong
            className="space-after space-before"
          >{checkins.length}</strong>
          {times} this month.
        </p>
        <CheckinsList checkins={checkins} />
      </div>
    )
  }

  render() {
    return (
      <section className="section">
        <div className="container">
          <form>
            <label
              className="label inline-block is-large space-after"
              htmlFor="gym-cost"
            >My gym costs</label>
            <span className="control has-icon has-icon-left">
              <span className="icon is-large">
                <i className="fa fa-usd"></i>
              </span>
              <input
                type="text"
                id="gym-cost"
                size="5"
                className="input is-large"
                placeholder="75"
              />
            </span>
            <span
              className="label inline-block is-large space-before"
            >per month.</span>
          </form>
          {this.checkinsList()}
        </div>
      </section>
    )
  }
}

export default Swarm
