/* eslint-disable @typescript-eslint/no-explicit-any */
import { app } from 'electron'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'
import sudo from 'sudo-prompt'
import { getAudioManagerPath } from './audioManager.mjs'

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

const DRIVER_NAME = 'LedFx.driver'
const SYSTEM_EXTENSIONS_PATH = '/Library/Audio/Plug-Ins/HAL'

/**
 * Get the path to the driver in extraResources
 */
export const getDriverResourcePath = (): string => {
  const isDev = !app.isPackaged
  if (isDev) {
    return path.join(process.cwd(), 'extraResources', DRIVER_NAME)
  }
  return path.join(process.resourcesPath, 'extraResources', DRIVER_NAME)
}

/**
 * Get the system installation path for the driver
 */
export const getDriverInstallPath = (): string => {
  return path.join(SYSTEM_EXTENSIONS_PATH, DRIVER_NAME)
}

/**
 * Check if the driver is currently installed
 */
export const isDriverInstalled = async (): Promise<boolean> => {
  const installPath = getDriverInstallPath()
  return fs.promises
    .access(installPath, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false)
}

/**
 * Get driver status information
 */
export const getDriverStatus = async (): Promise<{
  installed: boolean
  path?: string
  resourcePath: string
}> => {
  const installed = await isDriverInstalled()
  const resourcePath = getDriverResourcePath()

  return {
    installed,
    path: installed ? getDriverInstallPath() : undefined,
    resourcePath
  }
}

/**
 * Install the LedFx audio driver
 * Requires admin privileges - will prompt for password
 */
export const installDriver = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const sourcePath = getDriverResourcePath()
    const destPath = getDriverInstallPath()

    // Check if source exists
    const sourceExists = await fs.promises
      .access(sourcePath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false)

    if (!sourceExists) {
      return {
        success: false,
        message: `❌ Error: Driver not found at ${sourcePath}`
      }
    }

    // Check if already installed
    const alreadyInstalled = await isDriverInstalled()

    // Combine all operations into a single sudo command (only one password prompt)
    console.log(`Installing ${DRIVER_NAME} to ${SYSTEM_EXTENSIONS_PATH}...`)
    const audioManagerPath = getAudioManagerPath()

    // Build command: remove existing if present, install new, restart CoreAudio, enable audio device
    let combinedCmd = ''
    if (alreadyInstalled) {
      console.log('Removing existing driver first...')
      combinedCmd = `rm -rf "${destPath}" && `
    }
    combinedCmd += `cp -R "${sourcePath}" "${destPath}" && killall -9 coreaudiod && sleep 2 && "${audioManagerPath}" enable LedFx`

    await sudoExec(combinedCmd, { name: 'LedFx Driver Installation' })

    return {
      success: true,
      message: '✅ Driver installed successfully\nCheck Audio MIDI Setup to see the driver'
    }
  } catch (error: any) {
    console.error('Driver installation error:', error)
    return {
      success: false,
      message: `❌ Installation failed: ${error.message || error}`
    }
  }
}

/**
 * Uninstall the LedFx audio driver
 * Requires admin privileges - will prompt for password
 */
export const uninstallDriver = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const destPath = getDriverInstallPath()

    // Check if installed
    const installed = await isDriverInstalled()
    if (!installed) {
      return {
        success: true,
        message: 'Driver is not installed'
      }
    }

    // Disable audio device and remove driver with sudo (single password prompt)
    console.log(`Removing ${DRIVER_NAME}...`)
    const audioManagerPath = getAudioManagerPath()
    const combinedCmd = `"${audioManagerPath}" disable && rm -rf "${destPath}" && killall -9 coreaudiod`
    await sudoExec(combinedCmd, { name: 'LedFx Driver Uninstallation' })

    return {
      success: true,
      message: '✅ Driver uninstalled successfully'
    }
  } catch (error: any) {
    console.error('Driver uninstallation error:', error)
    return {
      success: false,
      message: `❌ Uninstallation failed: ${error.message || error}`
    }
  }
}

/**
 * List all audio devices to verify driver installation
 */
export const listAudioDevices = async (): Promise<string> => {
  try {
    const { stdout } = await execAsync('system_profiler SPAudioDataType')
    return stdout
  } catch (error: any) {
    console.error('Error listing audio devices:', error)
    return ''
  }
}
