<?php
getLocalEvents();


function getLocalEvents()
{
// CONNECT TO THE DATABASE -- nascondere questi parametri
$DB_NAME = 'citynotifier';
$DB_HOST = 'localhost';
$DB_USER = 'root';
$DB_PASS = 'pass';

$mysqli = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);

			if (mysqli_connect_errno()) {
			printf("Connect failed: %s\n", mysqli_connect_error());
			exit();
			}

$dist = 60;//setta distanza. verrà passata tramite $_GET['param']
$query="SELECT Evento.*, Notifica.*, ( 6371 * acos( cos( radians(44.498954) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians(11.335723) ) + sin( radians(44.498954) ) * sin( radians( lat ) ) ) ) AS distance FROM Evento, Notifica WHERE Evento.id = Notifica.evento_id GROUP BY Evento.id HAVING distance < ".$dist." ORDER BY distance LIMIT 0 , 20";
$result = $mysqli->query($query) or die($mysqli->error.__LINE__);

$query2 = "SELECT * FROM Notifica";
$result2 = $mysqli->query($query2) or die($mysqli->error.__LINE__);
	
//Request time
date_default_timezone_set("Europe/Rome");


//Get Data from DB and construct the json response 
while ($row = $result->fetch_assoc()) {
		$event_id = $row['evento_id'];
		$id = $row['id'];
		$user_id = $row['utente_id'];
		$type = $row['type'];
		$subtype = $row['subtype'];
		$start_time = $row['start_time'];
		$freshness = $row['freshness'];
		$status = $row['status'];
		$notifications = $row['notifications'];
   
 		//Adds descriptions and locations
		while($row2 = $result2->fetch_assoc()){
					$i=$row2['evento_id'];
					$list_descr[$i][]=$row2['descr'];
					$coordinate[$i][]=array('lat'=>$row2['lat'], 'lng'=>$row2['lng']);
					}

		//Array Events
		$list_events[] = array(
					'event_id'=>'ltw1324_'.$event_id,
					'type'=>array("type"=> $type,"subtype"=>$subtype), 
					'description'=> $list_descr[$event_id],
					'start_time'=> intval($start_time), 
					'freshness'=> intval($freshness), 
					'status'=> $status,
					//"reliability"=>floatval($reliability),
					'number_of_notifications'=> intval($notifications),
					'locations'=> $coordinate[$event_id]
					);
}

//Returns the json
$messaggio = "Messaggio di servizio";
$server = "http://ltw1324.web.cs.unibo.it";
$result = array('request_time' => time(),
								'result' => $messaggio,
								'from_server'=> $server,
								'events' => $list_events);
header('Content-Type: application/json');
echo json_encode($result);
}

/************************************************************************************/


/*
function getRemoteEvents(){

}*/





?>
