const { db } = require("./db.js");

function initDb() {
    db.serialize(() => {
        db.run(`
      CREATE TABLE IF NOT EXISTS cards (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);
    });
}

module.exports = { initDb };