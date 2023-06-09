// preload.js
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  addTask: (payload) => ipcRenderer.invoke('add-task', payload),
  doneTask: (payload) => ipcRenderer.invoke('done-task', payload),
  deleteTask: (payload) => ipcRenderer.invoke('delete-task', payload),
  deleteBatchTasks: (payload) => ipcRenderer.invoke('delete-batch-tasks', payload),
  getTasks: () => ipcRenderer.invoke('get-tasks'),
  updateDateTask: (payload) => ipcRenderer.invoke('update-date-task', payload),
  closeWindow: () => ipcRenderer.invoke('close-win'),
  setAutoLaunch: (payload) => ipcRenderer.invoke('set-auto-launch', payload),
  setTheme: (payload) => ipcRenderer.invoke('set-theme', payload),
  setAlwayTop: (payload) => ipcRenderer.invoke("set-alway-top", payload)
})

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})

