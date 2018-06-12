const {app, BrowserWindow} = require('electron');
let win;
//to make singleton instance
const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

if (isSecondInstance) {
    app.quit()
}

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
