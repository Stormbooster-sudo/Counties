const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron')
const path = require('path')
const Store = require('electron-store');
const moment = require('moment')
const AutoLaunch = require('auto-launch')
const PounchDB = require('pouchdb')
const url = ""

const store = new Store();
const db = new PounchDB(path.join(__dirname.replace('\\resources\\app.asar', ''), 'eventDB'))
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
    height: 200,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.removeMenu()
  mainWindow.setMenu(null)
  await mainWindow.loadFile('src/index.html')
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
    }
    childWin.removeMenu()
    childWin.setMenu(null)
    childWin.loadFile('src/index_child.html')
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
  try {
    const res = await db.post(data)
    return res
  } catch (err) {
    console.log(err)
  }
})

ipcMain.handle("get-tasks", async () => {
  var res = await db.allDocs({
    include_docs: true
  });
  return res.rows
})

ipcMain.handle("done-task", async (event, data) => {
  const doc_id = data;
  try {
    var doc = await db.get(doc_id);
    var res = await db.put({
      _id: doc_id,
      _rev: doc._rev,
      title: doc.title,
      detail: doc.detail,
      start: doc.start,
      time: doc.time,
      status: "done",
      done: moment().format("YYYY-MM-DD hh:mm")
    });
  } catch (err) {
    console.log(err);
  }
  return res
})

ipcMain.handle("delete-task", async (event, data) => {
  const doc_id = data
  try {
    var doc = await db.get(doc_id);
    var res = await db.remove(doc);
  } catch (err) {
    console.log(err);
  }
  return res
})

ipcMain.handle('delete-batch-tasks', async (event, data) => {
  var docs = data.map((t) => { return { _id: t._id, _rev: t._rev, _deleted: true } })
  console.log(docs)
  try {
    var res = await db.bulkDocs(docs);
  } catch (err) {
    console.log(err);
  }
  return res
})

ipcMain.handle("update-date-task", async (event, data) => {
  console.log(data)
  const doc_id = data.id
  const doc_start = data.start
  try {
    var doc = await db.get(doc_id);
    var res = await db.put({
      _id: doc_id,
      _rev: doc._rev,
      title: doc.title,
      detail: doc.detail,
      status: doc.status,
      start: doc_start,
      time: doc.time,
      color: doc.color
    });
  } catch (err) {
    console.log(err);
  }
  return res
})

ipcMain.handle('set-auto-launch', async (event, data) => {
  store.set('auto-launch', data)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

try {
  require('electron-reloader')(module)
} catch (_) { }