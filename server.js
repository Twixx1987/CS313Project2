// the main starting point for this node application
// load the express module
const express = require("express");

// load the path module
const path = require('path');

// load the pg module

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
    // begin listening
    .listen(PORT, function () {
        console.log(`Listening on ${PORT}`);
    });