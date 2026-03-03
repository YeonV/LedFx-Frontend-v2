import { spawn } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PIDS_FILE = path.join(__dirname, '..', '.pids.json')
const BACKEND_DIR = path.resolve(__dirname, '..', '..', '..', 'backend')
const FRONTEND_DIR = path.resolve(__dirname, '..', '..')

/** Poll backend until /api/info responds with a name containing 'LedFx' */
async function waitForBackend(timeoutMs = 60000): Promise<void> {
  const url = 'http://localhost:7777/api/info'
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url)
      if (res.ok) {
        const json = (await res.json()) as { name?: string }
        if (json.name?.includes('LedFx')) return
        console.warn(`[global setup] Backend responded but name="${json.name}" — retrying...`)
      }
    } catch {
      // not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  throw new Error('Timed out waiting for backend (LedFx /api/info)')
}

/** Poll frontend until /manifest.json responds with a name containing 'LedFx' */
async function waitForFrontend(timeoutMs = 60000): Promise<void> {
  const url = 'http://localhost:2000/manifest.json'
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url)
      if (res.ok) {
        const json = (await res.json()) as { name?: string }
        if (json.name?.includes('LedFx')) return
        console.warn(`[global setup] Frontend responded but name="${json.name}" — retrying...`)
      }
    } catch {
      // not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  throw new Error('Timed out waiting for frontend (LedFx /manifest.json)')
}

async function globalSetup() {
  console.log('\n[global setup] Starting isolated backend + frontend...\n')

  // --- Backend ---
  const backend = spawn('uv', ['run', 'ledfx', '--offline', '-vv', '-p', '7777', '-c', 'pwtest'], {
    cwd: BACKEND_DIR,
    shell: true,
    stdio: 'inherit',
    detached: false
  })
  console.log(`[global setup] Backend PID: ${backend.pid}`)

  console.log('[global setup] Waiting for backend on :7777...')
  await waitForBackend()
  console.log('[global setup] Backend ready (LedFx confirmed).')
  await new Promise((resolve) => setTimeout(resolve, 2000)) // extra settle time for backend

  // --- Frontend ---
  const frontend = spawn('yarn', ['start'], {
    cwd: FRONTEND_DIR,
    shell: true,
    stdio: 'inherit',
    detached: false,
    env: { ...process.env, PORT: '2000', BROWSER: 'none' }
  })
  console.log(`[global setup] Frontend PID: ${frontend.pid}`)

  // Persist PIDs so teardown can kill them
  fs.writeFileSync(
    PIDS_FILE,
    JSON.stringify({ backendPid: backend.pid, frontendPid: frontend.pid })
  )

  console.log('[global setup] Waiting for frontend on :2000...')
  await waitForFrontend()
  console.log('[global setup] Frontend ready (LedFx confirmed).\n')
}

export default globalSetup
