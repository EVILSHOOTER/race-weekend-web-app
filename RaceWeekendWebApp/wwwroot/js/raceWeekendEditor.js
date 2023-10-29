var weekendName = "Race weekend";

var soft_tyreSets = 0;
var medium_tyreSets = 0;
var hard_tyreSets = 0;
var tyreSet_range = [0, 20];

var sessions = "";
var sessionLimit = 10;

var free_ReturnTyreSets = 0;
var qualifying_ReturnTyreSets = 0;
var returnTyreSet_range = [0, 20];

var sessionData = []; // for use in the session overview.

// for the session name, make empty inputs default to a basic name
const input_weekendName = document.getElementById("input_session_name");
input_weekendName.addEventListener("change", (event) => {
    if (input_weekendName.value == "") {
        input_weekendName.value = "Race weekend";
    }
    weekendName = input_weekendName.value;
});

// question 1: no of tyre sets.
const input_tyreSets = document.getElementsByClassName("tyreset_number");
function inputTyreSet(i) {
    input_tyreSets[i].addEventListener("change", (event) => {
        numberClamp(input_tyreSets[i], tyreSet_range);

        soft_tyreSets = input_tyreSets[0].value;
        medium_tyreSets = input_tyreSets[1].value;
        hard_tyreSets = input_tyreSets[2].value;
    });
}

// clamp the values so people can't pick too high or low.
function numberClamp(element, values) {
    var number = Math.min(Math.max(element.value, values[0]), values[1]);
    element.value = number;
}

for (var i = 0; i < input_tyreSets.length; i++) {
    inputTyreSet(i); // 0. Soft. 1. Medium. 2. Hard.
}



// question 2: pick your sessions
var draggables = document.querySelectorAll(".draggable");
var containers = document.querySelectorAll(".session_container");

// dragging individual blocks
draggables.forEach(draggable => {
    makeElementDraggable(draggable);
});

function makeElementDraggable(draggable) {
    draggable.addEventListener("dragstart", () => {
        draggable.classList.add("dragging");
    });
    draggable.addEventListener("dragend", () => {
        draggable.classList.remove("dragging");
        endDrag();
    });
}

// dragging into containers.
containers.forEach(container => {
    container.addEventListener("dragover", event => {
        event.preventDefault(); // dragging is prevented by default. allow it.

        const afterElement = getDragAfterElement(container, event.clientY); // container and mouse's Y pos.
        //console.log(afterElement);

        const draggable = document.querySelector(".dragging");

        if (afterElement == null) {
            container.appendChild(draggable);
        } else {
            container.insertBefore(draggable, afterElement);
        }
    });
});

// connect the buttons for adding and removing sessions
const sessionButtons = document.getElementsByClassName("session_button");

function addFreeSessionBlock(container) {
    const session = document.createElement("p");
    session.innerHTML = "Free session";
    session.draggable = true;
    session.classList.add("sessionBlock");
    session.classList.add("free");
    session.classList.add("draggable");
    makeElementDraggable(session);

    container.appendChild(session);
}
function addQualifyingSessionBlock(container) {
    const session = document.createElement("p");
    session.innerHTML = "Qualifying session";
    session.draggable = true;
    session.classList.add("sessionBlock");
    session.classList.add("qual");
    session.classList.add("draggable");
    makeElementDraggable(session);

    container.appendChild(session);
}

function sessionButton(i) {
    const container = containers[0];

    sessionButtons[i].addEventListener("click", () => {
        const noOfSessions = container.getElementsByClassName("sessionBlock");

        if (i == 0 || i == 1) { // session limits in adding.
            if (noOfSessions.length >= sessionLimit) {
                return;
            }
        }

        if (i == 0) {
            addFreeSessionBlock(container);
        } else if (i == 1) {
            addQualifyingSessionBlock(container);
        } else if (i == 2) {

            if (noOfSessions.length > 0) {
                container.removeChild(container.lastElementChild);
            }
        }
        endDrag();
    });
}

for (var i = 0; i < sessionButtons.length; i++) {
    sessionButton(i); // 0. Add Free. 1. Add Qual. 2. Remove last.
}


// finding the position of where the box has been dragged to.
function getDragAfterElement(container, mouseY) {
    const draggableElements = [...container.querySelectorAll(".draggable:not(.dragging)")]; // get all draggables, ignore dragging. then spread them all into an array

    // iterates through list backwards, running a function on each value. (function(total, currentlySelectedValue), {initialValues})
    const closestElementRetrieved = draggableElements.reduce((closestElement, currentElement) => {

        // get center pos of element + your mouse pos
        const box = currentElement.getBoundingClientRect();
        const offset = mouseY - box.top - box.height / 2;  //mouseY - (box.top-(box.height/2));

        //console.log(offset);

        // if above AND closest to current element, return it. else, return the closest so far.
        if (offset < 0 && offset > closestElement.offset) {
            return { offset: offset, element: currentElement };
        } else {
            return closestElement;
        }

    }, { offset: Number.NEGATIVE_INFINITY }).element;

    return closestElementRetrieved;
}

// when session block is dropped, do a few things.
function endDrag() {
    // name the sessions with their number orders. (FP1, FP2, etc...)
    const freeSessions = document.querySelectorAll(".free");
    const qualSessions = document.querySelectorAll(".qual");

    freeSessions.forEach((element, index, array) => {
        element.innerHTML = "Free session " + (index + 1);
    });
    qualSessions.forEach((element, index, array) => {
        element.innerHTML = "Qualifying " + (index + 1);
    });

    // get all the elements in the div, and form the string that contains the sessions in it (e.g. 1112)
    const sessionBlocks = document.querySelectorAll(".sessionBlock");
    sessions = "";
    sessionBlocks.forEach((element, index, array) => {
        if (element.classList.contains("free")) {
            sessions += "1";
        } else {
            sessions += "2";
        }
    });
    console.log(sessions);
}


// question 3: how many tyre sets would you want returned at the end of each session?
// very similar to q1.
const input_returns = document.getElementsByClassName("returns_number");
function inputReturns(i) {
    input_returns[i].addEventListener("change", (event) => {
        numberClamp(input_returns[i], returnTyreSet_range);

        free_ReturnTyreSets = input_returns[0].value;
        qualifying_ReturnTyreSets = input_returns[1].value;
    });
}

for (var i = 0; i < input_returns.length; i++) {
    inputReturns(i); // 0. Free. 1. Qual.
}

// question 4 - overview.

const table = document.getElementsByClassName("session_table")[0];
// copy of the Session row.
const sessionRow = table.querySelector("#session_display_template").cloneNode(true);
sessionRow.id = "";
table.querySelector("#session_display_template").remove();

// copy of the Race Session row.
const raceSessionRow = table.querySelector("#race_session_display_template").cloneNode(true);
raceSessionRow.id = "";
table.querySelector("#race_session_display_template").remove();

// copy of the Uses row.
const useRow = table.querySelector("#session_useTyres_template").cloneNode(true);
useRow.id = "";
table.querySelector("#session_useTyres_template").remove();

// copy of the Returns row.
const returnRow = table.querySelector("#session_returnTyres_template").cloneNode(true);
returnRow.id = "";
table.querySelector("#session_returnTyres_template").remove();

// this runs every time an input is changed.
function generateOverview() {
    // clear table.
    document.querySelectorAll(".session_display").forEach(el => el.remove());
    document.querySelectorAll(".returns_display").forEach(el => el.remove());
    document.querySelectorAll(".use_display").forEach(el => el.remove());

    // get sessions and create a neat table out of them, containing all the details.
    const sessions = document.getElementsByClassName("sessionBlock");

    // create the table of tyresets over sessions. save temporary numbers here. use a dictionary.
    // Free = total tyresets left available. Used = tyresets to be used/returned.
    sessionData = [
        //{Name: "Free session 1", Soft_free: 8, Medium_free: 3, Hard_free: 2, Soft_used: 0, Medium_used: 0, Hard_used: 0, Soft_returns: 0, Medium_returns: 0, Hard_returns: 0}
    ]

    // populate the table with data. this'll be used to form the table we see. also allows for easy management in the future.
    for (var i = 0; i < sessions.length; i++) {
        const session = sessions[i];
        const sessionName = session.innerHTML

        sessionData.push({
            Name: sessionName,
            Soft_free: soft_tyreSets,
            Medium_free: medium_tyreSets,
            Hard_free: hard_tyreSets,
            Soft_used: 0,
            Medium_used: 0,
            Hard_used: 0,

            Soft_uses: 0, // a separate input for you to use tyres.
            Medium_uses: 0,
            Hard_uses: 0,
            Soft_returns: 0,
            Medium_returns: 0,
            Hard_returns: 0,
            // and the corresponding HTML elements for them.
            display_Soft_free: null,
            display_Medium_free: null,
            display_Hard_free: null,
            display_Soft_used: null,
            display_Medium_used: null,
            display_Hard_used: null,

            display_Soft_uses: null, // a separate input for you to use tyres.
            display_Medium_uses: null,
            display_Hard_uses: null,
            display_Soft_returns: null,
            display_Medium_returns: null,
            display_Hard_returns: null
        });

    }
    console.log(sessionData);

    // all tyresets should be free until you start using them.

    // create the visual table for users to visualise + interact with used and return numbers.
    for (var i = 0; i < sessionData.length; i++) {
        var session = sessionData[i];
        var sessionType = "Free";

        var newSessionRow = sessionRow.cloneNode(true);
        newSessionRow.querySelector(".session_name").innerHTML = session["Name"];

        if (session["Name"].includes("Qualifying")) { // if qualifying, make this yellow.
            sessionType = "Qualifying";
            newSessionRow.querySelector(".session_name").style.backgroundColor = "#d98911";
        }

        // the use row - for people to use tyres, and this affects further sessions
        var sessionUseRow = useRow.cloneNode(true);
        sessionUseRow.querySelector(".uses_row_text").innerHTML = "Use tyre sets";

        // the extra return row.
        var sessionsReturnsRow = returnRow.cloneNode(true);
        var returnTyreNumber = 0;
        if (sessionType == "Free") {
            returnTyreNumber = free_ReturnTyreSets;
        } else { returnTyreNumber = qualifying_ReturnTyreSets; }
        sessionsReturnsRow.querySelector(".returns_row_text").innerHTML = "Return: " + returnTyreNumber + " tyresets";

        // fill the dictionary entry with the HTML elements for ease of use.
        sessionData[i]["display_Soft_free"] = [...newSessionRow.querySelectorAll(".free_number")][0];
        sessionData[i]["display_Medium_free"] = [...newSessionRow.querySelectorAll(".free_number")][1];
        sessionData[i]["display_Hard_free"] = [...newSessionRow.querySelectorAll(".free_number")][2];

        sessionData[i]["display_Soft_used"] = [...newSessionRow.querySelectorAll(".used_number")][0];
        sessionData[i]["display_Medium_used"] = [...newSessionRow.querySelectorAll(".used_number")][1];
        sessionData[i]["display_Hard_used"] = [...newSessionRow.querySelectorAll(".used_number")][2];

        sessionData[i]["display_Soft_uses"] = [...sessionUseRow.querySelectorAll(".overview_uses_number")][0];
        sessionData[i]["display_Medium_uses"] = [...sessionUseRow.querySelectorAll(".overview_uses_number")][1];
        sessionData[i]["display_Hard_uses"] = [...sessionUseRow.querySelectorAll(".overview_uses_number")][2];

        sessionData[i]["display_Soft_returns"] = [...sessionsReturnsRow.querySelectorAll(".overview_returns_number")][0];
        sessionData[i]["display_Medium_returns"] = [...sessionsReturnsRow.querySelectorAll(".overview_returns_number")][1];
        sessionData[i]["display_Hard_returns"] = [...sessionsReturnsRow.querySelectorAll(".overview_returns_number")][2];


        // connect the Used and Return inputs to the big table. (they should also know the Free column to edit that). these inputs connect to sessionData[i]
        const freeTyresetDisplays = newSessionRow.querySelectorAll(".free_number");
        const useInputs = sessionUseRow.querySelectorAll(".overview_uses_number");
        const returnInputs = sessionsReturnsRow.querySelectorAll(".overview_returns_number");

        useInputs.forEach((input, index, array) => {
            input.addEventListener("change", (event) => {
                numberClamp(input, [0, 100])

                updateOverview(); //upon changing the returns value, update the entire table and dictionary.
            });
        });

        returnInputs.forEach((input, index, array) => {
            input.addEventListener("change", (event) => {
                numberClamp(input, [0, 100])

                updateOverview(); //upon changing the returns value, update the entire table and dictionary.
            });
        });


        table.appendChild(newSessionRow);
        table.appendChild(sessionUseRow);
        table.appendChild(sessionsReturnsRow);
    }

    // finally, create one more session: the Race session.
    // instead, this will have tyres left for use.
    var newRaceSessionRow = raceSessionRow.cloneNode(true);

    // add table entry for race session since we are at the end now. it only makes sense.
    sessionData.push({
        Name: "Race session",
        Soft_free: 0,
        Medium_free: 0,
        Hard_free: 0,
        Soft_used: 0,
        Medium_used: 0,
        Hard_used: 0,
        // and the corresponding HTML elements for them.
        display_Soft_free: [...newRaceSessionRow.querySelectorAll(".free_number")][0],
        display_Medium_free: [...newRaceSessionRow.querySelectorAll(".free_number")][1],
        display_Hard_free: [...newRaceSessionRow.querySelectorAll(".free_number")][2],
        display_Soft_used: [...newRaceSessionRow.querySelectorAll(".used_number")][0],
        display_Medium_used: [...newRaceSessionRow.querySelectorAll(".used_number")][1],
        display_Hard_used: [...newRaceSessionRow.querySelectorAll(".used_number")][2]

    }); // contains less data since it is not controlled by the user.

    table.appendChild(newRaceSessionRow);
}

function updateOverview() {
    // parse through the sessionData (i think this should have the HTML elements indexed in here to be nice.)

    // start kinda afresh: NEVER change the initial free tyresets + user values.
    // ONLY clamp when there are limits (e.g. cant do more than 4 used if there are only 3 free)
    // we go index by index (session by session)
    for (var i = 0; i < sessionData.length; i++) {
        // first, set a baseline.
        if (i == 0) { // set the free tyres first.
            sessionData[i]["Soft_free"] = parseInt(soft_tyreSets);
            sessionData[i]["Medium_free"] = parseInt(medium_tyreSets);
            sessionData[i]["Hard_free"] = parseInt(hard_tyreSets);
            sessionData[i]["Soft_used"] = 0;
            sessionData[i]["Medium_used"] = 0;
            sessionData[i]["Hard_used"] = 0;
        } else {
            sessionData[i]["Soft_free"] = sessionData[i - 1]["Soft_free"];
            sessionData[i]["Medium_free"] = sessionData[i - 1]["Medium_free"];
            sessionData[i]["Hard_free"] = sessionData[i - 1]["Hard_free"];
            sessionData[i]["Soft_used"] = sessionData[i - 1]["Soft_used"];
            sessionData[i]["Medium_used"] = sessionData[i - 1]["Medium_used"];
            sessionData[i]["Hard_used"] = sessionData[i - 1]["Hard_used"];
        }
        // if last one, it's the Race Session. do this and skip to the end. just display and move on.
        if (i == sessionData.length - 1) {
            displayUpdate();
            continue;
        }

        // secondly, the input values affect the session. let's start with using tyres.
        // get and clamp the USE input values to number of free+used tyres left
        numberClamp(sessionData[i]["display_Soft_uses"], [0, parseInt(sessionData[i]["Soft_free"])]); // once FREEs are used, they remain used.
        numberClamp(sessionData[i]["display_Medium_uses"], [0, parseInt(sessionData[i]["Medium_free"])]);
        numberClamp(sessionData[i]["display_Hard_uses"], [0, parseInt(sessionData[i]["Hard_free"])]);
        // save the input
        sessionData[i]["Soft_uses"] = parseInt(sessionData[i]["display_Soft_uses"].value);
        sessionData[i]["Medium_uses"] = parseInt(sessionData[i]["display_Medium_uses"].value);
        sessionData[i]["Hard_uses"] = parseInt(sessionData[i]["display_Hard_uses"].value);
        // subtract from free tyresets...
        sessionData[i]["Soft_free"] -= sessionData[i]["Soft_uses"]
        sessionData[i]["Medium_free"] -= sessionData[i]["Medium_uses"]
        sessionData[i]["Hard_free"] -= sessionData[i]["Hard_uses"]
        // add onto used tyresets.
        sessionData[i]["Soft_used"] += sessionData[i]["Soft_uses"]
        sessionData[i]["Medium_used"] += sessionData[i]["Medium_uses"]
        sessionData[i]["Hard_used"] += sessionData[i]["Hard_uses"]

        // using return inputs, subtract any remaining tyres.
        // clamp using return requirement of session
        var returnRequirement = parseInt(sessionData[i]["Name"].includes("Qualifying") ? qualifying_ReturnTyreSets : free_ReturnTyreSets); // if qualifying, then return qual amounts, else free sesh amounts.
        // clamp using max return amount
        numberClamp(sessionData[i]["display_Soft_returns"], [0, returnRequirement]);
        numberClamp(sessionData[i]["display_Medium_returns"], [0, returnRequirement]);
        numberClamp(sessionData[i]["display_Hard_returns"], [0, returnRequirement]);

        // clamp against total number of tyre sets left
        const softTyresTotal = parseInt(sessionData[i]["Soft_free"]) + parseInt(sessionData[i]["Soft_used"]);
        const mediumTyresTotal = parseInt(sessionData[i]["Medium_free"]) + parseInt(sessionData[i]["Medium_used"]);
        const hardTyresTotal = parseInt(sessionData[i]["Hard_free"]) + parseInt(sessionData[i]["Hard_used"]);

        numberClamp(sessionData[i]["display_Soft_returns"], [0, softTyresTotal]);
        numberClamp(sessionData[i]["display_Medium_returns"], [0, mediumTyresTotal]);
        numberClamp(sessionData[i]["display_Hard_returns"], [0, hardTyresTotal]);

        // save the inputted returns values for calculations.
        sessionData[i]["Soft_returns"] = parseInt(sessionData[i]["display_Soft_returns"].value);
        sessionData[i]["Medium_returns"] = parseInt(sessionData[i]["display_Medium_returns"].value);
        sessionData[i]["Hard_returns"] = parseInt(sessionData[i]["display_Hard_returns"].value);

        // finally, the return calculation. incrementally subtract the tyres.
        var returnsLeft = returnRequirement; // the current returns value of the session (returnRequirement). lets use as a decreasing counter
        function subtractReturns(tyreSet) {
            // clamp the display to returns left, for the rest of the displays.
            numberClamp(sessionData[i]["display_" + tyreSet + "_returns"], [0, parseInt(returnsLeft)]);

            var returnsToDo = sessionData[i][tyreSet + "_returns"]; // how many we wanna do

            while (returnsToDo > 0 && returnsLeft > 0 && (sessionData[i][tyreSet + "_free"] + sessionData[i][tyreSet + "_used"]) > 0) {
                if (sessionData[i][tyreSet + "_used"] > 0) {
                    sessionData[i][tyreSet + "_used"]--;
                } else if (sessionData[i][tyreSet + "_free"] > 0) {
                    sessionData[i][tyreSet + "_free"]--;
                }

                returnsLeft--;
                returnsToDo--;
            }
        }

        subtractReturns("Soft");
        subtractReturns("Medium");
        subtractReturns("Hard");

        //console.log(sessionData[i]);

        // update the displays
        function displayUpdate() {
            sessionData[i]["display_Soft_free"].innerHTML = sessionData[i]["Soft_free"];
            sessionData[i]["display_Medium_free"].innerHTML = sessionData[i]["Medium_free"];
            sessionData[i]["display_Hard_free"].innerHTML = sessionData[i]["Hard_free"];

            sessionData[i]["display_Soft_used"].innerHTML = sessionData[i]["Soft_used"];
            sessionData[i]["display_Medium_used"].innerHTML = sessionData[i]["Medium_used"];
            sessionData[i]["display_Hard_used"].innerHTML = sessionData[i]["Hard_used"];
        }
        displayUpdate();
    }
}

function runOverview() {
    generateOverview();
    updateOverview();
}

document.getElementById("generate_overview").onclick = runOverview;

// question 5. saving it

// check the race session, along with return amounts being valid.
function checkValidity() {
    const raceSesh = sessionData[sessionData.length - 1];
    if (raceSesh == null) {
        return;
    }

    // if at least one tyreset available.
    const totalTyreSets = parseInt(raceSesh["Soft_free"]) + parseInt(raceSesh["Soft_used"]) + parseInt(raceSesh["Medium_free"]) + parseInt(raceSesh["Medium_used"]) + parseInt(raceSesh["Hard_free"]) + parseInt(raceSesh["Hard_used"]);
    //console.log(totalTyreSets);

    // checking if all returns have been met. (if total returns of a session add up to the return requirement of that session)
    var allReturnsCompleted = true;
    for (var i = 0; i < sessionData.length - 1; i++) { // ignore the last session as part of this calc.
        const session = sessionData[i];

        // get the return requirement
        var sessionReturnRequirement = free_ReturnTyreSets;
        if (session["Name"].includes("Qualifying")) { // if qualifying, change the reture requirement.
            sessionReturnRequirement = qualifying_ReturnTyreSets;
        }

        // check if all returns are inputted by the user. if at any session it isn't, it's invalid, and break the loop.
        const tyreSetsRequiredReturning = parseInt(sessionReturnRequirement) - (parseInt(session["Soft_returns"]) + parseInt(session["Medium_returns"]) + parseInt(session["Hard_returns"]));
        console.log(tyreSetsRequiredReturning);
        if (tyreSetsRequiredReturning != 0) {
            allReturnsCompleted = false;
            break;
        }
    }

    // add more parameters overtime.
    if (totalTyreSets > 0 && allReturnsCompleted) {
        document.getElementById("5-dangertext").innerHTML = "";
        return true;
    } else if (totalTyreSets <= 0) {
        document.getElementById("5-dangertext").innerHTML = "You need to have at least one tyre set for the race session.";
        return false;
    } else if (!allReturnsCompleted) {
        document.getElementById("5-dangertext").innerHTML = "You need to complete the returns for tyre sets for certain sessions.";
        return false;
    }
}

// for saving/loading files
function loadWeekendFile(event) {
    var file = event.target.files[0];
    if (!file) { return; }

    var reader = new FileReader(); // allows for reading of files!
    reader.onload = function (event) {
        var contents = event.target.result;
        loadWeekend(contents);
    };
    reader.readAsText(file);

}

// actual loading procedure. this is used to load from JSON files, or from the DB column (MVP-temporary.)
function loadWeekend(fileData) { // move this out of function scope so is usable
    const dangerText = document.getElementById("0-dangertext");

    // error catch the JSON.parse().
    var jsonData = null;
    try {
        jsonData = JSON.parse(fileData);
        dangerText.innerHTML = "";
    } catch (e) {
        jsonData = null;
        dangerText.innerHTML = "  Invalid file - load a correct raceWeekend.json file.";
        return;
    }
    console.log("and we may continue");

    // read and change the userInputs.
    soft_tyreSets = jsonData["userInputs"]["soft_tyreSets"];
    medium_tyreSets = jsonData["userInputs"]["medium_tyreSets"];
    hard_tyreSets = jsonData["userInputs"]["hard_tyreSets"];
    sessions = jsonData["userInputs"]["sessions"];
    free_ReturnTyreSets = jsonData["userInputs"]["free_ReturnTyreSets"];
    qualifying_ReturnTyreSets = jsonData["userInputs"]["qualifying_ReturnTyreSets"];

    // gotta update the numbers in the input boxes too! gotta remake the sessionBoxes too!
    // 1. input tyresets
    for (var i = 0; i < input_tyreSets.length; i++) {
        var selectedTyreValue = 0;
        if (i == 0) { selectedTyreValue = soft_tyreSets; }
        else if (i == 1) { selectedTyreValue = medium_tyreSets; }
        else { selectedTyreValue = hard_tyreSets; }

        input_tyreSets[i].value = selectedTyreValue;
    }
    // 2. picking sessions
    document.querySelectorAll(".sessionBlock").forEach(el => el.remove()); // remove previous sessions boxes
    // iterate through session string, creating
    // sessionButton(i); // and then aha. 0. Add Free. 1. Add Qual. 2. Remove last.
    for (var i = 0; i < sessions.length; i++) {
        const s = parseInt(sessions[i]) - 1;

        const container = containers[0];
        if (s == 0) {
            addFreeSessionBlock(container);
        } else {
            addQualifyingSessionBlock(container);
        }
    }
    endDrag();
    // 3. return tyre input values.
    document.getElementById("free_returns").value = free_ReturnTyreSets;
    document.getElementById("qual_returns").value = qualifying_ReturnTyreSets;
    // 4. session overview
    runOverview();
    for (var i = 0; i < sessionData.length - 1; i++) { // ignoring race session again.
        // update each row with the corresponding row from the json file.
        sessionData[i]["Name"] = jsonData["sessionData"][i]["Name"];

        // using updateOverview, we're gonna stick the values into the input areas first, and then use updateOverview to save them into the sessionData.
        sessionData[i]["display_Hard_free"].value = jsonData["sessionData"][i]["Hard_free"];
        sessionData[i]["display_Hard_returns"].value = jsonData["sessionData"][i]["Hard_returns"];
        sessionData[i]["display_Hard_used"].value = jsonData["sessionData"][i]["Hard_used"];
        sessionData[i]["display_Hard_uses"].value = jsonData["sessionData"][i]["Hard_uses"];

        sessionData[i]["display_Medium_free"].value = jsonData["sessionData"][i]["Medium_free"];
        sessionData[i]["display_Medium_returns"].value = jsonData["sessionData"][i]["Medium_returns"];
        sessionData[i]["display_Medium_used"].value = jsonData["sessionData"][i]["Medium_used"];
        sessionData[i]["display_Medium_uses"].value = jsonData["sessionData"][i]["Medium_uses"];

        sessionData[i]["display_Soft_free"].value = jsonData["sessionData"][i]["Soft_free"];
        sessionData[i]["display_Soft_returns"].value = jsonData["sessionData"][i]["Soft_returns"];
        sessionData[i]["display_Soft_used"].value = jsonData["sessionData"][i]["Soft_used"];
        sessionData[i]["display_Soft_uses"].value = jsonData["sessionData"][i]["Soft_uses"];
    }
    updateOverview();

    // and that's it really.
}


function saveWeekendFile(saveAsFile) {
    // get all variables, and put em into a big json object thing
    var jsonSessionData = sessionData;
    // remove all displays.
    for (var i = 0; i < jsonSessionData.length; i++) {
        // anything with display in the name, make it a null
        Object.entries(jsonSessionData[i]).forEach(([key, value]) => {
            //console.log(key, value);
            if (key.includes("display")) {
                //console.log("display found: " + key);
                jsonSessionData[i][key] = null;
            }
        });
    }

    const dataToSave = {
        "userInputs": {
            "soft_tyreSets": soft_tyreSets,
            "medium_tyreSets": medium_tyreSets,
            "hard_tyreSets": hard_tyreSets,
            "sessions": sessions,
            "free_ReturnTyreSets": free_ReturnTyreSets,
            "qualifying_ReturnTyreSets": qualifying_ReturnTyreSets
        },
        "sessionData": sessionData
    };

    const jsonObj = JSON.stringify(dataToSave);
    //console.log(jsonObj);

    // a function for saving the .JSON file.
    function saveToFile(text, filename) {
        var a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        a.setAttribute('download', filename);
        a.click()
    }

    // add a parameter check here (if saveAsFile then SAVE else RETURN)
    if (saveAsFile) {
        saveToFile(jsonObj, "raceWeekend.json");
    } else {
        return jsonObj; // this is used in loading the JSON from the database column instead.
    }

}

// functionality for the buttons, mainly for use in the ASP.net page.
function modifySubmitForm() {
    // edit the submit form in the ASP page to have their HTML Ids.
    document.getElementById("form_Name").value = weekendName;
    document.getElementById("form_SoftTyreSets").value = soft_tyreSets;
    document.getElementById("form_MediumTyreSets").value = medium_tyreSets;
    document.getElementById("form_HardTyreSets").value = hard_tyreSets;
    document.getElementById("form_Sessions").value = sessions;
    document.getElementById("form_FreeReturnTyreSets").value = free_ReturnTyreSets;
    document.getElementById("form_QualifyingReturnTyreSets").value = qualifying_ReturnTyreSets;
    document.getElementById("form_JSONSessionData").value = saveWeekendFile(false);
}

function saveWeekend() {
    const valid = checkValidity();
    if (!valid) {
        return;
    }

    modifySubmitForm();
    document.getElementById("form_Edit").submit(); // submit the form.
}

function savePresetWeekend() {
    const valid = checkValidity();
    if (!valid) {
        return;
    }
    // initial version was to save into the database, but with the timespan of the sprint, I will use this for the MVP instead.
    saveWeekendFile(true); // save into a .JSON file.
}

document.getElementById('load_weekend_file').addEventListener('change', loadWeekendFile, false);
//document.getElementById("load_weekend").onclick = loadWeekendFile;
document.getElementById("save_weekend").onclick = saveWeekend;
document.getElementById("save_preset_weekend").onclick = savePresetWeekend;

// to run at the end.
endDrag();
runOverview();


function showDetailsOnPage(page) {
    if (page == "Edit") {
        // upon page load, esp for the edit page, we wanna load the details and display them.
        loadWeekend(document.getElementById("form_JSONSessionData").value);

        weekendName = document.getElementById("form_Name").value; // just adding this here since it's not part of the JSON data.
        input_weekendName.value = weekendName;
    } else if (page == "Create") {
        input_weekendName.value = weekendName;
    } else {
        // similar to Edit, but a lot of fields are hidden, and there is no form to submit.
        loadWeekend(document.getElementById("form_JSONSessionData").innerHTML);
    }
    console.log(page + " page loaded.")
}

console.log("script started");