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
class Call {
	x: object;
	constructor(
		public url: string,
		public method: string,
		public jsonData: object) {
		this.x = {url, method, jsonData};
	}
}

// interface of in parameters to manageData() and getData()
interface Data {
	url: string;
	method: string;
	jsonData: object;
}

// Handle all PUT, POST, DELETE requests
// Reloads page to call getData()
function manageData(data: Data) {
	let xmlHttp = new XMLHttpRequest();

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
	}
}

// Handle GET requests, get all userData in JSON format
// Function called when page reloaded
function getData(data: Data, callback: any) {
	let xmlHttp = new XMLHttpRequest();

	xmlHttp.onreadystatechange = function() {
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
function setColor(color: string) {
	if (color[0] != "#") {
		color = "#" + color;
	}
	return color;
}

// On load event handlers
$(function() {
	// Get and use user data
	// userID == 1 just for testing and show a userpage, before login function works
	let userID: number = 1;
	let url = baseURL + "users/" + userID;
	let method = "GET";
	let data: object = {};

	let userCall = new Call(url, method, data);

	getData(userCall, function(userData: any) {
		let user = userData.user;
		let events = userData.events;
		let periods = userData.periods;
		let training = userData.training;

		// Print out users name in header
		$('.userName').text(user[0].firstname + ' ' + user[0].lastname);

		// Append all events to select in addEvent
		for (let i = 0; i < events.length; i++) {
			$('#eventID')
				.append('<option value="' + events[i].id + '">' + events[i].title + " " + events[i].year + '</option>')
		}

		// Append all periods to select in addPeriod & to select in addTraining
		for (let i = 0; i < periods.length; i++) {
			$('#periodID')
				.append('<option value="' + periods[i].id + '">' + periods[i].id + " - " + periods[i].title + '</option>')

			$('#trainingPeriod')
				.append('<option value="' + periods[i].id + '" style="background: periods[i].color">' + periods[i].title + '</option>')
		}

		// Append all trainingweeks to select in addTraining
		for (let i = 0; i < training.length; i++) {
			$('#trainingID')
				.append('<option value="' + training[i].weekId + '">v.' + training[i].week + " " + training[i].year + '</option>')
		}

		// Set eventData when specific event is selected
		// Makes delete-button enabled
		$('#eventID').change(function() {
			for (let i = 0; i < events.length; i++) {
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
		$('#periodID').change(function() {
			for (let i = 0; i < periods.length; i++) {
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
		$('#trainingID').change(function() {
			for (let i = 0; i < training.length; i++) {
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
		for (let i = 0; i < events.length; i++) {
			let add = "";
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
		$('.event').on('click', function() {
			$(this).next('.showEvent').toggle();
		});

		// Print out training in container
		// Show details and results only if training has details and results
		for (let i = 0; i < training.length; i++) {
			let add = "";
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
		$('.training').on('click', function() {
			$(this).next('.showTraining').toggle();
		});
	});
	// End getData()


	// On start

	// Hide add-boxes on start
	// Show/hide when show-add-heading is clicked
	$('.add-boxes').hide();
	$('.show-add').on('click', function() {
		$('.add-boxes').toggle();
	});

	// Make delete-buttons disabled on start
	$('.delete-button').attr('disabled', 'disabled');

	// Event listener and handler when click on addEvent
	// Sets url, method and data and calls manageData() to add or update event
	$('#addEvent').on('click', function() {
		if ($('#eventTitle').val().length > 0) {
			let userID: number = 1;
			let userKey: string = "";
			let id = $('#eventID').val();
			let date = $('#eventDate').val();
			let week = $('#eventWeek').val();
			let title = $('#eventTitle').val();
			let type = $('#eventType').val();
			let color = $('#eventColor').val();
			let place = $('#eventPlace').val();
			let details = $('#eventDetails').val();
			let results = $('#eventResults').val();

			let url: string = baseURL + "events/" + userID;
			let method: string = "";
			let data: any = {
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
				method = 'PUT';
				url += "/" + id;
				data["id"] = id;
			}
			else {
				// post
				method = 'POST';
			}

			let call = new Call(url, method, data);

			manageData(call);
		}
		else {
			alert("Målet måste ha en titel");
		}
	});

	// Event listener and handler when click on deleteEvent
	// Calls manageData() to delete selected event
	$('#deleteEvent').on('click', function() {
		let eventId = $('#eventID').val();
		if (eventId > 0) {
			let url = baseURL + "events/" + userID + '/' + eventId;
			let method = "DELETE";
			let data: any = {};

			let call = new Call(url, method, data);
			manageData(call);
		}
		else {
			alert('Inget mål/event är valt');
		}
	});

	// Event listener and handler when click on addPeriod
	// Sets url, method and data and calls manageData() to add or update period
	$('#addPeriod').on('click', function() {
		if ($('#periodTitle').val().length > 0) {
			let userID: number = 1;
			let userKey: string = "";
			let id = $('#periodID').val();
			let title = $('#periodTitle').val();
			let color = $('#periodColor').val();
			let details = $('#periodDetails').val();
			let results = $('#periodResults').val();

			let url = baseURL + "periods/" + userID;
			let method = "";
			let data: any = {
				"title": title,
				"color": color,
				"details": details,
				"results": results
			};

			// Period is updated if periodId is specified and added if it's not
			if (id > 0) {
				// Update
				method = 'PUT';
				url += "/" + id;
				data["id"] = id;
			}
			else {
				// post
				method = 'POST';
			}

			let call = new Call(url, method, data);

			manageData(call);
		}
		else {
			alert('Träningsperioden måste ha en titel');
		}
	});

	// Event listener and handler when click on deletePeriod
	// Calls manageData() to delete selected period
	$('#deletePeriod').on('click', function() {
		let periodId = $('#periodID').val();
		if (periodId > 0) {
			let url = baseURL + "periods/" + userID + '/' + periodId;
			let method = "DELETE";
			let data: any = {};

			let call = new Call(url, method, data);
			manageData(call);
		}
		else {
			alert('Ingen träningsperiod är vald');
		}
	});

	// Event listener and handler when click on addTraining
	// Sets url, method and data and calls manageData() to add or update training
	$('#addTraining').on('click', function() {
		if ($('#trainingWeek').val().length > 0 && $('#trainingYear').val().length > 0 && $('#trainingPeriod').val().length > 0) {
			let userID: number = 1;
			let userKey: string = "";
			let id = $('#trainingID').val();
			let year = $('#trainingYear').val();
			let week = $('#trainingWeek').val();
			let periodId = $('#trainingPeriod').val();
			let details = $('#trainingDetails').val();
			let results = $('#trainingResults').val();

			let url = baseURL + "training/" + userID;
			let method = "";
			let data: any = {
				"year": year,
				"week": week,
				"periodId": periodId,
				"details": details,
				"results": results
			};

			// Training is updated if trainingId is specified and added if it's not
			if (id > 0) {
				// Update
				method = 'PUT';
				url += "/" + id;
				data["id"] = id;
			}
			else {
				// post
				method = 'POST';
			}

			let call = new Call(url, method, data);

			manageData(call);
		}
		else {
			alert('År, vecka och träningsperiod måste fyllas i');
		}
	});

	// Event listener and handler when click on deleteTraining
	// Calls manageData() to delete selected training
	$('#deleteTraining').on('click', function() {
		let trainingId = $('#trainingID').val();
		if (trainingId > 0) {
			let url = baseURL + "training/" + userID + '/' + trainingId;
			let method = "DELETE";
			let data: object = {};

			let call = new Call(url, method, data);
			manageData(call);
		}
		else {
			alert('Ingen träningsvecka är vald');
		}
	});
});