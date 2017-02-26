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
    console.log(checkins)
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
    const { activeView } = this.state
    return (
      <section className="section">
        <div className="container">
          It's gym time
        </div>
      </section>
    )
  }
}

export default Swarm
