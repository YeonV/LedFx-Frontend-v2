/* eslint-disable @typescript-eslint/no-explicit-any */
import { app, shell, BrowserWindow, nativeTheme } from 'electron'
import path from 'path'
import { generateMfaQr, handleVerifyOTP } from './otp.js'
import { startInstance, stopInstance, sendStatus, Subprocesses, IPlatform } from './instances.mjs'
import coreParams from './utils/coreParams.mjs'
import defaultCoreParams from './utils/defaultCoreParams.mjs'
import store from './utils/store.mjs'
import isCC from './utils/isCC.mjs'
import {
  installDriver,
  uninstallDriver,
  getDriverStatus,
  listAudioDevices
} from './utils/audioDriver.mjs'
import {
  enableAudioDevice,
  disableAudioDevice,
  getAudioManagerStatus,
  getVolume,
  setVolume,
  volumeUp,
  volumeDown,
  toggleMute
} from './utils/audioManager.mjs'
import { enableSsl, disableSsl, getSslStatus } from './utils/sslManager.mjs'
import {
  deleteSongDetector,
  downloadSongDetector,
  getSongDetectorStatus,
  isSongDetectorInstalled,
  startSongDetector,
  stopSongDetector
} from './utils/songDetector.mjs'

export const handlers = async (
  wind: BrowserWindow,
  subprocesses: Subprocesses,
  event: any,
  parameters: any
) => {
  console.log('ALL PARAMS', parameters)

  try {
    switch (parameters.command) {
      case 'get-store-value':
        {
          const value = store.get(parameters.key, parameters.defaultValue)
          wind.webContents.send('fromMain', ['store-value', { key: parameters.key, value }])
        }
        break
      case 'set-store-value':
        store.set(parameters.key, parameters.value)
        wind.webContents.send('fromMain', [
          'store-value-set',
          { key: parameters.key, success: true }
        ])
        break
      case 'close-others':
        BrowserWindow.getAllWindows().forEach((win) => {
          if (win !== wind) {
            win.close()
          }
        })
        break
      case 'get-all-windows': {
        const allWIndows = BrowserWindow.getAllWindows()
        console.log('allWIndows', allWIndows)
        wind.webContents.send('fromMain', ['all-windows', allWIndows])
        break
      }
      case 'verify_otp':
        handleVerifyOTP(wind, parameters)
        break
      case 'generate-mfa-qr':
        console.log('Generate MFA QR')
        generateMfaQr(wind)
        break
      case 'get-platform':
        wind.webContents.send('fromMain', ['platform', process.platform])
        break
      case 'get-core-params':
        if (isCC()) {
          wind.webContents.send('fromMain', ['coreParams', coreParams[process.platform]])
          sendStatus(wind, subprocesses, false, parameters.instance)
        }
        break
      case 'start-core':
        if (isCC()) {
          startInstance(wind, parameters.instance, subprocesses)
        }
        break
      case 'start-core-instance':
        if (isCC()) {
          startInstance(wind, parameters.instance, subprocesses, parameters.port)
        }
        break
      case 'stop-core-instance':
        if (isCC()) {
          stopInstance(wind, parameters.instance, subprocesses)
        }
        break
      case 'delete-core-instance':
        if (isCC()) {
          Object.entries(subprocesses).forEach(([name, subpy]) => {
            if (name === parameters.instance) {
              subpy.kill()
              delete subprocesses[name]
            }
          })
          delete coreParams[process.platform][parameters.instance]
          store.set('coreParams', coreParams)
          wind.webContents.send('fromMain', ['coreParams', coreParams[process.platform]])
        }
        break
      case 'delete-core-params':
        if (isCC()) {
          store.set('coreParams', defaultCoreParams)
          coreParams.darwin = defaultCoreParams.darwin
          coreParams.win32 = defaultCoreParams.win32
          coreParams.linux = defaultCoreParams.linux
          wind.webContents.send('fromMain', [
            'coreParams',
            defaultCoreParams[process.platform as IPlatform]
          ])
          app.relaunch()
          app.exit()
        }
        break
      case 'open-config':
        console.log('Open Config')

        if (parameters.instance && parameters.instance !== 'instance1') {
          shell.showItemInFolder(
            path.join(app.getPath('userData'), '.ledfx-cc', parameters.instance, 'config.json')
          )
          shell.showItemInFolder(
            path.join(app.getPath('appData'), '.ledfx-cc', parameters.instance, 'config.json')
          )
          shell.showItemInFolder(
            path.join(app.getPath('home'), '.ledfx-cc', parameters.instance, 'config.json')
          )
        } else {
          shell.showItemInFolder(path.join(app.getPath('userData'), '.ledfx', 'config.json'))
          shell.showItemInFolder(path.join(app.getPath('appData'), '.ledfx', 'config.json'))
          shell.showItemInFolder(path.join(app.getPath('home'), '.ledfx', 'config.json'))
        }

        break
      case 'restart-client':
        app.relaunch()
        app.exit()
        break
      case 'toggle-darkmode':
        if (nativeTheme.shouldUseDarkColors) {
          nativeTheme.themeSource = 'light'
        } else {
          nativeTheme.themeSource = 'dark'
        }
        return nativeTheme.shouldUseDarkColors
      case 'set-darkmode': {
        const Store = (await import('electron-store')).default
        const store = new Store()
        store.set('mode', 'dark')
        nativeTheme.themeSource = 'dark'
        return nativeTheme.shouldUseDarkColors
      }
      case 'set-lightmode': {
        const Store = (await import('electron-store')).default
        const store = new Store()
        store.set('mode', 'light')
        nativeTheme.themeSource = 'light'
        return nativeTheme.shouldUseDarkColors
      }
      case 'install-driver': {
        if (process.platform === 'darwin') {
          // Install driver and enable audio device in single sudo command
          const result = await installDriver()
          if (result.success) {
            // Send message to frontend to trigger audio config reload
            wind.webContents.send('fromMain', ['reload-audio-config'])
          }
          wind.webContents.send('fromMain', ['driver-install-result', result])
        } else {
          wind.webContents.send('fromMain', [
            'driver-install-result',
            { success: false, message: 'Driver installation is only supported on macOS' }
          ])
        }
        break
      }
      case 'uninstall-driver': {
        if (process.platform === 'darwin') {
          // Disable audio device and uninstall driver in single sudo command
          const result = await uninstallDriver()
          if (result.success) {
            // Clear the driver installed flag
            store.set('ledfx-driver-installed', false)
            // Send message to frontend to trigger audio config reload
            wind.webContents.send('fromMain', ['reload-audio-config'])
          }
          wind.webContents.send('fromMain', ['driver-uninstall-result', result])
        } else {
          wind.webContents.send('fromMain', [
            'driver-uninstall-result',
            { success: false, message: 'Driver uninstallation is only supported on macOS' }
          ])
        }
        break
      }
      case 'get-driver-preference': {
        if (process.platform === 'darwin') {
          const dontAskAgain = store.get('driver-dont-ask-again', false)
          const autoInstall = store.get('driver-auto-install', false)

          let preference = 'ask'
          if (dontAskAgain) {
            preference = autoInstall ? 'always' : 'never'
          }

          wind.webContents.send('fromMain', ['driver-preference', preference])
        }
        break
      }
      case 'set-driver-preference': {
        if (process.platform === 'darwin') {
          const preference = parameters.preference

          if (preference === 'ask') {
            store.set('driver-dont-ask-again', false)
            store.set('driver-auto-install', false)
          } else if (preference === 'always') {
            store.set('driver-dont-ask-again', true)
            store.set('driver-auto-install', true)
          } else if (preference === 'never') {
            store.set('driver-dont-ask-again', true)
            store.set('driver-auto-install', false)
          }
        }
        break
      }
      case 'get-driver-status': {
        if (process.platform === 'darwin') {
          const status = await getDriverStatus()
          wind.webContents.send('fromMain', ['driver-status', status])
        } else {
          wind.webContents.send('fromMain', [
            'driver-status',
            { installed: false, resourcePath: 'N/A (macOS only)' }
          ])
        }
        break
      }
      case 'list-audio-devices': {
        if (process.platform === 'darwin') {
          const devices = await listAudioDevices()
          wind.webContents.send('fromMain', ['audio-devices', devices])
        } else {
          wind.webContents.send('fromMain', ['audio-devices', 'Only supported on macOS'])
        }
        break
      }
      case 'enable-audio-device': {
        if (process.platform === 'darwin') {
          const result = await enableAudioDevice()
          wind.webContents.send('fromMain', ['audio-device-enable-result', result])
        } else {
          wind.webContents.send('fromMain', [
            'audio-device-enable-result',
            { success: false, message: 'Audio device management only supported on macOS' }
          ])
        }
        break
      }
      case 'disable-audio-device': {
        if (process.platform === 'darwin') {
          const result = await disableAudioDevice()
          wind.webContents.send('fromMain', ['audio-device-disable-result', result])
        } else {
          wind.webContents.send('fromMain', [
            'audio-device-disable-result',
            { success: false, message: 'Audio device management only supported on macOS' }
          ])
        }
        break
      }
      case 'get-audio-manager-status': {
        if (process.platform === 'darwin') {
          const status = await getAudioManagerStatus()
          wind.webContents.send('fromMain', ['audio-manager-status', status])
        } else {
          wind.webContents.send('fromMain', [
            'audio-manager-status',
            { exists: false, path: 'N/A (macOS only)', executable: false }
          ])
        }
        break
      }
      case 'get-volume': {
        if (process.platform === 'darwin') {
          const result = await getVolume()
          wind.webContents.send('fromMain', ['volume-result', result])
        } else {
          wind.webContents.send('fromMain', [
            'volume-result',
            { success: false, message: 'Volume control only supported on macOS' }
          ])
        }
        break
      }
      case 'set-volume': {
        if (process.platform === 'darwin') {
          const result = await setVolume(parameters.volume)
          wind.webContents.send('fromMain', ['volume-set-result', result])
        } else {
          wind.webContents.send('fromMain', [
            'volume-set-result',
            { success: false, message: 'Volume control only supported on macOS' }
          ])
        }
        break
      }
      case 'volume-up': {
        if (process.platform === 'darwin') {
          const result = await volumeUp()
          wind.webContents.send('fromMain', ['volume-up-result', result])
        } else {
          wind.webContents.send('fromMain', [
            'volume-up-result',
            { success: false, message: 'Volume control only supported on macOS' }
          ])
        }
        break
      }
      case 'volume-down': {
        if (process.platform === 'darwin') {
          const result = await volumeDown()
          wind.webContents.send('fromMain', ['volume-down-result', result])
        } else {
          wind.webContents.send('fromMain', [
            'volume-down-result',
            { success: false, message: 'Volume control only supported on macOS' }
          ])
        }
        break
      }
      case 'toggle-mute': {
        if (process.platform === 'darwin') {
          const result = await toggleMute()
          wind.webContents.send('fromMain', ['toggle-mute-result', result])
        } else {
          wind.webContents.send('fromMain', [
            'toggle-mute-result',
            { success: false, message: 'Mute control only supported on macOS' }
          ])
        }
        break
      }
      case 'enable-ssl': {
        const result = await enableSsl()
        if (result.success) {
          store.set('ledfx-ssl-enabled', true)
        }
        wind.webContents.send('fromMain', ['ssl-enable-result', result])
        break
      }
      case 'disable-ssl': {
        const result = await disableSsl()
        if (result.success) {
          store.set('ledfx-ssl-enabled', false)

          // Reset host configuration to HTTP defaults
          wind.webContents
            .executeJavaScript(
              `
            localStorage.removeItem('ledfx-host');
            const hosts = JSON.parse(localStorage.getItem('ledfx-hosts') || '[]');
            const filteredHosts = hosts.filter(h => !h.includes('8889') && !h.includes('https'));
            if (filteredHosts.length === 0) {
              filteredHosts.push('http://localhost:8888');
            }
            localStorage.setItem('ledfx-hosts', JSON.stringify(filteredHosts));
            localStorage.setItem('ledfx-host', 'http://localhost:8888');
          `
            )
            .catch((err) => console.error('Failed to reset host config:', err))
        }
        wind.webContents.send('fromMain', ['ssl-disable-result', result])
        break
      }
      case 'get-ssl-status': {
        const status = await getSslStatus()
        wind.webContents.send('fromMain', ['ssl-status', { enabled: status.installed }])
        break
      }
      case 'get-ssl-preference': {
        const dontAskAgain = store.get('ssl-dont-ask-again', false)
        const autoEnable = store.get('ssl-auto-enable', false)

        let preference = 'ask'
        if (dontAskAgain && autoEnable) {
          preference = 'auto'
        } else if (dontAskAgain && !autoEnable) {
          preference = 'never'
        }

        wind.webContents.send('fromMain', ['ssl-preference', preference])
        break
      }
      case 'set-ssl-preference': {
        const preference = parameters.preference

        if (preference === 'ask') {
          store.set('ssl-dont-ask-again', false)
          store.set('ssl-auto-enable', false)
        } else if (preference === 'auto') {
          store.set('ssl-dont-ask-again', true)
          store.set('ssl-auto-enable', true)
        } else if (preference === 'never') {
          store.set('ssl-dont-ask-again', true)
          store.set('ssl-auto-enable', false)
        }
        break
      }
      case 'check-song-detector': {
        const plus = parameters.plus || false
        console.log('[Handler] Checking song detector installation, plus:', plus)
        const installed = await isSongDetectorInstalled(plus)
        const detectorKey = plus ? 'songDetectorPlus' : 'songDetector'
        const isRunning = !!(subprocesses[detectorKey] && subprocesses[detectorKey].running)
        console.log('[Handler] Song detector installed:', installed, 'running:', isRunning, 'plus:', plus)
        wind.webContents.send('fromMain', ['song-detector-available', { installed, isRunning, plus }])
        break
      }
      case 'get-song-detector-status': {
        const plus = parameters.plus || false
        console.log('[Handler] Getting song detector status, plus:', plus)
        const status = await getSongDetectorStatus(plus)
        console.log('[Handler] Song detector status:', status)
        wind.webContents.send('fromMain', ['song-detector-status', { ...status, plus }])
        break
      }
      case 'start-song-detector': {
        const deviceName = parameters.deviceName || 'ledfxcc'
        const plus = parameters.plus || false
        const detectorKey = plus ? 'songDetectorPlus' : 'songDetector'
        console.log('[Handler] Starting song detector with device:', deviceName, 'plus:', plus)

        // Check if already running
        if (subprocesses[detectorKey] && subprocesses[detectorKey].running) {
          console.log('[Handler] Song detector already running, skipping start, plus:', plus)
          wind.webContents.send('fromMain', ['song-detector-already-running', { deviceName, plus }])
          break
        }

        const songDetectorProcess = startSongDetector(wind, deviceName, plus)
        if (songDetectorProcess) {
          subprocesses[detectorKey] = songDetectorProcess
          console.log('[Handler] Song detector process started, plus:', plus)
        } else {
          console.log('[Handler] Failed to start song detector process, plus:', plus)
        }
        break
      }
      case 'download-song-detector': {
        const plus = parameters.plus || false
        console.log('[Handler] Downloading song detector, plus:', plus)
        try {
          await downloadSongDetector(wind, plus)
          // After download, check availability again
          const installed = await isSongDetectorInstalled(plus)
          const detectorKey = plus ? 'songDetectorPlus' : 'songDetector'
          const isRunning = !!(subprocesses[detectorKey] && subprocesses[detectorKey].running)
          wind.webContents.send('fromMain', ['song-detector-available', { installed, isRunning, plus }])
        } catch (error) {
          console.error('[Handler] Download failed:', error)
        }
        break
      }
      case 'delete-song-detector': {
        const plus = parameters.plus || false
        const detectorKey = plus ? 'songDetectorPlus' : 'songDetector'
        console.log('[Handler] Deleting song detector, plus:', plus)
        // Stop it first if running
        if (subprocesses[detectorKey]) {
          stopSongDetector(subprocesses[detectorKey], wind, plus)
          delete subprocesses[detectorKey]
        }
        await deleteSongDetector(wind, plus)
        // After delete, check availability again
        const installed = await isSongDetectorInstalled(plus)
        const isRunning = !!(subprocesses[detectorKey] && subprocesses[detectorKey].running)
        wind.webContents.send('fromMain', ['song-detector-available', { installed, isRunning, plus }])
        break
      }
      case 'stop-song-detector': {
        const plus = parameters.plus || false
        const detectorKey = plus ? 'songDetectorPlus' : 'songDetector'
        console.log('[Handler] Stopping song detector, plus:', plus)
        if (subprocesses[detectorKey]) {
          const success = stopSongDetector(subprocesses[detectorKey], wind, plus)
          if (success) {
            delete subprocesses[detectorKey]
            console.log('[Handler] Song detector stopped successfully, plus:', plus)
            // Clear running state
            store.set('song-detector-running', false)
          } else {
            console.log('[Handler] Failed to stop song detector, plus:', plus)
          }
        } else {
          console.log('[Handler] No song detector subprocess found')
          // Clear running state anyway
          store.set('song-detector-running', false)
        }
        break
      }
      default:
        console.log('Command not recognized')
        break
    }
  } catch (error) {
    console.error(`Error handling command "${parameters.command}": ${error}`)
  }
}
