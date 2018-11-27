// the main starting point for this node application
// load the express module
const express = require("express");

// load the path module
const path = require('path');

// load the pg module
const { Client } = require('pg');

// get the connection string
const connectionString = process.env.DATABASE_URL;

// create the DB connection
const db = new Client({
    connectionString: connectionString,
    ssl: true
});

// create the application
let app = express();

// create the port variable
const PORT = process.env.PORT || 5000;

// initialize the applciation
app.set("port", PORT)
    // set the static path
    .use(express.static(path.join(__dirname, 'public')))
    // set the views path
    .set('views', path.join(__dirname, 'views'))
    // ste the view engine
    .set('view engine', 'ejs')
    // set the home page of this application
    .get('/', (req, res) => res.render('pages/index'))
    // get a role
    .get('/getRole', (res, req) => {
        // get the id from the query string
        const { id } = req.query;

        // connect to the DB and pull a role's information
        db.connect().then(() => {
            // create the query string
            const query = 'SELECT r.role_name AS role, r.abilities AS abilities, v.versio_name AS version FROM pandemic_roles AS r NATURAL JOIN pandemic_version AS v WHERE r.role_id = ${id}';

            // run the query
            db.query(query).then( result => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result.rows[0]));
                console.log(JSON.stringify(result.rows[0]));
            })
        });

    })
    // begin listening
    .listen(PORT, function () {
        console.log(`Listening on ${PORT}`);
    });