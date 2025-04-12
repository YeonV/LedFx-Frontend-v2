import Cookies from 'universal-cookie'
import axios, { AxiosError } from 'axios' // Import AxiosError for better typing
import qs from 'qs'
import { log } from './helpers'
import useStore from '../store/useStore'
import {
  getBaseURL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_SCOPES
} from './spotifyConstants'

// --- Constants ---

const baseURL = getBaseURL()
const storedURL = window.localStorage.getItem('ledfx-host')

const SPOTIFY_ACCOUNTS_URL = 'https://accounts.spotify.com'
const SPOTIFY_API_URL = 'https://api.spotify.com/v1'

const apiCredentials = {
  CLIENT_ID: SPOTIFY_CLIENT_ID,
  REDIRECT_URL: SPOTIFY_REDIRECT_URI,
  SCOPES: SPOTIFY_SCOPES
}

// --- Interfaces ---

interface FinishAuthResult {
  success: boolean
  accessToken?: string
  error?: string
}

interface RefreshAuthResult {
  success: boolean
  newAccessToken?: string
  error?: string
}

interface SpotifyApiError {
  error: {
    status: number
    message: string
  }
}

// Define interfaces for expected Spotify data structures
interface SpotifyUser {
  id: string
  display_name: string
  email: string
  // ... other user fields
}

interface SpotifyPlayerState {
  item?: { id: string; name: string /* ... */ }
  device?: { id: string; name: string /* ... */ }
  progress_ms?: number
  is_playing: boolean
  shuffle_state?: boolean
  repeat_state?: 'off' | 'track' | 'context'
  // ... other state fields
}

interface SpotifyDevice {
  id: string | null // Device ID can be null
  is_active: boolean
  is_private_session: boolean
  is_restricted: boolean
  name: string
  type: string
  volume_percent: number | null // Volume can be null
  supports_volume: boolean
}

interface SpotifyDevices {
  devices: SpotifyDevice[]
}

// Generic success/error type for actions
type SpotifySuccessOrError = 'Success' | string

interface TransferPlaybackBody {
  device_ids: string[]
  play?: boolean // Play is optional according to docs, defaults to false if omitted
}
// --- Helper Functions ---

const cookieOptions = { path: '/' }

// Helper function to wait for the access_token cookie
function waitForAccessToken(timeout: number): Promise<string | null> {
  // log('infoSpotify', 'waitForAccessToken called'); // Reduce noise? Only log on failure?
  return new Promise((resolve) => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const cookies = new Cookies(null, { path: '/' })
      const access_token = cookies.get('access_token')
      if (access_token) {
        clearInterval(interval)
        resolve(access_token)
      } else if (Date.now() - startTime >= timeout) {
        clearInterval(interval)
        log('errorSpotify', 'Access Token not defined after waiting timeout')
        resolve(null)
      }
    }, 100)
  })
}

// Helper to handle common API call logic (get token, make request)
async function makeSpotifyApiRequest<T>(
  method: 'get' | 'post' | 'put' | 'delete',
  endpoint: string,
  // Optional: Allow passing token directly for functions like getTrackFeatures
  options?: { data?: any; params?: any; token?: string | null }
): Promise<T | string> {
  // Returns T for success, string for error message

  let access_token = options?.token // Use provided token if available

  // If no token provided in options, try to get it from cookie
  if (!access_token) {
    access_token = await waitForAccessToken(5000) // Wait up to 5s
    if (!access_token) {
      const errorMsg = `Spotify API call to '${endpoint}' failed: Missing Access Token`
      console.error(errorMsg)
      return errorMsg
    }
  }

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${access_token}`,
        // Set Content-Type only for methods with a body
        'Content-Type':
          options?.data && (method === 'post' || method === 'put')
            ? 'application/json'
            : undefined
      },
      params: options?.params // URL query parameters for GET
    }
    const url = `${SPOTIFY_API_URL}${endpoint}`

    let res
    switch (method) {
      case 'get':
        res = await axios.get<T>(url, config)
        break
      case 'post':
        res = await axios.post<T>(url, options?.data, config)
        break
      case 'put':
        res = await axios.put<T>(url, options?.data, config)
        break
      case 'delete':
        res = await axios.delete<T>(url, config)
        break
      default:
        // Should not happen with TS, but good practice
        throw new Error(`Unsupported HTTP method: ${method}`)
    }

    // Check for 204 No Content specifically for PUT/DELETE/POST where it's valid success
    if (
      (method === 'put' || method === 'delete' || method === 'post') &&
      res.status === 204
    ) {
      // For actions resulting in 204, return a generic success object or specific type if needed
      // Since we expect 'Success' string or error string, handle this appropriately downstream
      // Or adjust function signature to return T | null | string
      return 'Success' as any // Cast needed if T isn't 'Success'
    }

    // For GET or other successful requests with bodies
    return res.data
  } catch (error: any) {
    const axiosError = error as AxiosError<SpotifyApiError>
    const status = axiosError.response?.status
    // Attempt to get specific error message from Spotify's structure
    const spotifyErrorMessage = axiosError.response?.data?.error?.message
    const genericMessage = axiosError.message || 'API call failed'

    const detailedMessage = spotifyErrorMessage || genericMessage

    console.error(
      `Spotify API call to '${endpoint}' failed. Status: ${status ?? 'N/A'}`,
      detailedMessage,
      axiosError.response?.data || axiosError // Log full response data if available
    )

    if (status === 401) {
      // Handle 401 specifically
      return 'Error: Unauthorized (Token might be invalid/expired)'
    }
    if (status === 403) {
      // Handle 403 - often Premium required or scope missing
      if (detailedMessage.includes('premium')) {
        return 'Error: Spotify Premium required'
      }
      return `Error: Forbidden (${detailedMessage})`
    }
    if (status === 404) {
      // Handle 404 - resource not found
      return `Error: Not Found (${detailedMessage})`
    }
    if (status === 429) {
      // Handle 429 - Rate limited
      return `Error: Rate Limited (${detailedMessage})`
    }

    // Return a user-friendly error message for other errors
    return `Error: ${detailedMessage}`
  }
}

// --- Authentication Functions ---

export const finishAuth = async (
  code: string | null
): Promise<FinishAuthResult> => {
  // ... (Implementation remains the same as your last version) ...
  // log('successSpotify', 'finishAuth starting with code:', code)
  const cookies = new Cookies(null, cookieOptions)

  if (!code) {
    log('errorSpotify', 'finishAuth called without a code.')
    return { success: false, error: 'Authorization code missing' }
  }
  const verifier = cookies.get('verifier')
  if (!verifier) {
    log('errorSpotify', 'finishAuth: PKCE verifier cookie missing.')
    return { success: false, error: 'Security verifier missing.' }
  }
  const postData = {
    client_id: SPOTIFY_CLIENT_ID,
    grant_type: 'authorization_code',
    code,
    redirect_uri: apiCredentials.REDIRECT_URL,
    code_verifier: verifier
  }
  const config = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }
  // log('infoSpotify', 'Posting to Spotify Token Endpoint with data:', {
  //   ...postData,
  //   code_verifier: '***HIDDEN***'
  // })
  try {
    const res = await axios.post(
      `${SPOTIFY_ACCOUNTS_URL}/api/token`,
      qs.stringify(postData),
      config
    )
    log('successSpotify', 'Tokens obtained successfully. Status:', res.status)
    cookies.remove('access_token')
    cookies.remove('refresh_token')
    cookies.remove('logout')
    cookies.remove('verifier')
    const expDate = new Date()
    expDate.setHours(expDate.getHours() + 1)
    cookies.set('access_token', res.data.access_token, {
      ...cookieOptions,
      expires: expDate
    })
    cookies.set('logout', false, cookieOptions)
    const refreshExpDate = new Date()
    refreshExpDate.setDate(refreshExpDate.getDate() + 30)
    cookies.set('refresh_token', res.data.refresh_token, {
      ...cookieOptions,
      expires: refreshExpDate
    })
    return { success: true, accessToken: res.data.access_token }
  } catch (error: any) {
    const axiosError = error as AxiosError<{ error_description?: string }>
    console.error(
      'Spotify token exchange error. Status:',
      axiosError.response?.status
    )
    console.error('Spotify error response data:', axiosError.response?.data)
    cookies.remove('verifier')
    const spotifyErrorDesc =
      axiosError.response?.data?.error_description ||
      axiosError.message ||
      'Token exchange failed'
    return { success: false, error: spotifyErrorDesc }
  }
}

export async function refreshAuth(): Promise<RefreshAuthResult> {
  // ... (Implementation remains the same as your last version, using cookieOptions) ...
  log('successSpotify', 'Attempting refreshAuth')
  const cookies = new Cookies(null, cookieOptions)
  const refresh_token = cookies.get('refresh_token')
  if (!refresh_token) {
    log('errorSpotify', 'refreshAuth failed: Refresh Token cookie is missing.')
    return { success: false, error: 'Missing refresh token' }
  }
  const postData = {
    client_id: SPOTIFY_CLIENT_ID,
    grant_type: 'refresh_token',
    refresh_token
  }
  const config = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }
  try {
    const res = await axios.post(
      `${SPOTIFY_ACCOUNTS_URL}/api/token`,
      qs.stringify(postData),
      config
    )
    log('successSpotify', 'Token refresh successful.')
    const newAccessToken = res.data.access_token
    const expDate = new Date()
    expDate.setHours(expDate.getHours() + 1)
    cookies.remove('access_token')
    cookies.set('access_token', newAccessToken, {
      ...cookieOptions,
      expires: expDate
    })
    if (res.data.refresh_token) {
      log('infoSpotify', 'Received new refresh token from Spotify.')
      const refreshExpDate = new Date()
      refreshExpDate.setDate(refreshExpDate.getDate() + 30)
      cookies.remove('refresh_token')
      cookies.set('refresh_token', res.data.refresh_token, {
        ...cookieOptions,
        expires: refreshExpDate
      })
    }
    cookies.set('logout', false, cookieOptions)
    return { success: true, newAccessToken }
  } catch (error: any) {
    const axiosError = error as AxiosError<{
      error?: string
      error_description?: string
    }>
    const status = axiosError.response?.status
    const spotifyError = axiosError.response?.data?.error
    const spotifyErrorDesc =
      axiosError.response?.data?.error_description ||
      axiosError.message ||
      'Token refresh failed'
    console.error('Spotify token refresh error. Status:', status)
    console.error('Spotify error response data:', axiosError.response?.data)
    if (status === 400 && spotifyError === 'invalid_grant') {
      log('errorSpotify', 'Refresh token is invalid or expired. Logging out.')
      logoutAuth()
      return { success: false, error: 'Invalid refresh token. Logged out.' }
    }
    return { success: false, error: spotifyErrorDesc }
  }
}

export function logoutAuth() {
  // ... (Implementation remains the same - simplified version) ...
  log('successSpotify', 'starting logoutAuth')
  const cookies = new Cookies(null, cookieOptions)
  cookies.remove('access_token')
  cookies.remove('refresh_token')
  cookies.remove('logout')
  cookies.remove('verifier')
  // log('infoSpotify', 'Spotify cookies cleared for logout.')
  return true
}

// --- Spotify API Wrappers ---

export async function spotifyMe(): Promise<SpotifyUser | string> {
  // Now uses the helper implicitly getting token from cookie
  return makeSpotifyApiRequest<SpotifyUser>('get', '/me')
}

export async function spotifyCurrentTime(): Promise<
  SpotifyPlayerState | string
> {
  const result = await makeSpotifyApiRequest<SpotifyPlayerState>(
    'get',
    '/me/player/currently-playing'
  )
  if (typeof result === 'string') return result
  // Check for empty response which might signify 204, although helper should handle it
  if (result == null) {
    log(
      'infoSpotify',
      'spotifyCurrentTime: No content playing (received empty response).'
    )
    return { is_playing: false } // Default not playing state
  }
  // Check if the result *looks* like a player state object
  if (typeof result === 'object' && 'is_playing' in result) {
    return result
  }
  // Fallback if the response wasn't an error string but also not a player state
  log(
    'warningSpotify',
    'spotifyCurrentTime: Received unexpected response format.',
    result
  )
  return { is_playing: false } // Default state
}

export async function spotifyGetDevices(): Promise<SpotifyDevices | string> {
  return makeSpotifyApiRequest<SpotifyDevices>('get', '/me/player/devices')
}

export async function spotifyPause(): Promise<SpotifySuccessOrError> {
  // PUT to /pause expects 204 No Content on success
  const result = await makeSpotifyApiRequest<void>('put', '/me/player/pause')
  // Helper returns 'Success' on 204, or error string
  return typeof result === 'string' ? result : 'Success'
}

export async function spotifyPlay(
  deviceId?: string
): Promise<SpotifySuccessOrError> {
  let endpoint: string
  const requestOptions: { data?: any } = {} // Use 'any' temporarily or define a broader type

  if (deviceId) {
    // API to transfer playback
    endpoint = '/me/player'
    // Use the specific type here
    const transferData: TransferPlaybackBody = {
      device_ids: [deviceId],
      play: true // Explicitly set play to true after transfer
    }
    requestOptions.data = transferData
  } else {
    // API to resume/start playback on current active device
    endpoint = '/me/player/play'
    // No request body needed to just resume playback on the current device
    requestOptions.data = undefined
  }

  // Use the helper, passing the correctly typed data (or undefined)
  const result = await makeSpotifyApiRequest<void>(
    'put',
    endpoint,
    requestOptions
  )
  return typeof result === 'string' ? result : 'Success'
}

export async function spotifyPlayOnly(
  deviceId: string
): Promise<SpotifySuccessOrError> {
  // This specific endpoint usage seems redundant if spotifyPlay covers transfer.
  // But keeping it if you use it elsewhere. PUT /me/player/play?device_id=...
  const result = await makeSpotifyApiRequest<void>('put', '/me/player/play', {
    params: { device_id: deviceId }
  })
  return typeof result === 'string' ? result : 'Success'
}

export async function spotifyPlaySong(
  deviceId: string,
  id: string, // Assuming this is track ID
  position_ms?: number,
  context?: string // Assuming this is context URI (album/playlist)
): Promise<SpotifySuccessOrError> {
  const body: {
    uris?: string[]
    context_uri?: string
    offset?: any
    position_ms?: number
  } = {}

  if (context) {
    // Play specific track within a context
    body.context_uri = context
    body.offset = { uri: `spotify:track:${id}` }
  } else {
    // Play specific track directly
    body.uris = [`spotify:track:${id}`]
  }
  body.position_ms = position_ms ?? 0

  // Use the standard /play endpoint with device_id in query params
  const result = await makeSpotifyApiRequest<void>('put', '/me/player/play', {
    params: { device_id: deviceId },
    data: body
  })

  // Specific error handling (optional, can be done in caller)
  if (typeof result === 'string' && result.includes('Restriction violated')) {
    log(
      'warningSpotify',
      'Playback restricted (Premium required, unavailable content, etc.)'
    )
    const showSnackbar = useStore.getState().ui.showSnackbar
    showSnackbar('error', 'Song or device not available/restricted')
    return 'Error: Playback restriction'
  }

  return typeof result === 'string' ? result : 'Success'
}

export async function spotifyRepeat(
  deviceId: string,
  mode: number
): Promise<SpotifySuccessOrError> {
  const state = mode === 0 ? 'context' : mode === 1 ? 'track' : 'off'
  const result = await makeSpotifyApiRequest<void>('put', '/me/player/repeat', {
    params: { state, device_id: deviceId }
  })
  return typeof result === 'string' ? result : 'Success'
}

export async function spotifyShuffle(
  deviceId: string,
  state: boolean
): Promise<SpotifySuccessOrError> {
  const result = await makeSpotifyApiRequest<void>(
    'put',
    '/me/player/shuffle',
    {
      params: { state, device_id: deviceId }
    }
  )
  return typeof result === 'string' ? result : 'Success'
}

// --- Other API Wrappers ---
// Updated to use the helper where appropriate (passing token explicitly)

export async function getTrackFeatures(
  id: string,
  token: string
): Promise<any | string> {
  if (!token) return 'Error: Missing token argument'
  return makeSpotifyApiRequest<any>('get', `/audio-features/${id}`, { token })
}

export async function getTrackArtist(
  id: string,
  token: string
): Promise<any | string> {
  if (!token) return 'Error: Missing token argument'
  return makeSpotifyApiRequest<any>('get', `/artists/${id}`, { token })
}

export async function getTrackAnalysis(
  id: string,
  token: string
): Promise<any | string> {
  if (!token) return 'Error: Missing token argument'
  return makeSpotifyApiRequest<any>('get', `/audio-analysis/${id}`, { token })
}

export async function getPlaylist(
  id: string,
  token: string
): Promise<any | string> {
  if (!token) return 'Error: Missing token argument'
  // Note: Returns Paging Object<PlaylistTrackObject>, define types if needed
  return makeSpotifyApiRequest<any>('get', `/playlists/${id}/tracks`, { token })
}

export async function getPlaylistB(
  id: string,
  token: string
): Promise<any | string> {
  if (!token) return 'Error: Missing token argument'
  // Note: Returns PlaylistObject, define types if needed
  return makeSpotifyApiRequest<any>('get', `/playlists/${id}`, { token })
}

// --- Local Backend API Calls ---

export async function addTrigger(trigger: any): Promise<SpotifySuccessOrError> {
  // ... (Implementation remains the same) ...
  const backendUrl = storedURL || baseURL
  try {
    const res = await axios.post(
      `${backendUrl}/api/integrations/spotify/spotify`,
      trigger
    )
    if (res.status === 200 || res.status === 201) {
      return 'Success'
    } else {
      return `Error: Backend responded with status ${res.status}`
    }
  } catch (error: any) {
    console.error(
      'Error calling local backend addTrigger:',
      error.response?.data || error.message
    )
    return `Error communicating with backend: ${error.message}`
  }
}

// --- Utility Functions ---

export function fixAnalysis(audioAnalysis: any) {
  // ... (Implementation remains the same) ...
  const new_analysis = { ...audioAnalysis }
  new_analysis.segments = []
  if (audioAnalysis?.segments) {
    audioAnalysis.segments.forEach((segment: any) => {
      const new_segment = { ...segment }
      new_segment.start = parseFloat(segment.start.toFixed(2))
      new_segment.pitches = []
      let pitchTotal = 0
      // console.log(segment.pitches); // Reduce logging noise?
      segment.pitches.forEach((pitch: number) => {
        //   console.log(pitch);
        pitchTotal += pitch
      })
      // Avoid division by zero if pitchTotal is 0
      if (pitchTotal > 0) {
        segment.pitches.forEach((pitch: number) => {
          const new_pitch = (pitch / pitchTotal) * 100
          new_segment.pitches.push(new_pitch)
        })
      } else {
        // Handle case with zero pitch total (e.g., copy original pitches or set to zero)
        new_segment.pitches = [...segment.pitches] // Example: copy original
      }
      new_analysis.segments.push(new_segment)
    })
  }
  return new_analysis
}
