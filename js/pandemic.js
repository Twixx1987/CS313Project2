/*********************************************************************
* This function is derived from code on W3Schools.com
* Source: https://www.w3schools.com/js/js_ajax_http_response.asp
**********************************************************************/
// open a JSON File and perform some action
function openJson(url, callbackFunc) {
    // initiate a new XMLHttp request
    let xmlhttp = new XMLHttpRequest();

    // function to perform upon request completion
    xmlhttp.onreadystatechange = function () {
        // check for completion and ok status
        if (this.readyState == 4 && this.status == 200) {
            // initiate callback function
            callbackFunc(this);
        }
    }
    // create the request specifics
    xmlhttp.open("GET", url, true);

    // send the request to the server
    xmlhttp.send();
}

/*********************************************************************
* This function generates the content of the home page
**********************************************************************/
// load the contents into home page
function loadHome(xhttp) {
    // create an object and parse the JSON file
    let pandemicObj = JSON.parse(xhttp.responseText);

    // get the length of the object array
    let length = pandemicObj.length;

    // create a variable to store the HTML for the display content
    let text = "<table><tr><th>Version</th><th>Role</th><th>Abilities</th></tr>";

    // loop through the array object displaying each role
    for (let count = 0; count < length; count++) {
        // return a row with the role details to the text variable
        text += "<tr><td>" + role.version + "</td><td>" + role.role
             + "</td><td>" + role.abilities + "</td></tr>";
    }

    // close the table
    text += "</table>";

    // set the table as the content of the mainContent div
    let main = document.getElementById("mainContent");
    main.innerHTML = text;

    // return 
    return;
}

/*************************************************************************
*
***************************************************************************/
