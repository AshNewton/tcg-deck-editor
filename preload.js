const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("db", {
    getCards: () => ipcRenderer.invoke("cardsGetAll"),
    getCardByName: (name) => ipcRenderer.invoke("getCardByName", name),
    addCard: (name) => ipcRenderer.invoke("cardsAdd", name),
    deleteCard: (id) => ipcRenderer.invoke("cardsDelete", id),
});
