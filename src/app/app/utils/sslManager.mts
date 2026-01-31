/* eslint-disable @typescript-eslint/no-explicit-any */
import { app } from 'electron'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'
import os from 'os'

const execAsync = promisify(exec)

/**
 * Get the SSL directory path where certificates are stored
 */
export const getSslDirectory = (): string => {
  const appData = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming')
  return path.join(appData, '.ledfx', 'ssl')
}

/**
 * Get the path to the enable SSL PowerShell script in extraResources
 */
export const getEnableSslScriptPath = (): string => {
  const isDev = !app.isPackaged
  if (isDev) {
    // In dev, reference the extraResources folder in frontend
    return path.join(process.cwd(), 'extraResources', 'enable_ledfx_ssl.ps1')
  }
  return path.join(process.resourcesPath, 'extraResources', 'enable_ledfx_ssl.ps1')
}

/**
 * Get the path to the disable SSL PowerShell script in extraResources
 */
export const getDisableSslScriptPath = (): string => {
  const isDev = !app.isPackaged
  if (isDev) {
    // In dev, reference the extraResources folder in frontend
    return path.join(process.cwd(), 'extraResources', 'disable_ledfx_ssl.ps1')
  }
  return path.join(process.resourcesPath, 'extraResources', 'disable_ledfx_ssl.ps1')
}

/**
 * Check if SSL certificates are currently installed
 */
export const isSslInstalled = async (): Promise<boolean> => {
  if (process.platform !== 'win32') {
    return false // Only Windows for now
  }

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
  if (process.platform !== 'win32') {
    return false
  }

  try {
    const hostsPath = 'C:\\Windows\\System32\\drivers\\etc\\hosts'
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
 * Enable SSL by running PowerShell script with elevation
 */
export const enableSsl = async (): Promise<{ success: boolean; message: string }> => {
  if (process.platform !== 'win32') {
    return { success: false, message: 'SSL setup is only available on Windows' }
  }

  const scriptPath = getEnableSslScriptPath()

  // Check if script exists
  try {
    await fs.promises.access(scriptPath, fs.constants.F_OK)
  } catch {
    return { success: false, message: `Script not found: ${scriptPath}` }
  }

  try {
    // Run PowerShell with elevation - remove -WindowStyle Hidden from inner arguments
    // because it conflicts with UAC elevation
    const command = `powershell -Command "Start-Process powershell -Verb RunAs -ArgumentList '-ExecutionPolicy Bypass -NoProfile -File \\"${scriptPath}\\"' -Wait"`

    console.log('Executing SSL enable script with elevation...')
    console.log('Command:', command)
    const { stdout, stderr } = await execAsync(command, {
      timeout: 60000, // 60 second timeout
      windowsHide: true
    })

    if (stderr) {
      console.error('SSL enable stderr:', stderr)
    }

    if (stdout) {
      console.log('SSL enable stdout:', stdout)
    }

    // Give Windows time to complete file operations and certificate store updates
    await new Promise((resolve) => setTimeout(resolve, 2000))

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

    // Check if timeout
    if (error.killed && error.signal === 'SIGTERM') {
      return { success: false, message: 'SSL installation timed out after 60 seconds' }
    }

    return { success: false, message: error.message || 'Failed to enable SSL' }
  }
}

/**
 * Disable SSL by running PowerShell script with elevation
 */
export const disableSsl = async (): Promise<{ success: boolean; message: string }> => {
  if (process.platform !== 'win32') {
    return { success: false, message: 'SSL cleanup is only available on Windows' }
  }

  const scriptPath = getDisableSslScriptPath()

  try {
    await fs.promises.access(scriptPath, fs.constants.F_OK)
  } catch {
    return { success: false, message: `Script not found: ${scriptPath}` }
  }

  try {
    const command = `powershell -Command "Start-Process powershell -Verb RunAs -ArgumentList '-ExecutionPolicy Bypass -NoProfile -WindowStyle Hidden -File \\"${scriptPath}\\"' -Wait -WindowStyle Hidden"`

    console.log('Executing SSL disable script with elevation...')
    await execAsync(command, {
      timeout: 30000,
      windowsHide: true
    })

    // Give Windows a moment to complete file operations
    await new Promise((resolve) => setTimeout(resolve, 500))

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
      return { success: false, message: 'SSL cleanup timed out after 30 seconds' }
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
