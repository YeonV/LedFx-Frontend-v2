const { contextBridge, ipcRenderer } = require('electron');
const { app, autoUpdater, dialog } = require('electron')
const server = 'https://github.com/YeonV/LedFx-Frontend-v2/releases'
//const url = `${server}/update/${process.platform}/${app.getVersion()}`
const url = `${server}/latest`

autoUpdater.setFeedURL({ url })
setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 60000)
const customTitlebar = require('@treverix/custom-electron-titlebar');

contextBridge.exposeInMainWorld('api', {
    send: (channel, data) => {
        // Whitelist channels
        let validChannels = ['toMain'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        let validChannels = ['fromMain'];
        if (validChannels.includes(channel)) {
            // Deliberately strip event as it includes `sender`
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    },
});


window.addEventListener('DOMContentLoaded', () => {
    new customTitlebar.Titlebar({
        backgroundColor: customTitlebar.Color.fromHex('#202020'),
        icon: './icon.png',
        menu: false,
        titleHorizontalAlignment: 'left',
    });
})

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    }
  
    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
  })
  autoUpdater.on('error', message => {
    console.error('There was a problem updating the application')
    console.error(message)
  })
