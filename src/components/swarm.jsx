import React from 'react'

import LocalStorage from '../models/local-storage'
import Fetcher from '../models/fetcher'

import CheckinsList from './checkins-list.jsx'

class Swarm extends React.Component {
  constructor(props) {
    super(props)
    let cost = null
    if (LocalStorage.has('gym-cost')) {
      cost = parseFloat(LocalStorage.get('gym-cost'))
    }
    let extraVisitCount = 0
    if (LocalStorage.has('gym-extra-visit-count')) {
      const extraVisitMonth = LocalStorage.get('gym-extra-visit-month')
      const curMonth = this.getCurrentMonth().getTime()
      if (extraVisitMonth === curMonth) {
        extraVisitCount = LocalStorage.get('gym-extra-visit-count')
      } else {
        LocalStorage.delete('gym-extra-visit-count')
        LocalStorage.delete('gym-extra-visit-month')
      }
    }
    this.state = {
      token: LocalStorage.get('foursquare-token'),
      checkins: [],
      cost,
      extraVisitCount,
      numVisits: 0
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

  onCheckinsFetched(allCheckins) {
    const checkins = allCheckins.items.filter(this.isCheckinAtGym)
    this.setState({ checkins })
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
    LocalStorage.delete('gym-visit-count')
    this.props.router.push('/')
  }

  getCurrentMonth() {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  }

  onExtraVisitsChange(event) {
    const countStr = event.target.value.trim()
    const extraVisitCount = countStr.length > 0 ? parseInt(countStr, 10) : countStr
    this.setState({ extraVisitCount }, () => {
      if (countStr.length > 0) {
        LocalStorage.set('gym-extra-visit-count', extraVisitCount)
        const timestamp = this.getCurrentMonth().getTime()
        LocalStorage.set('gym-extra-visit-month', timestamp)
      }
    })
  }

  checkinsList() {
    const { checkins, extraVisitCount } = this.state
    const numVisits = checkins.length + extraVisitCount
    if (numVisits < 1) {
      return (
        <p className="has-text-centered">
          I have not been to the gym any this month. :(
          <span className="quote">&rdquo;</span>
        </p>
      )
    }

    let times = 'time'
    if (numVisits.length !== 1) {
      times += 's'
    }
    return (
      <div>
        <p className="input-line-height has-text-centered">
          <span className="quote">&ldquo;</span>
          I have been to the gym
          <strong
            className="space-after space-before"
          >{checkins.length}</strong>
          <span
            className="space-after"
          >+</span>
          <input
            type="text"
            value={extraVisitCount}
            onChange={e => this.onExtraVisitsChange(e)}
            className="input extra-visit-field"
            size="2"
          />
          <span
            className="space-before"
          >=</span>
          <strong
            className="space-before"
          >{numVisits}</strong>
          <span
            className="space-before"
          >{times} this month.</span>
          <span className="quote">&rdquo;</span>
        </p>
        <CheckinsList checkins={checkins} />
      </div>
    )
  }

  onCostChange(event) {
    const costStr = event.target.value.trim()
    const cost = costStr.length > 0 ? parseFloat(costStr) : costStr
    this.setState({ cost }, () => {
      if (costStr.length > 0) {
        LocalStorage.set('gym-cost', cost)
      }
    })
  }

  costPerVisit() {
    const { cost, checkins, extraVisitCount } = this.state
    const numVisits = checkins.length + extraVisitCount
    if (typeof cost !== 'number' || numVisits < 1) {
      return
    }
    const perVisit = (cost / numVisits).toFixed(2)
    return (
      <p className="has-text-centered">
        <span className="quote">&ldquo;</span>
        If I don&lsquo;t go to the gym any more this month,
        each visit has cost me
        <strong className="space-before">${perVisit}</strong>.
      </p>
    )
  }

  render() {
    const { cost } = this.state
    return (
      <section className="section content">
        <div className="container">
          <div className="columns">
            <div className="column is-half is-offset-3">
              <p
                className="has-text-centered"
              >
                <label
                  className="label inline-block is-large space-after"
                  htmlFor="gym-cost"
                >
                  <span className="quote">&ldquo;</span>
                  My gym costs
                </label>
                <span className="control has-icon has-icon-left">
                  <span className="icon is-large">
                    <i className="fa fa-usd" />
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
              </p>
              {this.costPerVisit()}
              {this.checkinsList()}
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default Swarm
