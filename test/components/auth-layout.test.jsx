import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import AuthLayout from '../../src/components/auth-layout.jsx'

import mockLocalStorage from '../mocks/local-storage'

const initialLocalData = { 'foursquare-token': '123abc' }

describe('AuthLayout', () => {
  let component = null
  let path = null
  let store = null

  const routeChange = newPath => {
    path = newPath
  }

  beforeEach(() => {
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

  test('renders expected content for authenticated user', () => {
    const wrapper = shallow(component)

    // Ensure logout link is shown
    expect(wrapper.find('.logout-link').length).toBe(1)

    // Page title
    const title = wrapper.find('.is-brand')
    expect(title.text()).toBe('Gym Spends')

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
