import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  getSpotifyRedirectUri,
  getSpotifyAuthorizationUrl
} from '../../src/utils/spotifyAuthConfig.ts'

test('browser callback uses the actual origin, without a query or fragment', () => {
  for (const origin of [
    'http://127.0.0.1:8888',
    'http://127.0.0.1:3000',
    'https://ledfx.example'
  ]) {
    const callback = new URL(getSpotifyRedirectUri(origin, false))
    assert.equal(callback.origin, origin)
    assert.equal(callback.pathname, '/callback/')
    assert.equal(callback.hash, '')
    assert.equal(callback.search, '')
  }
})

test('Electron retains its existing deep-link callback', () => {
  assert.equal(getSpotifyRedirectUri('null', true), 'ledfx://callback/#/Integrations?')
})

test('authorization request includes the supplied app, exact callback, scopes and PKCE challenge', () => {
  const redirectUri = getSpotifyRedirectUri('http://127.0.0.1:8888', false)
  const url = new URL(
    getSpotifyAuthorizationUrl('example-client-id', redirectUri, 'challenge-123', [
      'streaming',
      'user-read-playback-state'
    ])
  )
  assert.equal(url.origin, 'https://accounts.spotify.com')
  assert.equal(url.searchParams.get('client_id'), 'example-client-id')
  assert.equal(url.searchParams.get('redirect_uri'), redirectUri)
  assert.equal(url.searchParams.get('response_type'), 'code')
  assert.equal(url.searchParams.get('code_challenge'), 'challenge-123')
  assert.equal(url.searchParams.get('code_challenge_method'), 'S256')
  assert.equal(url.searchParams.get('scope'), 'streaming user-read-playback-state')
})
