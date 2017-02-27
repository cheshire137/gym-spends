# Gym Spends

[![Build Status](https://travis-ci.org/cheshire137/gym-spends.svg?branch=master)](https://travis-ci.org/cheshire137/gym-spends)

As motivation for going to the gym more often, this app will tell
you how much each visit is costing you based on your monthly gym
fee and how much you've checked in there this month.

## How to Develop

You will need [Homebrew](http://brew.sh/) installed in macOS.

Create
[a Foursquare application](https://foursquare.com/developers/register)
and copy your app's client ID to src/public/config.json. Add `http://localhost:3000/auth`
as a redirect URI in your Foursquare app.

```bash
brew update
brew install yarn
yarn install
gulp
open http://localhost:3000
```

## How to Test

```bash
yarn install
yarn test
```

This will run the style checker and the Jest tests. You can run just the
style checker via `yarn run style`. You can run just the Jest tests
via `yarn run unit-test`.

Snapshots are used --
see [`test/components/__snapshots__/`](test/components/__snapshots__/) --
to test that a React component is rendered the same way consistently based
on the props it's given. If you update a component, a test may fail
because the snapshot is now different from what is rendered. Manually
compare the two and if the change is expected, update the now out-of-date
snapshot with `yarn run unit-test -- -u`.

See also:

- [Shallow rendering with Enzyme](http://airbnb.io/enzyme/docs/api/shallow.html)
- [Jest matchers](https://facebook.github.io/jest/docs/expect.html#content)
- [ESLint rules](http://eslint.org/docs/rules/)
- [XO style checker](https://github.com/sindresorhus/xo)
