/*********************************************************************
* This function generates the content of the home page
**********************************************************************/
function loadHome() {
    // get the roles and display the content
    $.get('./getRoles', function (result) {
        // get the length of the object array
        let length = result.length;

        // create a variable to store the HTML for the display content
        let text = "<h2>Pandemic the Game</h2>"
                 + "<p> As skilled members of a disease-fighting team, you "
                 + "and the other players work together to keep the world "
                 + "safe from outbreaks and epidemics. Only through teamwork "
                 + "will you have a chance to find a cure.</p><p>Pandemic is "
                 + "a cooperative board game in which players work as a team "
                 + "to treat infections around the world while gathering "
                 + "resources for cures. First published in 2007, the game's "
                 + "unique combination of cooperative gameplay, engrossing "
                 + "premise, and compelling design have proved a hit with "
                 + "everyone from hardcore gamers to casual players. The "
                 + "Pandemic game line now includes multiple expansions "
                 + "and stand-alone titles.</p><table><tr><th>Version</th>"
                 + "<th>Role</th><th>Abilities</th></tr>";

        // loop through the array object displaying each role
        for (let count = 0; count < length; count++) {
            // return a row with the role details to the text variable
            text += "<tr id='Role_"
                 + (result[count].role_id > 9 ? result[count].role_id : '0' + result[count].role_id)
                 + "'><td>" + result[count].version + "</td><td>"
                 + result[count].role + "</td><td>"
                 + result[count].abilities + "</td></tr>";
        }

        // close the table
        text += "</table>";

        // set the table as the content of the mainContent div
        $("#mainContent").html(text);

    })

    // return 
    return;
}

/*************************************************************************
*This function generates the content of the statistics page
***************************************************************************/
function loadPlayerRoleStats(userId) {
    // empty the contents fo main content
    $("#mainContent").empty();

    // append a header to the div
    $("#mainContent").append("<h2>Your Statistics</h2>");

    // call the statistics functions
    getPlays(userId);
    getWins(userId);
    getStats(userId);

    // return 
    return;
}

/*************************************************************************
*This function gets the play count
***************************************************************************/
function getPlays(userId) {
    // get the player's game count
    $.get("./getPlayerGameCount?id=" + userId, function (result) {
        // create the output
        let text = "<p>You have played " + result.game_count + " game(s).</p>";

        // append the output to main content
        $("#mainContent").append(text);
    });
}

/*************************************************************************
*This function gets the win count
***************************************************************************/
function getWins(userId) {
    $.get("./getPlayerWinCount?id=" + userId, function (result) {
        // create the output
        let text = "<p>You have won " + result.game_count + " game(s).</p>";

        // append the output to main content
        $("#mainContent").append(text);
    });
}

/*************************************************************************
*This function gets the role play statistics
***************************************************************************/
function getStats(userId) {
    $.get("./getPlayerRoleStats?id=" + userId, function (result) {
        // append a header to the div
        $("#mainContent").append("<h2>Your Play Frequencyper Role</h2>");

        // get the length of the object array
        let length = result.length;

        // create a variable to store the HTML for the display content
        let text = "<table><tr><th>Role</th><th>Number of Plays</th></tr>";

        // loop through the array object displaying each role
        for (let count = 0; count < length; count++) {
            // return a row with the role details to the text variable
            text += "<tr><td>" + result[count].role + "</td><td>"
                 + result[count].play_count + "</td></tr>";
        }

        // close the table
        text += "</table>";

        // append the table to the content of the mainContent div
        $("#mainContent").append(text);
    });
}

/*************************************************************************
*This function generates the settings page
***************************************************************************/
function loadSettings() {
    // empty the main content div
    $("#mainContent").empty();

    // add clear all and select all buttons inside a flexbox div
    $("#mainContent").append("<div id='btnFlex' class='d-flex justify-content-around'></div>");
    $("#btnFlex").append("<button id='clearSettings' onclick='clearSettings()' class='btn-secondary btn'>Clear Settings</button>");
    $("#btnFlex").append("<button id='applyAll' onclick='applyAll()' class='btn-secondary btn'>Apply All</button>");

    // get teh settings
    getVersionSettings();
}

/*************************************************************************
*This function gets the settings for the versions
***************************************************************************/
function getVersionSettings() {
    $.get("./getVersions", function (result) {
        // get the length of the object array
        let length = result.length;

        // append a header indicating version selections
        $("#mainContent").append("<h2>Toggle Versions</h2>");

        // append a section for the version selection
        $("#mainContent").append("<div id='versionFlex' class='d-flex justify-content-around'></div>");

        // loop through the array object displaying each version
        for (let count = 0; count < length; count++) {
            // append a button with each version name
            $("#versionFlex").append("<button id='Version_" + result[count].version_id + "' class='btn-tertiary btn' onclick='selectVersion(this)'>" + result[count].version + "</button>");
        }

        getRoleSettings();
    });
}

/*************************************************************************
*This function selects each role from the selected version
***************************************************************************/
function selectVersion(element) {
    // get the version id
    let versionId = element.id;

    // get an array of role elements
    let roles = document.getElementsByClassName(versionId);

    // loop through the cards resetting them to unchecked
    for (let i = 0; i < roles.length; i++) {
        // if the role is checked
        if (roles[i].classList.contains("checked")) {
            // add unchecked and remove checked
            roles[i].classList.add("unchecked");
            roles[i].classList.remove("checked");
        } else {
            // add unchecked and remove checked
            roles[i].classList.add("checked");
            roles[i].classList.remove("unchecked");
        }
    }
}

/*************************************************************************
*This function gets the settings for the roles
***************************************************************************/
function getRoleSettings() {
    // get the roles
    $.get('./getRoles', function (result) {
        // create the header
        $("#mainContent").append("<h2>Role Selection Settings</h2>");

        // get the length of the object array
        let length = result.length;

        // get the role details
        let text = "<table><tr><th>Version</th>"
                 + "<th>Role</th><th>Abilities</th></tr>";

        // loop through the array object displaying each role
        for (let count = 0; count < length; count++) {
            // get the role ID
            let id = "Role_" + (result[count].role_id > 9 ? result[count].role_id : '0' + result[count].role_id);
            // return a row with the role details to the text variable
            text += "<tr onclick='toggleSetting(this)' id='" + id + "' class='roles "
                 + (localStorage.pandemicRoles.indexOf(id) != -1 ? "checked" : "unchecked")
                 + " Version_" + result[count].version_id + "'><td>" + result[count].version + "</td><td>"
                 + result[count].role + "</td><td>"
                 + result[count].abilities + "</td></tr>";
        }

        // close the table
        text += "</table>";

        // set the table as the content of the mainContent div
        $("#mainContent").append(text);
    });
}

/*************************************************************************
*This function toggles the clicked role as selected/unselected
***************************************************************************/
function toggleSetting(element) {
    // get the id of the element
    let id = element.getAttribute("id");

    // create an array to store the roles
    let roles = [];

    // get the roles from loacl storage
    if (localStorage.pandemicRoles)
        roles = JSON.parse(localStorage.pandemicRoles);

    // check to see if the role is in storage
    if (roles.indexOf(id) != -1) {
        // remove the role from local storage
        roles.splice(roles.indexOf(id), 1);
    } else {
        // add the role to the local stoarge list
        roles.push(id);
    }
    // put the new roles list into local storage
    localStorage.pandemicRoles = JSON.stringify(roles);

    // toggle the classes for the selected role
    element.classList.toggle("checked");
    element.classList.toggle("unchecked");
}

/*********************************************************************
* This function clears the local storage for a specific game
**********************************************************************/
function clearSettings() {
    // if there is local storage for the selected game clear it out
    if (localStorage.pandemicRoles) {
        localStorage.removeItem('pandemicRoles');
    }

    // get an array of role elements
    let roles = document.getElementsByClassName('roles');

    // loop through the cards resetting them to unchecked
    for (let i = 0; i < roles.length; i++) {
        // if the role is checked
        if (roles[i].classList.contains("checked")) {
            // add unchecked and remove checked
            roles[i].classList.add("unchecked");
            roles[i].classList.remove("checked");
        }
    }

    // create local storage for the role selection
    if (!localStorage.pandemicRoles) {
        localStorage.pandemicRoles = [];
    }
}

/*********************************************************************
* This function selects all the roles
**********************************************************************/
function applyAll() {
    // get an array of role elements
    let roleRows = document.getElementsByClassName('roles');

    // loop through the cards resetting them to unchecked
    for (let i = 0; i < roleRows.length; i++) {
        // if the role is checked
        if (roleRows[i].classList.contains("unchecked")) {
            // add unchecked and remove checked
            roleRows[i].classList.add("checked");
            roleRows[i].classList.remove("unchecked");
        }

        // create an array to store the roles
        let roles = [];

        // get the roles from loacl storage
        if (localStorage.pandemicRoles != "")
            roles = JSON.parse(localStorage.pandemicRoles);

        // check to see if the role is in storage
        if (roles.indexOf(roleRows[i]) == -1) {
            // add the role to the local stoarge list
            roles.push(roleRows[i]);
        }
        // put the new roles list into local storage
        localStorage.pandemicRoles = JSON.stringify(roles);
    }
}

/*********************************************************************
* This function loads the host game page
**********************************************************************/
function loadHost() {
    // empty the main content div
    $("#mainContent").empty();

    // add a header to the page
    $("#mainContent").append("<h2>Host Game</h2>");

    // append the disclosure about hosting a game
    $("#mainContent").append("<p>To host a game you first need to ensure that you have setup the character choices on the settings page. You will need to provide a Game ID to the players that will join. This ID will be provided once the game is initialized.</p>");

    // append the anticipated player count input field
    $("#mainContent").append("<label for='playerCount'>Anticipated Number of Players</label>");
    $("#mainContent").append("<input type='number' id='playerCount' min=2 max=5 name='playerCount' />");

    // append the button to generate a game id
    $("#mainContent").append("<br /><br /><button class='btn btn-secondary' id='hostGame' onclick='hostGame()'>Host Game</button>");
}

/*********************************************************************
* This function starts a game
**********************************************************************/
function hostGame() {
    // get the host id from session storage
    let id = sessionStorage.userid;

    // get the player count from the input field
    let playerCount = $('#playerCount').val();

    // check the player count prior to sending the host game request
    if (playerCount < 2 || playerCount > 5) {
        // return an error
        $('#mainContent').append("<div id='error'>The Player Count must be between 2 and 5 players.</div>");
    }
        // otherwise continue with processing
    else {
        // get the parameters for the post to database
        let params = {
            playerCount: playerCount,
            id: id
        }

        // call the create game route
        $.post("/createGame", params, (err, result) => {
            // get the game id
            let gameId = result.insertId;

            // empty the main content div
            $("#mainContent").empty();

            // add a header to the page
            $("#mainContent").append("<h2>Game #" + gameId + "</h2>");

            // append the disclosure about hosting a game
            $("#mainContent").append("<p>Your game has been created. You will need to provide the Game ID to the players that will join.</p>");

        }).fail(function (result) {
            $("#mainContent").text("An Error occured and the game was not created. Please try again.");
        });
    }
}

function login() {
    var username = $("#username").val();
    var password = $("#password").val();

    var params = {
        username: username,
        password: password
    };

    $.post("/login", params, function (result) {
        if (result && result.success) {
            $("#status").text("Successfully logged in.");
        } else {
            $("#status").text("Error logging in.");
        }
    });
}

function logout() {
    $.post("/logout", function (result) {
        if (result && result.success) {
            $("#status").text("Successfully logged out.");
        } else {
            $("#status").text("Error logging out.");
        }
    });
}