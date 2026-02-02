/* eslint-disable @typescript-eslint/no-explicit-any */
import { app } from 'electron'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'
import os from 'os'
import sudo from 'sudo-prompt'

const execAsync = promisify(exec)
const sudoExec = (command: string, options: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    sudo.exec(command, options, (error: any, stdout: any, stderr: any) => {
      if (error) {
        reject(error)
      } else {
        resolve({ stdout, stderr })
      }
    })
  })
}

/**
 * Get the SSL directory path where certificates are stored
 */
export const getSslDirectory = (): string => {
  if (process.platform === 'win32') {
    const appData = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming')
    return path.join(appData, '.ledfx', 'ssl')
  } else {
    return path.join(os.homedir(), '.ledfx', 'ssl')
  }
}

/**
 * Get the path to the enable SSL script in extraResources
 */
export const getEnableSslScriptPath = (): string => {
  const isDev = !app.isPackaged
  const platform = process.platform

  let scriptName: string
  if (platform === 'win32') {
    scriptName = 'enable_ledfx_ssl.ps1'
  } else if (platform === 'darwin') {
    scriptName = 'enable_ledfx_ssl_mac.sh'
  } else {
    scriptName = 'enable_ledfx_ssl_linux.sh'
  }

  if (isDev) {
    return path.join(process.cwd(), 'extraResources', scriptName)
  }
  return path.join(process.resourcesPath, 'extraResources', scriptName)
}

/**
 * Get the path to the disable SSL script in extraResources
 */
export const getDisableSslScriptPath = (): string => {
  const isDev = !app.isPackaged
  const platform = process.platform

  let scriptName: string
  if (platform === 'win32') {
    scriptName = 'disable_ledfx_ssl.ps1'
  } else if (platform === 'darwin') {
    scriptName = 'disable_ledfx_ssl_mac.sh'
  } else {
    scriptName = 'disable_ledfx_ssl_linux.sh'
  }

  if (isDev) {
    return path.join(process.cwd(), 'extraResources', scriptName)
  }
  return path.join(process.resourcesPath, 'extraResources', scriptName)
}

/**
 * Check if SSL certificates are currently installed
 */
export const isSslInstalled = async (): Promise<boolean> => {
  const sslDir = getSslDirectory()
  const fullchainPath = path.join(sslDir, 'fullchain.pem')
  const privkeyPath = path.join(sslDir, 'privkey.pem')

  try {
    await fs.promises.access(fullchainPath, fs.constants.F_OK)
    await fs.promises.access(privkeyPath, fs.constants.F_OK)
    console.log('SSL certificates found at:', sslDir)
    return true
  } catch (error: any) {
    console.log('SSL certificates not found:', error.code, 'Path:', sslDir)
    return false
  }
}

/**
 * Check if hosts file contains ledfx.local entry
 */
export const isHostsFileConfigured = async (): Promise<boolean> => {
  try {
    const hostsPath =
      process.platform === 'win32' ? 'C:\\Windows\\System32\\drivers\\etc\\hosts' : '/etc/hosts'

    const content = await fs.promises.readFile(hostsPath, 'utf-8')
    const hasEntry = /ledfx\.local/i.test(content)
    console.log('Hosts file check:', hasEntry ? 'ledfx.local found' : 'ledfx.local NOT found')
    return hasEntry
  } catch (error: any) {
    console.error('Hosts file read error:', error.code || error.message)
    return false
  }
}

/**
 * Enable SSL - cross-platform implementation
 */
export const enableSsl = async (): Promise<{ success: boolean; message: string }> => {
  const scriptPath = getEnableSslScriptPath()

  // Check if script exists
  try {
    await fs.promises.access(scriptPath, fs.constants.F_OK)
  } catch {
    return { success: false, message: `Script not found: ${scriptPath}` }
  }

  try {
    if (process.platform === 'win32') {
      // Windows: Use PowerShell with UAC elevation
      const command = `powershell -Command "Start-Process powershell -Verb RunAs -ArgumentList '-ExecutionPolicy Bypass -NoProfile -File \\"${scriptPath}\\"' -Wait"`

      console.log('Executing SSL enable script with elevation...')
      console.log('Command:', command)
      const { stdout, stderr } = await execAsync(command, {
        timeout: 60000,
        windowsHide: true
      })

      if (stderr) {
        console.error('SSL enable stderr:', stderr)
      }

      if (stdout) {
        console.log('SSL enable stdout:', stdout)
      }

      await new Promise((resolve) => setTimeout(resolve, 2000))
    } else if (process.platform === 'darwin') {
      // macOS: Two-step process to allow GUI authorization
      console.log('Executing SSL enable script (macOS two-step process)...')

      // Make script executable
      await execAsync(`chmod +x "${scriptPath}"`)

      // Step 1: Generate certs and add to keychain (will show GUI password prompt)
      // Run without sudo so the security command can show its GUI dialog
      try {
        const { stdout, stderr } = await execAsync(`"${scriptPath}"`, {
          timeout: 60000
        })

        if (stderr && !stderr.includes('password') && !stderr.includes('authorization')) {
          console.warn('SSL enable stderr:', stderr)
        }
        if (stdout) {
          console.log('SSL enable stdout:', stdout)
        }
      } catch (error: any) {
        // If script fails, it might be because it tried to modify /etc/hosts without sudo
        // Check if certificates were at least created
        const certsExist = await isSslInstalled()
        if (!certsExist) {
          throw error // Real failure
        }
        console.log('Certificates created, continuing to hosts file step...')
      }

      // Step 2: Modify hosts file with sudo (only if needed)
      const hostsAlreadyConfigured = await isHostsFileConfigured()
      if (!hostsAlreadyConfigured) {
        console.log('Adding ledfx.local to hosts file...')
        await sudoExec(
          `bash -c 'grep -q "ledfx.local" /etc/hosts || echo "127.0.0.1 ledfx.local" >> /etc/hosts'`,
          {
            name: 'LedFx Hosts File'
          }
        )
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))
    } else {
      // Linux: Use sudo-prompt
      console.log('Executing SSL enable script with sudo...')

      // Make script executable
      await execAsync(`chmod +x "${scriptPath}"`)

      await sudoExec(`"${scriptPath}"`, { name: 'LedFx SSL Setup' })

      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    // Verify installation
    console.log('Verifying SSL installation...')
    const installed = await isSslInstalled()
    const hostsConfigured = await isHostsFileConfigured()
    console.log('Verification results - installed:', installed, 'hosts:', hostsConfigured)

    if (installed && hostsConfigured) {
      return { success: true, message: 'SSL certificates installed successfully' }
    } else if (!installed && !hostsConfigured) {
      return {
        success: false,
        message: 'SSL script completed but no changes detected'
      }
    } else if (installed && !hostsConfigured) {
      return {
        success: false,
        message: 'Certificates installed but hosts file not updated (may need manual admin access)'
      }
    } else {
      return {
        success: false,
        message: 'Hosts configured but certificates not found'
      }
    }
  } catch (error: any) {
    console.error('SSL enable error:', error)

    if (error.killed && error.signal === 'SIGTERM') {
      return { success: false, message: 'SSL installation timed out' }
    }

    return { success: false, message: error.message || 'Failed to enable SSL' }
  }
}

/**
 * Disable SSL - cross-platform implementation
 */
export const disableSsl = async (): Promise<{ success: boolean; message: string }> => {
  const scriptPath = getDisableSslScriptPath()

  try {
    await fs.promises.access(scriptPath, fs.constants.F_OK)
  } catch {
    return { success: false, message: `Script not found: ${scriptPath}` }
  }

  try {
    if (process.platform === 'win32') {
      // Windows: Use PowerShell with UAC elevation
      const command = `powershell -Command "Start-Process powershell -Verb RunAs -ArgumentList '-ExecutionPolicy Bypass -NoProfile -File \\"${scriptPath}\\"' -Wait"`

      console.log('Executing SSL disable script with elevation...')
      await execAsync(command, {
        timeout: 30000,
        windowsHide: true
      })

      await new Promise((resolve) => setTimeout(resolve, 500))
    } else {
      // macOS/Linux: Use sudo-prompt
      console.log('Executing SSL disable script with sudo...')

      // Make script executable
      await execAsync(`chmod +x "${scriptPath}"`)

      await sudoExec(`"${scriptPath}"`, { name: 'LedFx SSL Cleanup' })

      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    // Verify removal
    const installed = await isSslInstalled()
    if (!installed) {
      return { success: true, message: 'SSL certificates removed successfully' }
    } else {
      return { success: false, message: 'SSL cleanup completed but certificates still detected' }
    }
  } catch (error: any) {
    console.error('SSL disable error:', error)

    if (error.killed && error.signal === 'SIGTERM') {
      return { success: false, message: 'SSL cleanup timed out' }
    }

    return { success: false, message: error.message || 'Failed to disable SSL' }
  }
}

/**
 * Get SSL status information
 */
export const getSslStatus = async (): Promise<{
  installed: boolean
  hostsConfigured: boolean
  platform: string
  sslDirectory: string
}> => {
  return {
    installed: await isSslInstalled(),
    hostsConfigured: await isHostsFileConfigured(),
    platform: process.platform,
    sslDirectory: getSslDirectory()
  }
}
