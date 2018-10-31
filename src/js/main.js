/**
 * DT173G - Webbutveckling III
 * Projektarbete
 * Maria Rudolphi
 * 2018-10-31
 * main.ts
 */
"use strict";
var baseURL = "/webbutvecklingmiun/dt173g/projekt/pt_app.php/";
// Class for all needed data in call to REST-web service
var Call = /** @class */ (function () {
    function Call(url, method, jsonData) {
        this.url = url;
        this.method = method;
        this.jsonData = jsonData;
        this.x = { url: url, method: method, jsonData: jsonData };
    }
    return Call;
}());
// Handle all PUT, POST, DELETE requests
// Reloads page to call getData()
function manageData(data) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open(data.method, data.url, true);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    if (data.jsonData) {
        xmlHttp.send(JSON.stringify(data.jsonData));
    }
    else {
        xmlHttp.send();
    }
    xmlHttp.onload = function () {
        location.reload();
    };
}
// Handle GET requests, get all userData in JSON format
// Function called when page reloaded
function getData(data, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == XMLHttpRequest.DONE) {
            if (xmlHttp.status == 200) {
                //window.userData = JSON.parse(xmlHttp.responseText);
                callback(JSON.parse(xmlHttp.responseText));
            }
            else if (xmlHttp.status == 400) {
                alert('Error 400');
            }
            else {
                alert('Något gick fel');
            }
        }
    };
    xmlHttp.open(data.method, data.url, true);
    xmlHttp.send();
}
// Check filled in hexadecimalcolors in addEvent and addPeriod
function setColor(color) {
    if (color[0] != "#") {
        color = "#" + color;
    }
    return color;
}
// On load event handlers
$(function () {
    // Get and use user data
    // userID == 1 just for testing and show a userpage, before login function works
    var userID = 1;
    var url = baseURL + "users/" + userID;
    var method = "GET";
    var data = {};
    var userCall = new Call(url, method, data);
    getData(userCall, function (userData) {
        var user = userData.user;
        var events = userData.events;
        var periods = userData.periods;
        var training = userData.training;
        // Print out users name in header
        $('.userName').text(user[0].firstname + ' ' + user[0].lastname);
        // Append all events to select in addEvent
        for (var i = 0; i < events.length; i++) {
            $('#eventID')
                .append('<option value="' + events[i].id + '">' + events[i].title + " " + events[i].year + '</option>');
        }
        // Append all periods to select in addPeriod & to select in addTraining
        for (var i = 0; i < periods.length; i++) {
            $('#periodID')
                .append('<option value="' + periods[i].id + '">' + periods[i].id + " - " + periods[i].title + '</option>');
            $('#trainingPeriod')
                .append('<option value="' + periods[i].id + '" style="background: periods[i].color">' + periods[i].title + '</option>');
        }
        // Append all trainingweeks to select in addTraining
        for (var i = 0; i < training.length; i++) {
            $('#trainingID')
                .append('<option value="' + training[i].weekId + '">v.' + training[i].week + " " + training[i].year + '</option>');
        }
        // Set eventData when specific event is selected
        // Makes delete-button enabled
        $('#eventID').change(function () {
            for (var i = 0; i < events.length; i++) {
                if (events[i].id == $(this).val()) {
                    $('#eventDate').val(events[i].date);
                    $('#eventWeek').val(events[i].week);
                    $('#eventTitle').val(events[i].title);
                    $('#eventType').val(events[i].type);
                    $('#eventColor').val(events[i].color);
                    $('#eventPlace').val(events[i].place);
                    $('#eventDetails').val(events[i].details);
                    $('#eventResults').val(events[i].results);
                    $('#deleteEvent').removeAttr('disabled');
                }
            }
        });
        // Set periodData when specific period is selected
        // Makes delete-button enabled
        $('#periodID').change(function () {
            for (var i = 0; i < periods.length; i++) {
                if (periods[i].id == $(this).val()) {
                    $('#periodTitle').val(periods[i].title);
                    $('#periodColor').val(periods[i].color);
                    $('#periodDetails').val(periods[i].details);
                    $('#periodResults').val(periods[i].results);
                    $('#deletePeriod').removeAttr('disabled');
                }
            }
        });
        // Set trainingData when specific trainingWeek is selected
        // Makes delete-button enabled
        $('#trainingID').change(function () {
            for (var i = 0; i < training.length; i++) {
                if (training[i].weekId == $(this).val()) {
                    $('#trainingYear').val(training[i].year);
                    $('#trainingWeek').val(training[i].week);
                    $('#trainingPeriod').val(training[i].periodId);
                    $('#trainingDetails').val(training[i].weekDetails);
                    $('#trainingResults').val(training[i].weekResults);
                    $('#deleteTraining').removeAttr('disabled');
                }
            }
        });
        // Print out events in container
        // Show details and results only if event has details and results
        for (var i = 0; i < events.length; i++) {
            var add = "";
            add += '<article style="background:' + setColor(events[i].color) + '">' +
                '<section class="event col-1 pointer">' +
                '<span class="col-1-1">' + events[i].title + '</span>' +
                '<span class="col-1-2">' + events[i].place + '</span>' +
                '<span class="col-1-all">' + events[i].date + ' (v.' + events[i].week + ')</span>' +
                '</section>' +
                '<section class="showEvent col-1"><br>';
            if (events[i].details) {
                add += '<span class="col-1-all bold">Detaljer:</span>' +
                    '<span class="col-1-all">' + events[i].details + '</span>';
            }
            if (events[i].results) {
                add += '<br><span class="col-1-all bold">Resultat:</span>' +
                    '<span class="col-1-all">' + events[i].results + '</span>';
            }
            add += '</section></article>';
            $('.showEvents')
                .append(add);
        }
        // Hide part of event on start
        // Show/Hide when specific event is clicked
        $('.showEvent').hide();
        $('.event').on('click', function () {
            $(this).next('.showEvent').toggle();
        });
        // Print out training in container
        // Show details and results only if training has details and results
        for (var i = 0; i < training.length; i++) {
            var add = "";
            add += '<article style="background: ' + setColor(training[i].color) + '">' +
                '<section class="training col-2 pointer">' +
                '<span class="col-2-1">' + training[i].year + '</span>' +
                '<span class="col-2-2">v.' + training[i].week + '</span>' +
                '<span class="col-2-3">' + training[i].title + '</span>' +
                '</section>' +
                '<section class="showTraining col-2">';
            if (training[i].weekDetails || training[i].weekResults) {
                add += '<h4 class="col-2-all">Träning (v.' + training[i].week + ' ' + training[i].year + ')</h4>';
            }
            if (training[i].weekDetails) {
                add += '<span class="col-2-all bold">Detaljer:</span>' +
                    '<span class="col-2-all">' + training[i].weekDetails + '</span>';
            }
            if (training[i].weekResults) {
                add += '<span class="col-2-all bold">Resultat:</span>' +
                    '<span class="col-2-all">' + training[i].weekResults + '</span><br>';
            }
            if (training[i].periodDetails || training[i].periodResults) {
                add += '<h4 class="col-2-all">Träningsperiod (' + training[i].title + ')</h4>';
            }
            if (training[i].periodDetails) {
                add += '<span class="col-2-all bold">Detaljer:</span>' +
                    '<span class="col-2-all">' + training[i].periodDetails + '</span>';
            }
            if (training[i].periodResults) {
                add += '<span class="col-2-all bold">Resultat:</span>' +
                    '<span class="col-2-all">' + training[i].periodResults + '</span>';
            }
            add += '</section></article>';
            $('.showTrainings').append(add);
        }
        // Hide part of training on start
        // Hide/show when training is clicked
        $('.showTraining').hide();
        $('.training').on('click', function () {
            $(this).next('.showTraining').toggle();
        });
    });
    // End getData()
    // On start
    // Hide add-boxes on start
    // Show/hide when show-add-heading is clicked
    $('.add-boxes').hide();
    $('.show-add').on('click', function () {
        $('.add-boxes').toggle();
    });
    // Make delete-buttons disabled on start
    $('.delete-button').attr('disabled', 'disabled');
    // Event listener and handler when click on addEvent
    // Sets url, method and data and calls manageData() to add or update event
    $('#addEvent').on('click', function () {
        if ($('#eventTitle').val().length > 0) {
            var userID_1 = 1;
            var userKey = "";
            var id = $('#eventID').val();
            var date = $('#eventDate').val();
            var week = $('#eventWeek').val();
            var title = $('#eventTitle').val();
            var type = $('#eventType').val();
            var color = $('#eventColor').val();
            var place = $('#eventPlace').val();
            var details = $('#eventDetails').val();
            var results = $('#eventResults').val();
            var url_1 = baseURL + "events/" + userID_1;
            var method_1 = "";
            var data_1 = {
                "date": date,
                "week": week,
                "title": title,
                "type": type,
                "color": color,
                "place": place,
                "details": details,
                "results": results
            };
            // Event is updated if eventId is specified and added if it's not
            if (id > 0) {
                // Update
                method_1 = 'PUT';
                url_1 += "/" + id;
                data_1["id"] = id;
            }
            else {
                // post
                method_1 = 'POST';
            }
            var call = new Call(url_1, method_1, data_1);
            manageData(call);
        }
        else {
            alert("Målet måste ha en titel");
        }
    });
    // Event listener and handler when click on deleteEvent
    // Calls manageData() to delete selected event
    $('#deleteEvent').on('click', function () {
        var eventId = $('#eventID').val();
        if (eventId > 0) {
            var url_2 = baseURL + "events/" + userID + '/' + eventId;
            var method_2 = "DELETE";
            var data_2 = {};
            var call = new Call(url_2, method_2, data_2);
            manageData(call);
        }
        else {
            alert('Inget mål/event är valt');
        }
    });
    // Event listener and handler when click on addPeriod
    // Sets url, method and data and calls manageData() to add or update period
    $('#addPeriod').on('click', function () {
        if ($('#periodTitle').val().length > 0) {
            var userID_2 = 1;
            var userKey = "";
            var id = $('#periodID').val();
            var title = $('#periodTitle').val();
            var color = $('#periodColor').val();
            var details = $('#periodDetails').val();
            var results = $('#periodResults').val();
            var url_3 = baseURL + "periods/" + userID_2;
            var method_3 = "";
            var data_3 = {
                "title": title,
                "color": color,
                "details": details,
                "results": results
            };
            // Period is updated if periodId is specified and added if it's not
            if (id > 0) {
                // Update
                method_3 = 'PUT';
                url_3 += "/" + id;
                data_3["id"] = id;
            }
            else {
                // post
                method_3 = 'POST';
            }
            var call = new Call(url_3, method_3, data_3);
            manageData(call);
        }
        else {
            alert('Träningsperioden måste ha en titel');
        }
    });
    // Event listener and handler when click on deletePeriod
    // Calls manageData() to delete selected period
    $('#deletePeriod').on('click', function () {
        var periodId = $('#periodID').val();
        if (periodId > 0) {
            var url_4 = baseURL + "periods/" + userID + '/' + periodId;
            var method_4 = "DELETE";
            var data_4 = {};
            var call = new Call(url_4, method_4, data_4);
            manageData(call);
        }
        else {
            alert('Ingen träningsperiod är vald');
        }
    });
    // Event listener and handler when click on addTraining
    // Sets url, method and data and calls manageData() to add or update training
    $('#addTraining').on('click', function () {
        if ($('#trainingWeek').val().length > 0 && $('#trainingYear').val().length > 0 && $('#trainingPeriod').val().length > 0) {
            var userID_3 = 1;
            var userKey = "";
            var id = $('#trainingID').val();
            var year = $('#trainingYear').val();
            var week = $('#trainingWeek').val();
            var periodId = $('#trainingPeriod').val();
            var details = $('#trainingDetails').val();
            var results = $('#trainingResults').val();
            var url_5 = baseURL + "training/" + userID_3;
            var method_5 = "";
            var data_5 = {
                "year": year,
                "week": week,
                "periodId": periodId,
                "details": details,
                "results": results
            };
            // Training is updated if trainingId is specified and added if it's not
            if (id > 0) {
                // Update
                method_5 = 'PUT';
                url_5 += "/" + id;
                data_5["id"] = id;
            }
            else {
                // post
                method_5 = 'POST';
            }
            var call = new Call(url_5, method_5, data_5);
            manageData(call);
        }
        else {
            alert('År, vecka och träningsperiod måste fyllas i');
        }
    });
    // Event listener and handler when click on deleteTraining
    // Calls manageData() to delete selected training
    $('#deleteTraining').on('click', function () {
        var trainingId = $('#trainingID').val();
        if (trainingId > 0) {
            var url_6 = baseURL + "training/" + userID + '/' + trainingId;
            var method_6 = "DELETE";
            var data_6 = {};
            var call = new Call(url_6, method_6, data_6);
            manageData(call);
        }
        else {
            alert('Ingen träningsvecka är vald');
        }
    });
});
