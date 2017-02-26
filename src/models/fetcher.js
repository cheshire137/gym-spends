/* eslint-disable import/no-unassigned-import */

import 'whatwg-fetch'

export default class Fetcher {
  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response
    }
    const error = new Error(response.statusText)
    error.response = response
    throw error
  }

  parseJson(response) {
    return response.json()
  }

  get(path, headers) {
    return this.makeRequest('GET', path, headers)
  }

  makeRequest(method, path, extraHeaders, body) {
    const url = `${Config.foursquare.apiUrl}${path}`
    const headers = {}
    for (const key of Object.keys(this.headers)) {
      headers[key] = this.headers[key]
    }
    if (extraHeaders) {
      for (const key of Object.keys(extraHeaders)) {
        headers[key] = extraHeaders[key]
      }
    }
    const data = { method, headers }
    if (body) {
      data.body = JSON.stringify(body)
    }
    return fetch(url, data).then(this.checkStatus).then(this.parseJson)
  }
}
