import React from 'react'

import CheckinsList from './checkins-list.jsx'
import LocalStorage from '../models/local-storage'
import Fetcher from '../models/fetcher'

class Swarm extends React.Component {
  constructor(props) {
    super(props)
    let cost = null
    if (LocalStorage.has('gym-cost')) {
      cost = parseFloat(LocalStorage.get('gym-cost'))
    }
    this.state = {
      token: LocalStorage.get('foursquare-token'),
      checkins: [],
      cost
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

  onSubmit(event) {
    event.preventDefault()
  }

  onCostChange(event) {
    const cost = event.target.value
    this.setState({ cost }, () => {
      LocalStorage.set('gym-cost', cost)
    })
  }

  costPerVisit() {
    const { cost, checkins } = this.state
    if (typeof cost !== 'number' || checkins.length < 1) {
      return
    }
    const perVisit = (cost / checkins.length).toFixed(2)
    return (
      <p>
        If I don&lsquo;t go to the gym any more this month,
        each visit will cost me
        <strong className="space-before">${perVisit}</strong>.
      </p>
    )
  }

  render() {
    const { cost } = this.state
    return (
      <section className="section">
        <div className="container">
          <form onSubmit={e => this.onSubmit(e)}>
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
                placeholder="0"
                value={cost}
                onChange={e => this.onCostChange(e)}
              />
            </span>
            <span
              className="label inline-block is-large space-before"
            >per month.</span>
          </form>
          {this.costPerVisit()}
          {this.checkinsList()}
        </div>
      </section>
    )
  }
}

export default Swarm
