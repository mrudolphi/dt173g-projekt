<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<link href="https://fonts.googleapis.com/css?family=Muli" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css?family=Krub" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
	<link rel="stylesheet" href="css/style.min.css">
	<title>Personlig träningsplanering</title>
</head>
<body>
<span class="image"></span>
	<div class="login" style="display:none">
		<input type="text" name="username" id="username" placeholder="E-post"><br>
		<input type="password" name="pwd" id="pwd" placeholder="Lösenord">
	</div>
	<header>
		<span class="userName"></span>
		<span class="logout"><a href="#">Logga ut</a></span>
		<h1 class="clear">Min personliga träningsplanering</h1>
	</header>
	<section class="container clear">
			<section class="plan-box showEvents">
				<h2>Mål</h2>
				<h3>Tävlingar, läger, event, m.m.</h3>
				<section class="col-1">
					<span class="col-1-1">Titel</span>
					<span class="col-1-2">Plats</span>
					<span class="col-1-3">Datum</span>
				</section>
			</section>
			<section class="plan-box showTrainings col-2">
				<h2>Träningsplanering</h2>
				<section class="col-2">
					<span class="col-2-1">År</span>
					<span class="col-2-2">Vecka</span>
					<span class="col-2-3">Träningsperiod</span>
				</section>
			</section>
	</section>
	<section class="add clear">
		<h2 class="show-add pointer">Lägg till / Ändra / Ta bort</h2>
		<section class="add-boxes">
			<section class="add-box events">
				<h3>Mål</h3>
				<h4>Tävlingar, läger, event, m.m.</h4>
				<span class="clear">
					<label for="eventID">Välj event för att uppdatera</label>
					<select name="eventID" id="eventID">
						<option value="">Välj mål/event...</option>
					</select>
				</span>
				<span class="clear">
					<label for="eventDate">Datum</label><br>
					<input type="date" name="eventDate" id="eventDate" placeholder="Ex. 2019-01-01">
				</span>
				<span class="clear">
					<label for="eventWeek">Vecka</label><br>
					<input type="number" min="1" max="53" name="eventWeek" id="eventWeek" placeholder="Ex. 40">
				</span>
				<span class="clear">
					<label for="eventTitle">Titel</label><br>
					<input type="text" name="eventTitle" id="eventTitle" placeholder="Ex. Serie 1">
				</span>
				<span class="clear">
					<label for="eventType">Type</label><br>
					<input type="text" name="eventType" id="eventType" placeholder="Ex. Tävling">
				</span>
				<span class="clear">
					<label for="eventColor">Färg</label><br>
					<input type="text" name="eventColor" id="eventColor" placeholder="Ex. #ffffff"><br>
					<a href="https://htmlcolorcodes.com/" target="_blank">Klicka här för att se vilken färgkod du ska använda.</a>
				</span>
				<span class="clear">
					<label for="eventPlace">Plats</label><br>
					<input type="text" name="eventPlace" id="eventPlace" placeholder="Ex. Sundsvalls atletklubb">
				</span>
				<span class="clear">
					<label for="eventDetails">Detaljer</label><br>
					<textarea name="eventDetails" id="eventDetails">Ex. Invägning 16, start 18</textarea>
				</span>
				<span class="clear">
					<label for="eventResults">Resultat</label><br>
					<textarea name="eventResults" id="eventResults">Ex. 150-100-200, alla lyft godkända.</textarea>
				</span>
				<span class="clear">
					<button class="add-button pointer" id="addEvent">Skapa / Ändra</button>
					<button class="delete-button pointer" id="deleteEvent">Ta bort</button>
				</span>
			</section>
			<section class="add-box periods">
				<h3>Träningsperiod</h3>
				<span class="clear">
				<label for="periodID">Välj period för att uppdatera</label><br>
				<select name="periodID" id="periodID">
					<option value="">Välj träningsperiod...</option>
				</select>
					</span>
				<span class="clear">
				<label for="periodTitle">Titel</label><br>
				<input type="text" name="periodTitle" id="periodTitle" placeholder="Ex. Grundperiod">
					</span>
				<span class="clear">
				<label for="periodColor">Färg</label><br>
				<input type="text" name="periodColor" id="periodColor" placeholder="Ex. #ffffff"><br>
				<a href="https://htmlcolorcodes.com/" target="_blank">Klicka här för att se vilken färgkod du ska använda.</a>
					</span>
				<label for="periodDetails">Detaljer</label>
				<textarea name="periodDetails" id="periodDetails">Ex. Lätt träning, blandat kondition, styrka, uthållighet. Ingen utrustning</textarea><br>
				<label for="periodResults">Resultat</label>
				<textarea name="periodResults" id="periodResults">Ex. Ökat kondition, bättre ork under styrkepassen.</textarea><br>
				<button class="add-button pointer" id="addPeriod">Skapa / Ändra</button>
				<button class="delete-button pointer" id="deletePeriod">Ta bort</button>
			</section>
			<section class="add-box training">
				<h3>Träning</h3>
				<label for="trainingID">Välj träningsvecka för att uppdatera</label>
				<select name="trainingID" id="trainingID">
					<option value="">Välj vecka...</option>
				</select><br>
				<label for="trainingYear">År</label>
				<input type="number" name="trainingYear" id="trainingYear" placeholder="Ex. 2019"><br>
				<label for="trainingWeek">Vecka</label>
				<input type="number" min="1" max="53" name="trainingWeek" id="trainingWeek" placeholder="Ex. 1" required><br>
				<label for="trainingPeriod">Träningsperiod</label>
				<select name="trainingPeriod" id="trainingPeriod">
				</select><br>
				<label for="trainingDetails">Detaljer</label>
				<textarea name="trainingDetails" id="trainingDetails">2x konditionspass, 3x styrkepass. Fokus knäböj.</textarea><br>
				<label for="trainingResults">Resultat</label>
				<textarea name="trainingResults" id="trainingResults">Pass 1: 8 set knäböj med stopp, utan utrustning 50kg.</textarea><br>
				<button class="add-button pointer" id="addTraining">Skapa / Ändra</button>
				<button class="delete-button pointer" id="deleteTraining">Ta bort</button>
			</section>
		</section>
	</section>
	<footer>
		© Maria Rudolphi
	</footer>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	<script src="js/main.min.js?<?= time() ?>"></script>
</body>
</html>