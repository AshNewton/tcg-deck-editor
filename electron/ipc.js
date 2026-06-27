const { ipcMain } = require("electron");
const { db } = require("./db.js");
const { v4: uuidv4 } = require("uuid");

function registerIpc() {
    ipcMain.handle("cardsGetAll", () => {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM cards", (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    });

    ipcMain.handle("getCardByName", (_event, name) => {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM cards WHERE name = ?", [name], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    });

    ipcMain.handle("cardsAdd", (_event, name) => {
        return new Promise((resolve, reject) => {
            const id = uuidv4();

            db.run(
                "INSERT INTO cards (id, name) VALUES (?, ?)",
                [id, name],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id, name });
                }
            );
        });
    });

    ipcMain.handle("cardsDelete", (_event, id) => {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM cards WHERE id = ?", [id], function (err) {
                if (err) reject(err);
                else resolve();
            });
        });
    });
}

module.exports = { registerIpc };