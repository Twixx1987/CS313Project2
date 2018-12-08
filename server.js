// the main starting point for this node application
// load the express module
const express = require("express");

// load the path module
const path = require('path');

// load the pg module
const { Pool } = require('pg');

// create the connection string
const connectionString = process.env.DATABASE_URL ||
    'postgres://rwagrfklwyigdr:8a01d70f2a40160ae1df1d98015517047ee3bfd355614c4b475409d65d3dfa68@ec2-54-204-36-249.compute-1.amazonaws.com:5432/dbgo91pqnrtg2t';

// get the connection settings
var config = {
    connectionString: connectionString,
    port: process.env.DB_PORT || 5432,
    max: 7, // max number of connection can be open to database
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    ssl: true
};

// create the application
let app = express();

// create the port variable
const PORT = process.env.PORT || 5000;

// instantiate a new pool
var pool = new Pool(config);

/**************************************
 * This function is based on code from: 
 * https://stackoverflow.com/questions/49348254/how-to-connect-heroku-postgres-database-in-nodejs
 **************************************/
// a function to query the database
function query(query, callback) {
    // log the query string
    console.log(query);

    // query the DB
    pool.query(query).then(response => {
        // call the callback function once the query is complete
        callback(null, response.rows);
    }).catch(err => {
        // call the callback function with the error present if an error occured
        callback(err, null);
    })
}

// initialize the applciation
app.set("port", PORT)
    // set the static path
    .use(express.static(path.join(__dirname, 'js')))
    // set the views path
    .set('views', path.join(__dirname, 'views'))
    // ste the view engine
    .set('view engine', 'ejs')
    // set the home page of this application
    .get('/', (req, res) => res.render('pages/index'))
    // get all roles
    .get('/getRoles', (req, res) => {
        // create the qry string
        const qry = `SELECT r.role_name AS role, r.abilities AS abilities, v.version_name AS version FROM pandemic_roles AS r NATURAL JOIN pandemic_version AS v`;
        
        // call the function to query the databse
        query(qry, function(error, result) {
            // Make sure we got a row data, then prepare JSON to send back
            if (error || result == null) {
                // send the error back
                res.status(500).json({success: false, data: error});
                
                // log the error on the server
                console.log(error);
            } else {
                // create a variable to store the resulting data
                var role = result;

                // send the data back via the response
                res.status(200).json(role);
            }
        });
    })
    // get a role
    .get('/getRole', (req, res) => {
        // get the id from the url
        const id = req.query.id;

        // create the qry string
        const qry = `SELECT r.role_name AS role, r.abilities AS abilities, v.version_name AS version FROM pandemic_roles AS r NATURAL JOIN pandemic_version AS v WHERE r.role_id = ${id}`;
        
        // call the function to query the databse
        query(qry, function(error, result) {
            // Make sure we got a row data, then prepare JSON to send back
            if (error || result == null || result.length != 1) {
                // send the error back
                res.status(500).json({success: false, data: error});
                
                // log the error on the server
                console.log(error);
            } else {
                // create a variable to store the resulting data
                var role = result[0];

                // send the data back via the response
                res.status(200).json(role);
            }
        });
    })
    // get the Versions
    .get('/getVersions', (req, res) => {
        // create the qry string
        const qry = `SELECT version_name AS version FROM pandemic_version`;

        // call the function to query the databse
        query(qry, function(error, result) {
            // Make sure we got a row data, then prepare JSON to send back
            if (error || result == null) {
                // send the error back
                res.status(500).json({success: false, data: error});
                
                // log the error on the server
                console.log(error);
            } else {
                // create a variable to store the resulting data
                var versions = result;

                // send the data back via the response
                res.status(200).json(versions);
            }
        });
    })
    // get a Version
    .get('/getVersion', (req, res) => {
        // get the id from the url
        const id = req.query.id;

        // create the qry string
        const qry = `SELECT v.version_name AS version FROM pandemic_version AS v WHERE v.version_id = ${id}`;

        // call the function to query the databse
        query(qry, function(error, result) {
            // Make sure we got a row data, then prepare JSON to send back
            if (error || result == null || result.length != 1) {
                // send the error back
                res.status(500).json({success: false, data: error});
                
                // log the error on the server
                console.log(error);
            } else {
                // create a variable to store the resulting data
                var version = result[0];

                // send the data back via the response
                res.status(200).json(version);
            }
        });
    })
    // get a Game's Stats
    .get('/getGameStats', (req, res) => {
        // get the id from the url
        const id = req.query.id;

        // create the qry string
        const qry = `SELECT g.game_id, g.player_count, g.epidemic_count, g.outbreak_count, g.eradicate_count, g.cure_count, g.win FROM pandemic_game AS g WHERE g.game_id = ${id}`;

        // call the function to query the databse
        query(qry, function(error, result) {
            // Make sure we got a row data, then prepare JSON to send back
            if (error || result == null || result.length != 1) {
                // send the error back
                res.status(500).json({success: false, data: error});
                
                // log the error on the server
                console.log(error);
            } else {
                // create a variable to store the resulting data
                var game = result[0];

                // send the data back via the response
                res.status(200).json(game);
            }
        });
    })
    // get a Player's Game Count
    .get('/getPlayerGameCount', (req, res) => {
        // get the id from the url
        const id = req.query.id;

        // create the qry string
        const qry = `SELECT count(p.player_id) as game_count FROM pandemic_player AS p NATURAL JOIN pandemic_game AS g WHERE p.user_id= ${id} AND g.game_complete=TRUE`;

        // call the function to query the databse
        query(qry, function(error, result) {
            // Make sure we got a row data, then prepare JSON to send back
            if (error || result == null || result.length != 1) {
                // send the error back
                res.status(500).json({success: false, data: error});
                
                // log the error on the server
                console.log(error);
            } else {
                // create a variable to store the resulting data
                var gameCount = result[0];

                // send the data back via the response
                res.status(200).json(gameCount);
            }
        });
    })
    // get a Player's Win Count
    .get('/getPlayerWinCount', (req, res) => {
        // get the id from the url
        const id = req.query.id;

        // create the qry string
        const qry = `SELECT count(p.player_id) as game_count FROM pandemic_player AS p NATURAL JOIN pandemic_game AS g WHERE p.user_id= ${id} AND g.game_complete=TRUE AND g.win=TRUE`;

        // call the function to query the databse
        query(qry, function(error, result) {
            // Make sure we got a row data, then prepare JSON to send back
            if (error || result == null || result.length != 1) {
                // send the error back
                res.status(500).json({success: false, data: error});
                
                // log the error on the server
                console.log(error);
            } else {
                // create a variable to store the resulting data
                var winCount = result[0];

                // send the data back via the response
                res.status(200).json(winCount);
            }
        });
    })
    // get a Player's Role Statistics
    .get('/getPlayerRoleStats', (req, res) => {
        // get the id from the url
        const id = req.query.id;

        // create the qry string
        const qry = 
        `SELECT r.role_name AS role, COUNT(gp.role_id) AS play_count FROM (SELECT p.role_id AS role_id, p.user_id AS user_id FROM pandemic_player AS p JOIN pandemic_game AS g ON (p.game_id=g.game_id) WHERE g.game_complete = TRUE AND p.user_id=${id}) AS gp JOIN pandemic_roles AS r ON (gp.role_id=r.role_id) GROUP BY r.role_name ORDER BY play_count DESC, role_name`;

        // call the function to query the databse
        query(qry, function(error, result) {
            // Make sure we got a row data, then prepare JSON to send back
            if (error || result == null) {
                // send the error back
                res.status(500).json({success: false, data: error});
                
                // log the error on the server
                console.log(error);
            } else {
                // create a variable to store the resulting data
                var roleCount = result;

                // send the data back via the response
                res.status(200).json(roleCount);
            }
        });
    })
    // begin listening
    .listen(PORT, function () {
        console.log(`Listening on ${PORT}`);
    });




