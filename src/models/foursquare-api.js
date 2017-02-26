import Fetcher from './fetcher'
import Config from '../public/config'

export default class FoursquareApi extends Fetcher {
  constructor(token, fetch) {
    super(Config.foursquare.apiUrl, fetch)
    this.token = token
  }

  me() {
    const path = this.foursquarifyPath('/users/self')
    return this.get(path)
  }

  checkins() {
    const now = new Date()
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const after = firstOfMonth.getTime() / 1000
    const query = `?afterTimestamp=${after}`
    const path = this.foursquarifyPath(`/users/self/checkins${query}`)
    return this.get(path)
  }

  // See https://developer.foursquare.com/overview/versioning and
  // https://developer.foursquare.com/overview/auth.html#access
  foursquarifyPath(path) {
    const connector = path.indexOf('?') > -1 ? '&' : '?'
    return `${path}${connector}oauth_token=${this.token}&v=20170226`
  }
}
