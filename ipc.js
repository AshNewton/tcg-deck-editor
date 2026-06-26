const { ipcMain } = require("electron");
const { db } = require("./db.js");

function registerIpc() {
    ipcMain.handle("cardsGetAll", () => {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM cards", (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    });

    ipcMain.handle("cardsAdd", (_event, name) => {
        return new Promise((resolve, reject) => {
            db.run(
                "INSERT INTO cards (name) VALUES (?)",
                [name],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID });
                }
            );
        });
    });
}

module.exports = { registerIpc };