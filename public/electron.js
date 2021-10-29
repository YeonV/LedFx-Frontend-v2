const path = require('path');

const { app, Menu, Tray, nativeImage, Notification, nativeTheme, BrowserWindow, ipcMain, shell } = require('electron');
const isDev = require('electron-is-dev');
const fs = require('fs')

// Conditionally include the dev tools installer to load React Dev Tools
let installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS; // NEW!

if (isDev) {
    const devTools = require("electron-devtools-installer");
    installExtension = devTools.default;
    REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
    REDUX_DEVTOOLS = devTools.REDUX_DEVTOOLS;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require("electron-squirrel-startup")) {
    app.quit();
}

let win

function createWindow() {
    require('@electron/remote/main').initialize()

    // require('@treverix/remote/main').initialize()
    // Create the browser window.
    win = new BrowserWindow({
        width: 480,
        height: 768,
        autoHideMenuBar: true,
        titleBarStyle: "hidden",
        // frame: false,
        webPreferences: {
            webSecurity: false,
            plugins: true,
            enableRemoteModule: true,
            backgroundThrottling: false,
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            additionalArguments: ["integratedCore"]
        }
    });

    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );


    // win.removeMenu()

    // Open the DevTools.
    // if (isDev) {
    //     win.webContents.openDevTools({ mode: 'detach' });
    // }

    return win
}

const NOTIFICATION_TITLE = 'LedFx Client - by Blade'
const NOTIFICATION_BODY = 'Testing Notification from the Main process'

function showNotification() {
    new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
}

let tray = null
var subpy = null
var contextMenu = null
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
const ledfxCores = fs.readdirSync('./').filter(o => (o.length - o.indexOf('--win.exe') === 9) && o.indexOf('LedFx_core') === 0)
const ledfxCore = ledfxCores && ledfxCores.length && ledfxCores.length > 0 && ledfxCores[ledfxCores.length - 1]

if (fs.existsSync(`./${ledfxCore}`)) {
    subpy = require("child_process").spawn(`./${ledfxCore}`, ["-p", "8888"]);
}

app.whenReady().then(async() => {
    nativeTheme.themeSource = 'dark';
    const wind = createWindow();
    // require('@treverix/remote/main').initialize()
    require("@electron/remote/main").enable(wind.webContents)
    if (isDev) {
        await installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS], { loadExtensionOptions: { allowFileAccess: true }, forceDownload: false })
            .then(name => console.log(`Added Extension:  ${name}`))
            .catch(error => console.log(`An error occurred: , ${error}`));
    }


    const icon = path.join(__dirname, 'icon_16x16a.png')
    tray = new Tray(icon)

    if (fs.existsSync(`./${ledfxCore}`)) {
        contextMenu = Menu.buildFromTemplate([
            { label: 'Show', click: () => wind.show() },
            { label: 'Minimize', click: () => wind.minimize() },
            { label: 'Minimize to tray', click: () => wind.hide() },
            { label: 'Test Notifiation', click: () => showNotification() },
            { label: 'seperator', type: 'separator' },
            { label: 'Dev', click: () => wind.webContents.openDevTools() },
            { label: 'seperator', type: 'separator' },
            { label: 'Start core', click: () => subpy = require("child_process").spawn(`./${ledfxCore}`, []) },
            { label: 'Stop core', click: () => wind.webContents.send('fromMain', 'trigger-function') },
            { label: 'seperator', type: 'separator' },
            { label: 'Exit', click: () => app.quit() }
        ])
    } else {
        contextMenu = Menu.buildFromTemplate([
            { label: 'Show', click: () => wind.show() },
            { label: 'Minimize', click: () => wind.minimize() },
            { label: 'Minimize to tray', click: () => wind.hide() },
            { label: 'Test Notifiation', click: () => showNotification() },
            { label: 'seperator', type: 'separator' },
            { label: 'Dev', click: () => wind.webContents.openDevTools() },
            { label: 'seperator', type: 'separator' },
            { label: 'Stop core', click: () => wind.webContents.send('fromMain', 'trigger-function') },
            { label: 'seperator', type: 'separator' },
            { label: 'Exit', click: () => app.quit() }
        ])
    }
    tray.setToolTip('LedFx Client')
    tray.setContextMenu(contextMenu)
    tray.setIgnoreDoubleClickEvents(true)
    tray.on('click', (e) => wind.show())

    ipcMain.on("toMain", (event, parameters) => {
        console.log(parameters)
        if (parameters === 'start-core') {
            console.log("Starting Core", ledfxCore)
            if (fs.existsSync(`./${ledfxCore}`)) {
                subpy = require("child_process").spawn(`./${ledfxCore}`, [])
            }
            return
        }
        if (parameters === 'open-config') {
            console.log("Open Config")  
            shell.showItemInFolder(path.join(app.getPath('appData'), '/.ledfx/config.json'))
            return
        }
    });

});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
        if (subpy !== null) {
            subpy.kill("SIGINT");
        }
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});