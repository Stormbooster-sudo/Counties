// preload.js
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  addTask: (payload) => ipcRenderer.invoke('add-task', payload),
  doneTask: (payload) => ipcRenderer.invoke('done-task', payload),
  deleteTask: (payload) => ipcRenderer.invoke('delete-task', payload),
  getTasks: () => ipcRenderer.invoke('get-tasks'),
  updateDateTask: (payload) => ipcRenderer.invoke('update-date-task', payload),
  closeWindow: ()=> ipcRenderer.invoke('close-win')
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

