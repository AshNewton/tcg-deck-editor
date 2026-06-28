const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("db", {
    getCards: () => ipcRenderer.invoke("cardsGetAll"),
    getCardByName: (name) => ipcRenderer.invoke("getCardByName", name),
    addCard: (name, game, copies) => ipcRenderer.invoke("cardsAdd", name, game, copies),
    deleteCard: (id) => ipcRenderer.invoke("cardsDelete", id),
    addCopy: (id, amount) => ipcRenderer.invoke("cardsIncreaseCopies", id, amount),
    removeCopy: (id, amount) => ipcRenderer.invoke("cardsDecreaseCopies", id, amount),
});
