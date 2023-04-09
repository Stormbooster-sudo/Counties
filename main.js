const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron')
const path = require('path')
const axios = require('axios')
const Store = require('electron-store');
const AutoLaunch = require('auto-launch')
const { access } = require('fs');
const url = ""

const store = new Store();
const createWindow = () => {
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

  // mainWindow.webContents.openDevTools()
  // childWin.webContents.openDevTools()
  mainWindow.removeMenu()
  mainWindow.setMenu(null)
  if(!store.has('token') || (store.get('token') == '')){
    mainWindow.loadFile('src/login.html')
  }
  else{
    mainWindow.loadFile('src/index.html')
  }
  mainWindow.on('minimize',function(event){
    event.preventDefault();
    mainWindow.hide();
    if(store.has("child-pos")&&store.has("child-size")){
      const pos = store.get("child-pos")
      const size = store.get("child-size")
      childWin.setPosition(pos[0],pos[1])
      childWin.setSize(size[0], size[1])
    }
    childWin.removeMenu()
    childWin.setMenu(null)
    childWin.loadFile('src/index_child.html')
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

const checkToken = async () => {
  const userid = store.get('user_id')
  const res = await axios.get(`${url}/task/${userid}`, {headers:{'x-access-token': store.get('token')}}).catch((err)=>store.delete('token'));
}

app.whenReady().then(() => {
  checkToken()
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


ipcMain.handle("login", async (event,data) => {
  const res = await axios.post("${url}/login",{email:data.email, password: data.password});
  // const body = await response.text();
  console.log(res.data)
  if(res.data.token){
    store.set('token', res.data.token)
    store.set('username', res.data.data.username)
    store.set('user_id', res.data.id)
    console.log('token save')
  }
  return res.data;
})

ipcMain.handle("register", async (event,data) => {
  const res = await axios.post("${url}/register",{username:data.username, email:data.email, password: data.password});
  // const body = await response.text();
  // console.log(res.data)
  return res.data;
})

ipcMain.handle("add-task", async (event, data) =>{
  data.userid = store.get('user_id')
  const res = axios.post(`${url}/task/add`, data,{headers:{'x-access-token': store.get('token')}});
  // console.log(res)
  return res.status;
} )

ipcMain.handle("get-tasks", async () =>{
  const userid = store.get('user_id')
  const res = await axios.get(`${url}/task/${userid}`, {headers:{'x-access-token': store.get('token')}});
  // console.log(res.data)
  return res.data
} )

ipcMain.handle("done-task", async (event, data) => {
  const task_id = data;
  const res = await axios.get(`${url}/task/done/${task_id}`, {headers:{'x-access-token': store.get('token')}});
  console.log(res.data);
  return res.data
})

ipcMain.handle("delete-task", async (event, data) => {
  const task_id = data
  console.log(data)
  const res = await axios.get(`${url}/task/delete/${task_id}`, {headers:{'x-access-token': store.get('token')}});
  console.log(res.data)
  return res.data
})

ipcMain.handle('get-user', () =>{
  return store.get('username');
})

ipcMain.handle('logout', ()=>{
  store.delete('token')
  store.delete('username')
  store.delete('user_id')
  console.log("Logout")
  return "logout success";
})


app.on('window-all-closed', () => {
  console.log()
  if (process.platform !== 'darwin') app.quit()
})

try {
  require('electron-reloader')(module)
} catch (_) {}