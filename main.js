const {app, BrowserWindow} = require('electron');
let win;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1620,
        height: 1200,
        backgroundColor: '#ffffff',
        webPreferences: {
            webSecurity: false,
            experimentalFeatures: true,
        },
        node: {
            __dirname: false
        },
        icon: `file://${__dirname}/dist/assets/logo.png`
    })


    win.loadURL(`file://${__dirname}/dist/index.html`)

    //// uncomment below to open the DevTools.
    // win.webContents.openDevTools()

    // Event when the window is closed.
    win.on('closed', function () {
        win = null
    })
}


// // Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {

    // On macOS specific close process
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // macOS specific close process
    if (win === null) {
        createWindow()
    }
})

//
// const isDev = require('electron-is-dev');
//
// const {app, BrowserWindow, ipcMain} = require('electron');
// const {autoUpdater} = require("electron-updater");
// const server = 'https://github.com/peliukas/schedulizer-electron'
// // const feed = `${server}/update/${process.platform}/${app.getVersion()}`
// // autoUpdater.setFeedURL(server + '/' +process.platform + '/' + app.getVersion())
// setInterval(() => {
//     autoUpdater.checkForUpdates()
// }, 60000)
// let win; // this will store the window object
//
// // creates the default window
// function createDefaultWindow() {
//     win = new BrowserWindow({width: 900, height: 680});
//     win.loadURL(`file://${__dirname}/dist/index.html`);
//     win.on('closed', () => app.quit());
//     return win;
// }
//
// // when the app is loaded create a BrowserWindow and check for updates
// app.on('ready', function () {
//     createDefaultWindow()
// });
//
// if (isDev) {
//     autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
//         const dialogOpts = {
//             type: 'info',
//             buttons: ['Restart', 'Later'],
//             title: 'Application Update',
//             message: process.platform === 'win32' ? releaseNotes : releaseName,
//             detail: 'A new version has been downloaded. Restart the application to apply the updates.'
//         }
//
//         dialog.showMessageBox(dialogOpts, (response) => {
//             if (response === 0) autoUpdater.quitAndInstall()
//         })
//     })
//
//     autoUpdater.on('error', message => {
//         console.error('There was a problem updating the application')
//         console.error(message)
//     })
// }
