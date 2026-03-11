const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  onUpdateDownloaded: (callback) => {
    ipcRenderer.once('update-downloaded', (_event, version) => callback(version));
  },
});
