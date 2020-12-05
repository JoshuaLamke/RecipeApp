var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            password text, 
            CONSTRAINT email_unique UNIQUE (email)
            )`,
        (err) => {})
        db.run(`CREATE TABLE recipe (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                name text,
                type text,
                servingAmount INTEGER,
                ingredients text,
                directions text,
                FOREIGN KEY (userId)
                REFERENCES user(id)
                ON DELETE CASCADE
                )`,
        (err) => {console.log(err)})

    }
});


module.exports = db
