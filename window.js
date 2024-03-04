const { app, BrowserWindow, Notification, ipcMain } = require("electron");
const fs = require("fs");
const dialog = require("dialog");
const { NONAME } = require("dns");

const createWindow = () => {
    win = new BrowserWindow({
        width: 350,
        height: 402,
        autoHideMenuBar: true,
        resizable: false,
        show: false,
        icon: "ico.ico",
        center: true,

        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            devTools: false
        }
    })

    win.loadFile("./src/index.html");

    win.once("ready-to-show", () => {
        win.show();
    });
}

//Check if fortnite config exists
if (fs.existsSync(process.env.LOCALAPPDATA + "\\FortniteGame\\Saved\\Config\\WindowsClient\\GameUserSettings.ini")) {
    app.whenReady().then(createWindow, app.setAppUserModelId(app.name));
} else {
    dialog.err("Fortnite game config could not be located", "ezres", function(exitCode) {
        if (exitCode == 0) app.quit();
    });
}

//Notification command
ipcMain.on("notification", (event, text) => {
    notification = new Notification({
        title: "",
        body: text,
        icon: "ico.ico"
    }).show();
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
})