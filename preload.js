const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("db", {
    getCards: () => ipcRenderer.invoke("cardsGetAll"),
    addCard: (name) => ipcRenderer.invoke("cardsAdd", name),
});
