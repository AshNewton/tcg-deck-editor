const path = require("path");
const { app } = require("electron");

const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(app.getPath("userData"), "app.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("DB error:", err);
    else console.log("SQLite ready:", dbPath);
});

module.exports = { db };