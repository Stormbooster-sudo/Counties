const { app, BrowserWindow, Tray, Menu, ipcMain, nativeTheme } = require('electron')
const path = require('path')
const Store = require('electron-store');
const AutoLaunch = require('auto-launch')
const DatabaseOps = require('./database.js')
const url = ""

//For storing pre-config -> save in local AppData
const store = new Store();
//For main data
const db = new DatabaseOps()

const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'app-icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    }
  })
  const childWin = new BrowserWindow({
    parent: mainWindow,
    frame: false,
    opacity: 0.9,
    transparent: true,
    width: 450,
    height: 128,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.removeMenu()
  mainWindow.setMenu(null)
  await mainWindow.loadFile('src/index.html')
  
  if(store.has('theme'))
    nativeTheme.themeSource = store.get('theme')
  // mainWindow.webContents.openDevTools()

  mainWindow.on('minimize', async function (event) {
    event.preventDefault();
    if (process.platform === 'darwin') {
      app.dock.hide();
    }
    mainWindow.hide();
    if (store.has("child-pos") && store.has("child-size")) {
      const pos = store.get("child-pos")
      const size = store.get("child-size")
      childWin.setPosition(pos[0], pos[1])
      childWin.setSize(size[0], size[1])
    }
    if(store.has("widget-alway-top"))
      childWin.setAlwaysOnTop(store.get("widget-alway-top"))

    childWin.removeMenu()
    childWin.setMenu(null)
    childWin.loadFile('src/index-child.html')
    // childWin.webContents.openDevTools()
    childWin.show();
  });

  mainWindow.on('close', () => {
    store.set("child-pos", childWin.getPosition())
    store.set("child-size", childWin.getSize())
  });

  var appIcon = null;
  appIcon = new Tray(path.join(__dirname, 'app-icon.png'));
  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App', click: function () {
        mainWindow.show();
        store.set("child-pos", childWin.getPosition())
        store.set("child-size", childWin.getSize())
        childWin.hide();
      }
    },
    {
      label: 'Quit', click: function () {
        store.set("child-pos", childWin.getPosition())
        store.set("child-size", childWin.getSize())
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);
  appIcon.setToolTip('Counties');
  appIcon.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
  createWindow()

  var autoLaunch = new AutoLaunch({
    name: 'Counties',
    path: app.getPath('exe'),
  });

  if (!store.has("auto-launch")) {
    store.set("auto-launch", false)
  }
  store.get('auto-launch') ? autoLaunch.enable() : autoLaunch.disable()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

ipcMain.handle("close-win", () => {
  app.quit()
})

ipcMain.handle("add-task", async (event, data) => {
  const res = await db.add(data)
  return res
})

ipcMain.handle("get-tasks", async () => {
  const res = await db.getAllData()
  return res.rows
})

ipcMain.handle("done-task", async (event, data) => {
  const res = await db.updateDoneTask(data)
  return res
})

ipcMain.handle("delete-task", async (event, data) => {
  const res = await db.delete(data)
  return res
})

ipcMain.handle('delete-batch-tasks', async (event, data) => {
  const res = await db.deleteBulk(data)
  return res
})

ipcMain.handle("update-date-task", async (event, data) => {
  // console.log(data)
  const res = await db.updateDateTask(data)
  return res
})

ipcMain.handle('set-auto-launch', (event, data) => {
  store.set('auto-launch', data)
})

ipcMain.handle('set-theme', (event, data) => {
  if(data){
    store.set('theme', 'dark')
    nativeTheme.themeSource = 'dark'
  }else{
    store.set('theme', 'light')
    nativeTheme.themeSource = 'light'
  }
})

ipcMain.handle('set-alway-top', (event, data) => {
  store.set('widget-alway-top', data)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

try {
  require('electron-reloader')(module)
} catch (_) { }