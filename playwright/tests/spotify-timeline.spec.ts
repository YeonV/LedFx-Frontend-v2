import { readFileSync } from 'node:fs'
import { test, expect } from '@playwright/test'

const schemas = JSON.parse(
  readFileSync(
    new URL('../../src/components/SchemaForm/schemas.fixture.json', import.meta.url),
    'utf8'
  )
)
const positions = [
  5000, 15000, 25000, 26000, 45000, 65000, 95000, 125000, 155000, 165000, 205000, 245000
]
const trackId = 'A'.repeat(22)
const sceneName = (index: number) =>
  `Example track - A very long scene name for truncation ${index}`

for (const width of [640, 1280]) {
  test(`Spotify cue names do not overlap at ${width}px`, async ({ page, context, baseURL }) => {
    if (!baseURL) throw new Error('A frontend baseURL is required')
    await page.setViewportSize({ width, height: 900 })
    await context.addCookies([{ name: 'access_token', value: 'mock-access-token', url: baseURL }])
    await page.addInitScript(() => {
      localStorage.setItem('ledfx-host', 'http://ledfx.test')
      Object.defineProperty(window, 'Spotify', { value: {}, configurable: true })
    })
    await page.routeWebSocket('**/*', (socket) => socket.close())
    let progress = 0
    let currentTrack = trackId
    const data = Object.fromEntries(
      positions.map((position, index) => [
        `scene-${index}`,
        { name: sceneName(index), [`${trackId}-${position}`]: [trackId, 'Example track', position] }
      ])
    )
    await page.route('**/api/**', (route) => {
      const path = new URL(route.request().url()).pathname
      let body: object = { status: 'success' }
      if (route.request().method() === 'GET') {
        if (path === '/api/schemas') body = schemas
        else if (path === '/api/info')
          body = { name: 'LedFx Controller', version: '2.2.0', features: {} }
        else if (path === '/api/config')
          body = {
            host: '127.0.0.1',
            audio: {},
            user_colors: {},
            user_gradients: {},
            user_presets: {},
            melbanks: {},
            wled_preferences: {}
          }
        else if (path === '/api/integrations')
          body = {
            integrations: {
              spotify: {
                id: 'spotify',
                type: 'spotify',
                active: true,
                status: 1,
                data,
                config: { name: 'Spotify', description: 'Example integration' }
              }
            }
          }
        else if (path === '/api/virtuals') body = { virtuals: {}, paused: false }
        else if (path === '/api/devices') body = { devices: {} }
        else if (path === '/api/scenes') body = { scenes: {} }
        else if (path === '/api/colors') body = { colors: {}, gradients: {} }
      }
      return route.fulfill({ json: body })
    })
    await page.route('https://api.spotify.com/**', (route) => {
      const path = new URL(route.request().url()).pathname
      const image = {
        url: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
      }
      const device = {
        id: 'example-device',
        name: 'Example player',
        type: 'Computer',
        is_active: true,
        volume_percent: 50
      }
      let body: object = { items: [] }
      if (path === '/v1/me') body = { display_name: 'Example user', images: [image] }
      else if (path === '/v1/me/player/devices') body = { devices: [device] }
      else if (path === '/v1/me/player/currently-playing')
        body = {
          progress_ms: progress,
          is_playing: true,
          device,
          item: {
            id: currentTrack,
            name: 'Example track',
            duration_ms: 300000,
            artists: [{ name: 'Example artist' }],
            album: { name: 'Example album', images: [image] }
          }
        }
      return route.fulfill({ json: body })
    })
    await page.goto('/#/integrations')
    const skip = page.getByRole('button', { name: 'Skip', exact: true })
    if (await skip.isVisible()) await skip.click()
    await page.locator('.spotifyFab button').click()
    const slider = page.getByRole('slider', { name: 'time-indicator' })
    await expect(slider).toBeVisible()
    const caption = page.getByText(/^(Scene|Next scene): Example track/)
    await expect(caption).toHaveText(`Next scene: ${sceneName(0)}`)

    progress = 173000
    await expect(caption).toHaveText(`Scene: ${sceneName(9)}`)
    await expect(page.locator('.MuiSlider-markLabel')).toHaveCount(0)
    await expect(page.locator('.MuiSlider-mark')).toHaveCount(positions.length)
    const geometry = await caption.evaluate((element) => {
      const text = element.getBoundingClientRect()
      const parent = element.parentElement!.getBoundingClientRect()
      const slider = element
        .parentElement!.querySelector('.MuiSlider-root')!
        .getBoundingClientRect()
      return {
        left: text.left,
        right: text.right,
        top: text.top,
        sliderBottom: slider.bottom,
        parentLeft: parent.left,
        parentRight: parent.right,
        ellipsis: getComputedStyle(element).textOverflow
      }
    })
    expect(geometry.left).toBeGreaterThanOrEqual(geometry.parentLeft)
    expect(geometry.right).toBeLessThanOrEqual(geometry.parentRight)
    expect(geometry.top).toBeGreaterThanOrEqual(geometry.sliderBottom)
    expect(geometry.ellipsis).toBe('ellipsis')
    await page.screenshot({ path: `test-results/spotify-timeline-${width}.png` })

    await page.locator('.MuiSlider-mark').nth(3).click()
    await expect
      .poll(async () => Math.abs(Number(await slider.inputValue()) - positions[3]), {
        timeout: 800
      })
      .toBeLessThan(1000)

    progress = 0
    await expect(caption).toHaveText(`Next scene: ${sceneName(0)}`)
    currentTrack = 'B'.repeat(22)
    await expect(caption).toHaveCount(0)
    await expect(page.locator('.MuiSlider-mark')).toHaveCount(0)
  })
}
