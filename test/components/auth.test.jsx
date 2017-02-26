import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import Auth from '../../src/components/auth.jsx'
import Config from '../../src/public/config'

describe('Auth', () => {
  let component = null

  beforeEach(() => {
    component = <Auth />
  })

  test('matches snapshot', () => {
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('includes Foursquare client ID in link', () => {
    const link = shallow(component).find('.foursquare-button')
    const regex = new RegExp(Config.foursquare.clientId)
    expect(link.props().href).toMatch(regex)
  })
})
