const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron')
const path = require('path')
const axios = require('axios')
const Store = require('electron-store');
const AutoLaunch = require('auto-launch')
const { access } = require('fs');
const PounchDB = require('pouchdb')
const url = ""

const store = new Store();
const db = new PounchDB('eventDB')
const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'app-icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  const childWin = new BrowserWindow({
    parent: mainWindow,
    frame:false,
    opacity:0.9,
    transparent:true,
    width: 700,
    height: 300,
    show:false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })


 
  mainWindow.removeMenu()
  mainWindow.setMenu(null)
  await mainWindow.loadFile('src/index.html')
  mainWindow.webContents.openDevTools()
  mainWindow.on('minimize',async function(event){
    event.preventDefault();
    mainWindow.hide();
    if(store.has("child-pos")&&store.has("child-size")){
      const pos = store.get("child-pos")
      const size = store.get("child-size")
      childWin.setPosition(pos[0],pos[1])
    }
    childWin.removeMenu()
    childWin.setMenu(null)
    await childWin.loadFile('src/index_child.html')
    childWin.webContents.openDevTools()
    childWin.show();
  });
  mainWindow.on ('close', () => { 
    const childPositon = childWin.getPosition();
    const childSize = childWin.getSize();
    store.set("child-pos", childPositon)
    store.set("child-size",childSize)
    console.log(childSize)
    console.log(store.get("child-pos"))
  });

  var appIcon = null;
  appIcon = new Tray(path.join(__dirname, 'app-icon.png'));
  var contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click:  function(){
        mainWindow.show();
        childWin.hide();
    } },
    { label: 'Quit', click:  function(){
        app.isQuiting = true;
        app.quit();
    } }
  ]);
  appIcon.setToolTip('Electron.js App');
  appIcon.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
  createWindow()
  var autoLaunch = new AutoLaunch({
    name: 'Counties',
    path: app.getPath('exe'),
  });
  autoLaunch.isEnabled().then((isEnabled) => {
    if (!isEnabled) autoLaunch.enable();
  });

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

ipcMain.handle("add-task", async (event, data) =>{
  const res = await db.post(data)
  console.log(res)
  // const res = axios.post(`${url}/task/add`, data,{headers:{'x-access-token': store.get('token')}});
  // console.log(res)
  // return res.status;
} )

ipcMain.handle("get-tasks", async () =>{
  const res = await db.allDocs({
    include_docs: true
  });
  console.log(res.rows)
  // console.log(res.data)
  return res.rows
} )

ipcMain.handle("done-task", async (event, data) => {
  const task_id = data;
  console.log(res.data);
  return res.data
})

ipcMain.handle("delete-task", async (event, data) => {
  const task_id = data
  console.log(data)
  // const res = await axios.get(`${url}/task/delete/${task_id}`, {headers:{'x-access-token': store.get('token')}});
  console.log(res.data)
  return res.data
})


app.on('window-all-closed', () => {
  console.log()
  if (process.platform !== 'darwin') app.quit()
})

try {
  require('electron-reloader')(module)
} catch (_) {}