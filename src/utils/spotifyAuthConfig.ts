export const getSpotifyRedirectUri = (origin: string, electron: boolean) =>
  electron ? 'ledfx://callback/#/Integrations?' : new URL('/callback/', origin).href

export const getSpotifyAuthorizationUrl = (
  clientId: string,
  redirectUri: string,
  challenge: string,
  scopes: readonly string[]
) => {
  const url = new URL('https://accounts.spotify.com/authorize/')
  url.search = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: scopes.join(' '),
    redirect_uri: redirectUri,
    code_challenge: challenge,
    code_challenge_method: 'S256'
  }).toString()
  return url.href
}
