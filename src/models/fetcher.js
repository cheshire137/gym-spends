class Fetcher {
  constructor(basePath, fetch) {
    this.basePath = basePath
    this.fetch = fetch
  }

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

  makeRequest(method, path, headers, body) {
    const url = `${this.basePath}${path}`
    const data = { method, headers }
    if (body) {
      data.body = JSON.stringify(body)
    }
    let promise = null
    if (this.fetch) {
      promise = this.fetch(url, data)
    } else if (fetch) {
      promise = fetch(url, data)
    } else {
      throw new Error('no fetch available')
    }
    return promise.then(this.checkStatus).
      then(this.parseJson)
  }
}

module.exports = Fetcher
