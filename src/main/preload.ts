import { contextBridge, ipcRenderer } from 'electron'
contextBridge.exposeInMainWorld('electronAPI', {
  saveFile: (value: string) => ipcRenderer.invoke('dialog:saveFile', value),
  updateFile: (value: string) => ipcRenderer.invoke('dialog:updateFile', value),
})
