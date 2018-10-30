<?php
/**
 * Created by PhpStorm.
 * User: Maria
 * Date: 2018-10-10
 * Time: 10:32
 */

/**
 * DB-connect
 */
require_once "db_config.php";
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));
$input = json_decode(file_get_contents('php://input'),true);

header('Content-Type: application/json; charset=UTF-8');

/**
 * Model
 */

function loadData($userID) {
	global $conn;
	// Get logged in user data
	$sql = 'SELECT id, firstname, lastname, loggedInKey
			FROM pt_users
			WHERE id = ' . $userID;

	$userResult = mysqli_query($conn, $sql) or die(mysqli_error($conn));

	// get data for events
	$sql = 'SELECT id, title, date, YEAR(date) AS year, week, type, color, place, details, results
			FROM pt_events
			WHERE userId = ' . $userID . '
			ORDER BY date';

	$eventResult = mysqli_query($conn, $sql) or die(mysqli_error($conn));

	// Get data for periods
	$sql = 'SELECT id, title, color, details, results
			FROM pt_periods
			ORDER BY title';

	$periodResult = mysqli_query($conn, $sql) or die(mysqli_error($conn));

	// Get data for training and periods
	$sql = 'SELECT p.id AS periodId, p.title, p.color, p.details AS periodDetails, p.results AS periodResults,
			t.id AS weekId, t.week, t.year, t.details AS weekDetails, t.results AS weekResults
			FROM pt_training AS t
			INNER JOIN pt_periods AS p ON t.periodId = p.id
			WHERE t.userId = ' . $userID . '
			ORDER BY t.year, t.week';

	$trainingResult = mysqli_query($conn, $sql) or die(mysqli_error($conn));

	$user = [];
	$events = [];
	$periods = [];
	$training = [];
	$result = [];

	while ($row = mysqli_fetch_assoc($userResult)) {
		$user_arr['id'] = $row['id'];
		$user_arr['firstname'] = $row['firstname'];
		$user_arr['lastname'] = $row['lastname'];
		$user_arr['loggedInKey'] = $row['loggedInKey'];
		array_push($user, $user_arr);
	}

	while ($row = mysqli_fetch_assoc($eventResult)) {
		$events_arr['id'] = $row['id'];
		$events_arr['title'] = $row['title'];
		$events_arr['date'] = $row['date'];
		$events_arr['year'] = $row['year'];
		$events_arr['week'] = $row['week'];
		$events_arr['type'] = $row['type'];
		$events_arr['color'] = $row['color'];
		$events_arr['place'] = $row['place'];
		$events_arr['details'] = $row['details'];
		$events_arr['results'] = $row['results'];
		array_push($events, $events_arr);
	}

	while ($row = mysqli_fetch_assoc($periodResult)) {
		$periods_arr['id'] = $row['id'];
		$periods_arr['title'] = $row['title'];
		$periods_arr['color'] = $row['color'];
		$periods_arr['details'] = $row['details'];
		$periods_arr['results'] = $row['results'];
		array_push($periods, $periods_arr);
	}

	while ($row = mysqli_fetch_assoc($trainingResult)) {
		$row_arr['periodId'] = $row['periodId'];
		$row_arr['title'] = $row['title'];
		$row_arr['color'] = $row['color'];
		$row_arr['periodDetails'] = $row['periodDetails'];
		$row_arr['periodResults'] = $row['periodResults'];
		$row_arr['weekId'] = $row['weekId'];
		$row_arr['week'] = $row['week'];
		$row_arr['year'] = $row['year'];
		$row_arr['weekDetails'] = $row['weekDetails'];
		$row_arr['weekResults'] = $row['weekResults'];
		array_push($training, $row_arr);
	}

	$result['user'] = $user;
	$result['events'] = $events;
	$result['periods'] = $periods;
	$result['training'] = $training;
	mysqli_close($conn);

	echo json_encode($result);
}

/**
 * Controller
 */

switch ($request[0]) {
	case 'users': {
		switch ($method) {
			case 'GET': {
				// check $input['email'], if not exists, return error message "E-postadressen finns inte registrerad"
				// If email exists, hash pwd, check passMD5
				// If OK:
				// Get id from user with email && pwd like input
				// Call loadData to get data about user
				loadData($request[1]);
				// else: error message "Lösenordet är fel"
				break;
			}
			case 'POST': {
				// (Typescript-check av lösenorden)
				$userSql = 'SELECT id FROM pt_users WHERE email = "' . $input['email'] . '"';
				$user = mysqli_query($conn, $userSql) or die(mysqli_error($conn));
				if ($user) {
					//echo 'E-postadressen är redan registrerad.';
				}
				else {
					$sql = 'INSERT INTO pt_users (firstname, lastname, email, passMD5, loggedInKey)
						VALUES (
						"' . $input["firstname"] . '", 
						"' . $input["lastname"] . '", 
						"' . $input["email"] . '", 
						"' . $input["passMD5"] . '", 
						"' . $input["loggedInKey"] . '");';

					$result = mysqli_query($conn, $sql) or die(mysqli_error($conn));

					//echo 'Kontot är registrerat';
					/*$userSql = 'SELECT id FROM pt_users WHERE email = "' . $input['email'] . '"';
					$user = mysqli_query($conn, $userSql) or die(mysqli_error($conn));
					$userID = 0;
					while ($row = mysqli_fetch_assoc($user)) {
						$userID = $row['id'];
					}

					// Call loadData to get data about user
					loadData($userID);*/
				}
				break;
			}

			default:
				http_response_code(404);
				exit();
		}
		break;
	}

	case 'events': {
		switch ($method) {
			case 'GET': {
				// Test
				$sql = 'SELECT id, title FROM pt_events WHERE userId = ' . $request[1];
				$dbResult = mysqli_query($conn, $sql) or die(mysqli_error($conn));

				$result = [];

				while ($row = mysqli_fetch_assoc($dbResult)) {
					$row_arr['id'] = $row['id'];
					$row_arr['title'] = $row['title'];
					array_push($result, $row_arr);
				}

				mysqli_close($conn);

				echo json_encode($result);
				break;
			}

			case 'PUT': {
				$sql = 'UPDATE pt_events
						SET title = "' . $input["title"] . '", 
						date = "' . $input["date"] . '", 
						week = ' . $input["week"] . ', 
						type = "' . $input["type"] . '", 
						color = "' . $input["color"] . '", 
						place = "' . $input["place"] . '", 
						details = "' . $input["details"] . '", 
						results = "' . $input["results"] . '"
						WHERE id = ' . $request[2] . ' AND userId = ' . $request[1];

				$result = mysqli_query($conn, $sql) or die(mysqli_error($conn));

				// get data for events
				loadData($request[1]);
				break;
			}

			case 'POST': {
				$sql = 'INSERT INTO pt_events (title, date, week, type, color, place, details, results, userId)
						VALUES (
						"' . $input["title"] . '", 
						"' . $input["date"] . '", 
						' . $input["week"] . ', 
						"' . $input["type"] . '", 
						"' . $input["color"] . '", 
						"' . $input["place"] . '", 
						"' . $input["details"] . '", 
						"' . $input["results"] . '", 
						' . $request[1] . ')';

				$result = mysqli_query($conn, $sql) or die(mysqli_error($conn));

				// get data for events
				loadData($request[1]);
				break;
			}

			case 'DELETE': {
				$sql = 'DELETE FROM pt_events WHERE id = ' . $request[2] . ' AND userId = ' . $request[1];

				$result = mysqli_query($conn, $sql) or die(mysqli_error($conn));

				// get data for events
				loadData($request[1]);
				break;
			}

			default:
				http_response_code(404);
				exit();
		}
		break;
	}

	case 'periods': {
		switch ($method) {
			case 'GET': {
				// Test
				$sql = 'SELECT id, title FROM pt_periods WHERE userId = ' . $request[1];
				$dbResult = mysqli_query($conn, $sql) or die(mysqli_error($conn));

				$result = [];

				while ($row = mysqli_fetch_assoc($dbResult)) {
					$row_arr['id'] = $row['id'];
					$row_arr['title'] = $row['title'];
					array_push($result, $row_arr);
				}

				mysqli_close($conn);

				echo json_encode($result);
				break;
			}

			case 'PUT': {
				$sql = 'UPDATE pt_periods
						SET title = "' . $input["title"] . '",
						color = "' . $input["color"] . '", 
						details = "' . $input["details"] . '", 
						results = "' . $input["results"] . '"
						WHERE id = ' . $request[2] . ' AND userId = ' . $request[1];

				$result = mysqli_query($conn, $sql) or die(mysqli_error($conn));

				// get data for events
				loadData($request[1]);
				break;
			}

			case 'POST': {
				$sql = 'INSERT INTO pt_periods (title, color, details, results, userId)
						VALUES (
						"' . $input["title"] . '", 
						"' . $input["color"] . '", 
						"' . $input["details"] . '", 
						"' . $input["results"] . '", 
						' . $request[1] . ');';

				$result = mysqli_query($conn, $sql) or die(mysqli_error($conn));

				// get data for events
				loadData($request[1]);
				break;
			}

			case 'DELETE': {
				$sql = 'DELETE FROM pt_periods WHERE id = ' . $request[2] . ' AND userId = ' . $request[1];

				$result = mysqli_query($conn, $sql) or die(mysqli_error($conn));

				// get data for events
				loadData($request[1]);
				break;
			}

			default:
				http_response_code(404);
				exit();
		}
		break;
	}

	case 'training': {
		switch ($method) {
			case 'GET': {
				// Test
				$sql = 'SELECT id, year FROM pt_training WHERE userId = ' . $request[1];
				$dbResult = mysqli_query($conn, $sql) or die(mysqli_error($conn));

				$result = [];

				while ($row = mysqli_fetch_assoc($dbResult)) {
					$row_arr['id'] = $row['id'];
					$row_arr['year'] = $row['year'];
					array_push($result, $row_arr);
				}

				mysqli_close($conn);

				echo json_encode($result);
				break;
			}

			case 'PUT': {
				$sql = 'UPDATE pt_training
						SET year = ' . $input["year"] . ',
						week = ' . $input["week"] . ', 
						periodId = ' . $input["periodId"] . ', 
						details = "' . $input["details"] . '", 
						results = "' . $input["results"] . '"
						WHERE id = ' . $request[2] . ' AND userId = ' . $request[1];

				$result = mysqli_query($conn, $sql) or die(mysqli_error($conn));

				// get data for events
				loadData($request[1]);
				break;
			}

			case 'POST': {
				$sql = 'INSERT INTO pt_training (year, week, periodId, details, results, userId)
						VALUES (
						' . $input["year"] . ',
						' . $input["week"] . ',
						' . $input["periodId"] . ',
						"' . $input["details"] . '", 
						"' . $input["results"] . '", 
						' . $request[1] . ');';

				$result = mysqli_query($conn, $sql) or die(mysqli_error($conn));

				// get data for events
				loadData($request[1]);
				break;
			}

			case 'DELETE': {
				$sql = 'DELETE FROM pt_training WHERE id = ' . $request[2] . ' AND userId = ' . $request[1];

				$result = mysqli_query($conn, $sql) or die(mysqli_error($conn));

				// get data for events
				loadData($request[1]);
				break;
			}

			default:
				http_response_code(404);
				exit();
		}
		break;
	}
	default: {
		http_response_code(404);
		exit();
	}
}