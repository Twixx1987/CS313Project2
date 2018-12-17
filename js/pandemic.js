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
            text += "<tr id='Role_" + (count > 10 ? count : '0' + count) 
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

        // create a flexbox div
        $("#mainContent").append("<div id='versionFlex' class='flex'>");

        // loop through the array object displaying each version
        for (let count = 0; count < length; count++) {
            // append a div with the version name and a checkbox
            $("#versionFlex").append("<div>" + result[count].version + "</div>");
        }

        getRoleSettings();
    });
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
            // return a row with the role details to the text variable
            text += "<tr onclick='toggleSetting(this)' id='Role_"
                 + (count > 10 ? count : '0' + count)
                 + "'><td>" + result[count].version + "</td><td>"
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
    if (localStorage.pandemicRoles != "")
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

    // toggle the classes for the selected card
    element.classList.toggle("checked");
    element.classList.toggle("unchecked");
}