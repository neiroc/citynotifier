<?php

getLocalEvents();

//prendi dati locali
function getLocalEvents()
{
//////////////////////CONNESSIONE DATABASE 
session_start(); // Parte l'azione delle sessioni

$db = mysql_connect('localhost', 'root', 'pass'); 
	if(!$db) { die("non riesco a connettermi: ". mysql_error()); }
mysql_select_db('citynotifier', $db) or die('Could not select database.'); 

$dist = 60;
$query="SELECT Evento.*, Notifica.*, ( 6371 * acos( cos( radians(44.498954) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians(11.335723) ) + sin( radians(44.498954) ) * sin( radians( lat ) ) ) ) AS distance FROM Evento, Notifica WHERE Evento.id = Notifica.evento_id GROUP BY Evento.id HAVING distance < ".$dist." ORDER BY distance LIMIT 0 , 20";


$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}


$query2 = "SELECT * FROM Notifica";

$result2 = mysql_query($query2);
if (!$result2) {
    die('Invalid query: ' . mysql_error());
}
    
					//$list_descr[1]=array();
					//$list_descr[2]=array(); 
		//$result2 = mysql_query($query2);
		while($row2 = mysql_fetch_array($result2)){
					$i=$row2['evento_id'];
					array_push($list_descr[$i]=array(), $row2['descr']);
					//$list_descr[$i]=array($row2['descr'],"something");//attenzione! protocollo non rispettato
					$coordinate[$i][]=array('lat'=> $row2['lat'], 'lng'=>$row2['lng']); 
					}
	
//request time
date_default_timezone_set("Europe/Rome");

//Get Data from DB and construct the json response 
while ($row = mysql_fetch_assoc($result)) {
		$event_id = $row['evento_id'];
		$id = $row['id'];
		$user_id = $row['utente_id'];
		$type = $row['type'];
		$subtype = $row['subtype'];
		$start_time = $row['start_time'];
		$status = $row['status'];
		$notifications = $row['notifications'];
		$freshness = $row['freshness'];
   
 		
		/*
		//$result2 = mysql_query($query2);
		while($row2 = mysql_fetch_array($result2)){
					$i=$row2['evento_id'];
					$list_descr[$i]=$row2['descr'];
					//$coordinate[]=array('lat'=>$row2['lat'], 'lng'=>$row2['lng']); 
					}
		}*/
	

		//aggiungi descr se e sole se l'event_id della not		
		$list_events[]=array(
							'event_id'=>'ltw1324_'.$event_id,
							"type"=>array("type"=>$type,"subtype"=>$subtype), 
							"description"=>$list_descr[1],
							"start_time"=> $start_time, 
							"freshness"=> $freshness, 
							"status"=> $status,
							//"reliability"=>floatval($reliability),
							"number_of_notifications"=>$notifications,
							//"locations"=>$listaLocations
							'locations'=>$coordinate[$event_id]
							);
}

//Fixed variables
$messaggio = "Messaggio di servizio";
$server = "http://ltw1324.web.cs.unibo.it";
$result = array('request_time' => time(),
								'result' => $messaggio,
								'from_server'=>$server,
								'events' => $list_events);

echo json_encode($result);
}

?>
