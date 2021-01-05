const {Client} = require('pg')

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})
client.connect()
client.query('SELECT NOW()', (err, res) => {
    if(err) {
        console.log(err)
    }
    else{
        console.log("connected to database.")
    }
})
const table1sql = `CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT, 
    email TEXT, 
    password TEXT, 
    CONSTRAINT email_unique UNIQUE (email)
    )`;

client.query(table1sql, (err, res) => {
    if(err) {
        console.log()
    }
    else {
        console.log("user table succesfully created")
    }
})

const table2sql = `CREATE TABLE recipe (
    id SERIAL PRIMARY KEY,
    userId INTEGER,
    name text,
    type text,
    servingAmount INTEGER,
    ingredients text,
    directions text,
    FOREIGN KEY (userId)
    REFERENCES users(id)
    ON DELETE CASCADE
    )`;

client.query(table2sql, (err, res) => {
    if(err) {
        console.log()
    }
    else {
        console.log("recipes table successfully created")
    }
})
module.exports = client