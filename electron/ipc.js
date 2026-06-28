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

    ipcMain.handle("cardsAdd", (_event, name, game, copies) => {
        return new Promise((resolve, reject) => {
            const id = uuidv4();

            db.run(
                "INSERT INTO cards (id, name, game, copies) VALUES (?, ?, ?, ?)",
                [id, name, game, copies],
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

    ipcMain.handle("cardsIncreaseCopies", (_event, id, amount = 1) => {
        return new Promise((resolve, reject) => {
            db.run(
                "UPDATE cards SET copies = copies + ? WHERE id = ?",
                [amount, id],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id, updated: this.changes });
                }
            );
        });
    });

    ipcMain.handle("cardsDecreaseCopies", (_event, id, amount = 1) => {
        return new Promise((resolve, reject) => {
            db.run(
                `
                UPDATE cards
                SET copies = CASE 
                    WHEN copies - ? < 0 THEN 0
                    ELSE copies - ?
                END
                WHERE id = ?
                `,
                [amount, amount, id],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id, updated: this.changes });
                }
            );
        });
    });
}

module.exports = { registerIpc };