import fetchMock from 'fetch-mock'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import Config from '../../src/public/config'
import AuthLayout from '../../src/components/auth-layout.jsx'

import mockLocalStorage from '../mocks/local-storage'
import waitForRequests from '../helpers/wait-for-requests'

import MeResponse from '../fixtures/foursquare/me'

const initialLocalData = { 'foursquare-token': '123abc' }

describe('AuthLayout', () => {
  let component = null
  let path = null
  let meRequest = null
  let store = null

  const routeChange = newPath => {
    path = newPath
  }

  beforeEach(() => {
    meRequest = fetchMock.get(`${Config.foursquare.apiUrl}/users/self`, MeResponse)

    store = { 'gym-spends': JSON.stringify(initialLocalData) }
    mockLocalStorage(store)

    component = (
      <AuthLayout router={{ push: routeChange }}><p>hey</p></AuthLayout>
    )
  })

  test('matches snapshot', () => {
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('renders details from Foursquare', done => {
    waitForRequests([meRequest], done, done.fail, () => {
      const wrapper = shallow(component)

      // Ensure Foursquare user is shown
      const user = wrapper.find('.username')
      expect(user.text()).toBe(`${MeResponse.firstName} ${MeResponse.lastName}`)

      // Page title
      const title = wrapper.find('.is-brand')
      expect(title.text()).toBe('Gym Spends')

      // Ensure data saved to local storage
      const expected = Object.assign({}, initialLocalData)
      expected['foursquare-user-id'] = MeResponse.id
      expected['foursquare-user'] = `${MeResponse.firstName} ${MeResponse.lastName}`
      expect(store['gym-spends']).toEqual(JSON.stringify(expected))

      // Ensure given child content is rendered
      const content = wrapper.find('.content-container')
      expect(content.children().length).toBe(1)
      expect(content.children().text()).toBe('hey')

      // Log out
      expect(path).toBe(null)
      const link = wrapper.find('.logout-link')
      link.simulate('click', { preventDefault() {} })
      expect(path).toBe('/')
      expect(store['gym-spends']).toEqual('{}')
    })
  })
})
