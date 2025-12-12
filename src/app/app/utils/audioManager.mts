/* eslint-disable @typescript-eslint/no-explicit-any */
import { app } from 'electron'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'

/**
 * Get the path to audio_manager executable in extraResources
 */
export const getAudioManagerPath = (): string => {
  const isDev = !app.isPackaged
  if (isDev) {
    return path.join(process.cwd(), 'extraResources', 'audio_manager')
  }
  return path.join(process.resourcesPath, 'extraResources', 'audio_manager')
}

/**
 * Check if audio_manager exists
 */
export const audioManagerExists = async (): Promise<boolean> => {
  const managerPath = getAudioManagerPath()
  return fs.promises
    .access(managerPath, fs.constants.X_OK)
    .then(() => true)
    .catch(() => false)
}

/**
 * Execute audio_manager command
 */
const executeAudioManager = (
  args: string[]
): Promise<{ success: boolean; output: string; error?: string }> => {
  return new Promise((resolve) => {
    const managerPath = getAudioManagerPath()

    const process = spawn(managerPath, args, {
      stdio: ['ignore', 'pipe', 'pipe']
    })

    let stdout = ''
    let stderr = ''

    process.stdout?.on('data', (data) => {
      stdout += data.toString()
    })

    process.stderr?.on('data', (data) => {
      stderr += data.toString()
    })

    process.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, output: stdout })
      } else {
        resolve({
          success: false,
          output: stdout,
          error: stderr || `Process exited with code ${code}`
        })
      }
    })

    process.on('error', (error) => {
      resolve({
        success: false,
        output: '',
        error: error.message
      })
    })
  })
}

/**
 * Enable LedFx audio device
 * Command: audio_manager enable "LedFx"
 */
export const enableAudioDevice = async (): Promise<{
  success: boolean
  message: string
  output?: string
}> => {
  try {
    const exists = await audioManagerExists()
    if (!exists) {
      return {
        success: false,
        message: '❌ audio_manager executable not found'
      }
    }

    const result = await executeAudioManager(['enable', 'LedFx'])

    return {
      success: result.success,
      message: result.success
        ? '✅ LedFx audio device enabled successfully'
        : result.error || '❌ Failed to enable LedFx audio device',
      output: result.output
    }
  } catch (error: any) {
    console.error('Error enabling audio device:', error)
    return {
      success: false,
      message: `❌ Error: ${error.message || error}`
    }
  }
}

/**
 * Disable audio device
 * Command: audio_manager disable
 */
export const disableAudioDevice = async (): Promise<{
  success: boolean
  message: string
  output?: string
}> => {
  try {
    const exists = await audioManagerExists()
    if (!exists) {
      return {
        success: false,
        message: '❌ audio_manager executable not found'
      }
    }

    const result = await executeAudioManager(['disable'])

    return {
      success: result.success,
      message: result.success
        ? '✅ Audio device disabled successfully'
        : result.error || '❌ Failed to disable audio device',
      output: result.output
    }
  } catch (error: any) {
    console.error('Error disabling audio device:', error)
    return {
      success: false,
      message: `❌ Error: ${error.message || error}`
    }
  }
}

/**
 * Get audio_manager status and info
 */
export const getAudioManagerStatus = async (): Promise<{
  exists: boolean
  path: string
  executable: boolean
}> => {
  const managerPath = getAudioManagerPath()
  const exists = await audioManagerExists()

  return {
    exists,
    path: managerPath,
    executable: exists
  }
}

/**
 * Get current volume
 * Command: audio_manager volume get
 */
export const getVolume = async (): Promise<{
  success: boolean
  volume?: number
  message: string
}> => {
  try {
    const exists = await audioManagerExists()
    if (!exists) {
      return { success: false, message: '❌ audio_manager executable not found' }
    }

    const result = await executeAudioManager(['volume', 'get'])

    if (result.success) {
      const volume = parseInt(result.output.trim())
      return {
        success: true,
        volume: isNaN(volume) ? 50 : volume,
        message: '✅ Volume retrieved'
      }
    }

    return { success: false, message: result.error || '❌ Failed to get volume' }
  } catch (error: any) {
    return { success: false, message: `❌ Error: ${error.message || error}` }
  }
}

/**
 * Set volume
 * Command: audio_manager volume set <0-100>
 */
export const setVolume = async (volume: number): Promise<{ success: boolean; message: string }> => {
  try {
    const exists = await audioManagerExists()
    if (!exists) {
      return { success: false, message: '❌ audio_manager executable not found' }
    }

    const clampedVolume = Math.max(0, Math.min(100, Math.round(volume)))
    const result = await executeAudioManager(['volume', 'set', clampedVolume.toString()])

    return {
      success: result.success,
      message: result.success
        ? `✅ Volume set to ${clampedVolume}%`
        : result.error || '❌ Failed to set volume'
    }
  } catch (error: any) {
    return { success: false, message: `❌ Error: ${error.message || error}` }
  }
}

/**
 * Increase volume
 * Command: audio_manager volume up
 */
export const volumeUp = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const exists = await audioManagerExists()
    if (!exists) {
      return { success: false, message: '❌ audio_manager executable not found' }
    }

    const result = await executeAudioManager(['volume', 'up'])

    return {
      success: result.success,
      message: result.success
        ? '✅ Volume increased'
        : result.error || '❌ Failed to increase volume'
    }
  } catch (error: any) {
    return { success: false, message: `❌ Error: ${error.message || error}` }
  }
}

/**
 * Decrease volume
 * Command: audio_manager volume down
 */
export const volumeDown = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const exists = await audioManagerExists()
    if (!exists) {
      return { success: false, message: '❌ audio_manager executable not found' }
    }

    const result = await executeAudioManager(['volume', 'down'])

    return {
      success: result.success,
      message: result.success
        ? '✅ Volume decreased'
        : result.error || '❌ Failed to decrease volume'
    }
  } catch (error: any) {
    return { success: false, message: `❌ Error: ${error.message || error}` }
  }
}

/**
 * Toggle mute
 * Command: audio_manager mute toggle
 */
export const toggleMute = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const exists = await audioManagerExists()
    if (!exists) {
      return { success: false, message: '❌ audio_manager executable not found' }
    }

    const result = await executeAudioManager(['mute', 'toggle'])

    return {
      success: result.success,
      message: result.success ? '✅ Mute toggled' : result.error || '❌ Failed to toggle mute'
    }
  } catch (error: any) {
    return { success: false, message: `❌ Error: ${error.message || error}` }
  }
}
