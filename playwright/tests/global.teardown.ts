import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PIDS_FILE = path.join(__dirname, '..', '.pids.json')
const PWTEST_CONFIG = path.resolve(__dirname, '..', '..', '..', 'backend', 'pwtest')

/** Kill a process tree (cross-platform) */
function killTree(pid: number | undefined, label: string) {
  if (!pid) return
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /PID ${pid} /T /F`, { stdio: 'ignore' })
    } else {
      // On macOS/Linux: kill the entire process group
      try {
        // Get the process group ID and kill all processes in it
        const pgid = execSync(`ps -o pgid= -p ${pid}`, { stdio: ['ignore', 'pipe', 'ignore'] })
          .toString()
          .trim()
        if (pgid) {
          execSync(`kill -9 -- -${pgid}`, { stdio: 'ignore' })
        }
      } catch {
        // Fallback: kill children then the process itself
        try {
          execSync(`pkill -KILL -P ${pid}`, { stdio: 'ignore' })
        } catch {
          /* no children */
        }
        process.kill(pid, 'SIGKILL')
      }
    }
    console.log(`[global teardown] Killed ${label} (PID ${pid})`)
  } catch {
    console.log(`[global teardown] ${label} (PID ${pid}) was already gone`)
  }
}

async function globalTeardown() {
  console.log('\n[global teardown] Stopping backend + frontend...\n')

  if (fs.existsSync(PIDS_FILE)) {
    const { backendPid, frontendPid } = JSON.parse(fs.readFileSync(PIDS_FILE, 'utf-8'))
    killTree(frontendPid, 'frontend')
    killTree(backendPid, 'backend')
    fs.unlinkSync(PIDS_FILE)
  } else {
    console.log('[global teardown] No .pids.json found — nothing to kill')
  }

  if (fs.existsSync(PWTEST_CONFIG)) {
    await new Promise((resolve) => setTimeout(resolve, 5000)) // wait for backend to flush state
    fs.rmSync(PWTEST_CONFIG, { recursive: true, force: true })
    console.log('[global teardown] Deleted pwtest/ config folder')
  }

  console.log('[global teardown] Done.\n')
}

export default globalTeardown
