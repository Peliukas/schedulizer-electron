// const {app, BrowserWindow, Menu, protocol, ipcMain} = require('electron');
// const log = require('electron-log');
// const {autoUpdater} = require("electron-updater");
//
// let win;
//
// function createWindow() {
//     // Create the browser window.
//     win = new BrowserWindow({
//         width: 1620,
//         height: 1200,
//         backgroundColor: '#ffffff',
//         webPreferences: {
//             experimentalFeatures: true,
//         },
//         icon: `file://${__dirname}/dist/assets/logo.png`
//     })
//
//
//     win.loadURL(`file://${__dirname}/dist/index.html`)
//
//     //// uncomment below to open the DevTools.
//     win.webContents.openDevTools()
//
//     // Event when the window is closed.
//     win.on('closed', function () {
//         win = null
//     })
// }
//
//
// function sendStatusToWindow(text) {
//     log.info(text);
//     win.webContents.send('message', text);
// }
//
// // // Create window on electron intialization
// // app.on('ready', createWindow)
//
// // Quit when all windows are closed.
// app.on('window-all-closed', function () {
//
//     // On macOS specific close process
//     if (process.platform !== 'darwin') {
//         app.quit()
//     }
// })
//
// app.on('activate', function () {
//     // macOS specific close process
//     if (win === null) {
//         createWindow()
//     }
// })
//
// app.on('ready', function () {
//     createWindow()
//     autoUpdater.checkForUpdatesAndNotify().then(updateStatus => {
//         alert(updateStatus);
//     });
//
// });
//
// autoUpdater.on('checking-for-update', () => {
//     sendStatusToWindow('Checking for update...');
// })
// autoUpdater.on('update-available', (info) => {
//     sendStatusToWindow('Update available.');
// })
// autoUpdater.on('update-not-available', (info) => {
//     sendStatusToWindow('Update not available.');
// })
// autoUpdater.on('error', (err) => {
//     sendStatusToWindow('Error in auto-updater. ' + err);
// })
// autoUpdater.on('download-progress', (progressObj) => {
//     let log_message = "Download speed: " + progressObj.bytesPerSecond;
//     log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
//     log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
//     sendStatusToWindow(log_message);
// })
// autoUpdater.on('update-downloaded', (info) => {
//     sendStatusToWindow('Update downloaded');
// });
//
// ipcMain.on("quitAndInstall", (event, arg) => {
//     autoUpdater.quitAndInstall();
// })
//
const isDev = require('electron-is-dev');

const {app, BrowserWindow, ipcMain} = require('electron');
const {autoUpdater} = require("electron-updater");
const server = 'https://github.com/peliukas/schedulizer-electron'
// const feed = `${server}/update/${process.platform}/${app.getVersion()}`
// autoUpdater.setFeedURL(server + '/' +process.platform + '/' + app.getVersion())
setInterval(() => {
    autoUpdater.checkForUpdates()
}, 60000)
let win; // this will store the window object

// creates the default window
function createDefaultWindow() {
    win = new BrowserWindow({width: 900, height: 680});
    win.loadURL(`file://${__dirname}/dist/index.html`);
    win.on('closed', () => app.quit());
    return win;
}

// when the app is loaded create a BrowserWindow and check for updates
app.on('ready', function () {
    createDefaultWindow()
});

if (isDev) {
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
        const dialogOpts = {
            type: 'info',
            buttons: ['Restart', 'Later'],
            title: 'Application Update',
            message: process.platform === 'win32' ? releaseNotes : releaseName,
            detail: 'A new version has been downloaded. Restart the application to apply the updates.'
        }

        dialog.showMessageBox(dialogOpts, (response) => {
            if (response === 0) autoUpdater.quitAndInstall()
        })
    })

    autoUpdater.on('error', message => {
        console.error('There was a problem updating the application')
        console.error(message)
    })
}
