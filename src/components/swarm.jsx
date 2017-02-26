import React from 'react'

import LocalStorage from '../models/local-storage'
import Fetcher from '../models/fetcher'

class Swarm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      token: LocalStorage.get('foursquare-token')
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
                size="10"
                className="input is-large"
                placeholder="75"
              />
            </span>
            <span
              className="label inline-block is-large space-before"
            >per month.</span>
          </form>
        </div>
      </section>
    )
  }
}

export default Swarm
