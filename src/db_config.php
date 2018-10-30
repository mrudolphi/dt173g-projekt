<?php
/**
 * Created by PhpStorm.
 * User: Maria
 * Date: 2018-10-10
 * Time: 08:40
 */

//class DatabaseConnection {
//	public function connectToDatabase() {

//	}
//}
$host = 'rudolphis.se.mysql';
$user = 'rudolphis_se';
$password = 'DC3Q2enm';
$database = 'rudolphis_se';

$conn = mysqli_connect($host, $user, $password, $database) or die('Error connecting to database');
$db_connected = mysqli_select_db($conn, $database);