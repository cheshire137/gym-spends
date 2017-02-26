import Config from '../public/config'
import Fetcher from './fetcher'

export default class FoursquareApi extends Fetcher {
  constructor(token) {
    super()
    this.token = token
    this.headers = { Authorization: `Bearer ${this.token}` }
  }

  me() {
    return this.get('/users/self')
  }

  checkins() {
    const now = new Date()
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const after = firstOfMonth.getTime() / 1000
    return this.get(`/users/self/checkins?afterTimestamp=${after}`)
  }
}
