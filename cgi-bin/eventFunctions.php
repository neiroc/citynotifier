<?php

require "db_aux.php";  

//getRemoteEvents(local,all,all,44.49895,11.341896,5000,1385899200,1389355200,all);
//getLocalEvents(local,all,all,44.49895,11.341896,5000,1385899200,1389355200,all);

//VARIABILI GLOBALI
$l_events = array();
$new_events = array();

function getLocalEvents($scope,$type,$subtype,$lat,$lng,$radius,$timeMin,$timeMax,$status)
{

// CONNECT TO THE DATABASE -- nascondere questi parametri
$DB_NAME = 'techweb';
$DB_HOST = 'localhost';
$DB_USER = 'root';
$DB_PASS = 'pass';

$mysqli = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);

			if (mysqli_connect_errno()) {
			printf("Connect failed: %s\n", mysqli_connect_error());
			exit();
			}
//$radius = 500;
//$dist = 6000;//setta distanza. verrà passata tramite $_GET['param']
$query="SELECT Evento.*, Notifiche.*, ( 6371 * acos( cos( radians($lat) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians($lng) ) + sin( radians($lat) ) * sin( radians( lat ) ) ) ) AS distance FROM Evento, Notifiche WHERE Evento.id_event = Notifiche.id_event GROUP BY Evento.id_event HAVING distance < ".$radius." ORDER BY distance LIMIT 0 , 20";

/********************* Check parameters 
 if($get_type!="all"){
		$query=$query." AND Evento.type='$get_type'";
		if($get_subtype!="all"){
			$query=$query." AND Evento.subtype='$get_subtype'";
		}
	}
	if($get_status!="all"){
		$query=$query." AND Evento.status='$get_status'";
***********************/

	
$result = $mysqli->query($query) or die($mysqli->error.__LINE__);

$query2 = "SELECT * FROM Notifiche";
$result2 = $mysqli->query($query2) or die($mysqli->error.__LINE__);
	
//Request time
date_default_timezone_set("Europe/Rome");


//Get Data from DB and construct the json response 
while ($row = $result->fetch_assoc()) {
		$event_id = $row['id_event'];
		//$id = $row['id'];
		$user_id = $row['id_utente'];
		$type = $row['type'];
		$subtype = $row['subtype'];
		$start_time = $row['start_time'];
	  $freshness = $row['last_time'];
		$status = $row['status'];
		$reliability = $row['event_reliability'];
		$notifications = $row['notifications'];
   
 		//Adds descriptions and locations
		while($row2 = $result2->fetch_assoc()){
					$i=$row2['id_event'];
					$list_descr[$i][]=$row2['description'];
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
					"reliability"=>floatval($reliability),
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

return json_encode($result);
}

/*CHIAMATA REMOTA E AGGREGAZIONE DATI***********************/

function getRemoteEvents($scope,$type,$subtype,$lat,$lng,$radius,$timeMin,$timeMax,$status){
global $new_events;
global $l_events;

$m_curl = curl_multi_init();
$handles = array();
$result = array();
$res = array();


$ris = file_get_contents('../data/server.json','r');//prende il contenuto di json
$array = json_decode($ris, true); //decodifica json in un array


	foreach($array['server'] as $url)
	{
	$urls = $url."/richieste?scope=".$scope."&type=".$type."&subtype=".$subtype."&lat=".$lat."&lng=".$lng."&radius=".$radius."&timemin=".$timeMin."&timemax=".$timeMax."&status=".$status;


	$cURL = curl_init();

	$opt = array(
			  			CURLOPT_URL => $urls,
			  			//CURLOPT_HEADER => FALSE,
			  			CURLOPT_RETURNTRANSFER => TRUE,
			 		 		//CURLOPT_TIMEOUT => 5,
							//CURLOPT_FAILONERROR => TRUE,
							//CURLOPT_HTTPHEADER => array('Accept: application/json')
			);	

		curl_setopt_array($cURL, $opt);
		 			curl_multi_add_handle($m_curl, $cURL);
		 			$handles[] = $cURL;
	}

	$running = null;
	
	do {
		curl_multi_exec($m_curl, $running);
	} while ($running > 0);

	for($i = 0; $i < count($handles); $i++) {
    		if ($handles[$i]) {
			$out = curl_multi_getcontent($handles[$i]);
    			if ($out) $result[] = $out;
		}
    		curl_multi_remove_handle($m_curl, $handles[$i]);
		}
			
			$l_events = json_decode(getLocalEvents($scope,$type,$subtype,$lat,$lng,$radius,$timeMin,$timeMax,$status),true);
			//print_r($l_events);
			foreach ($result as $r) {
			$json = json_decode($r,true);
					foreach($json['events'] as $event){
					//passo ogni evento remoto e lo confronto con i dati locali. MODIFICARE PARAMETERS
					compareLocal($event,$scope,$type,$subtype,$lat,$lng,$radius,$timeMin,$timeMax,$status);				
					}

			}

			$l_events['events'] += $new_events;			
			echo json_encode($l_events);
			
}


/*
* Funzione confronta un evento remoto con tutti gli eventi locali. Se è presente aggrega altrimenti aggiunge
*/
function compareLocal($evento,$scope,$type,$subtype,$lat,$lng,$radius,$timeMin,$timeMax,$status)
{
global $l_events;
global $new_events;
$found = false;
//print_r($l_events);
	foreach($l_events['events'] as &$v)
	{
	$l_lat = $v['locations'][0]['lat'];
	$l_lng = $v['locations'][0]['lng'];
	$r_lat = $evento['locations'][0]['lat'];
	$r_lng = $evento['locations'][0]['lng'];
  $dist = distance($l_lat,$l_lng,$r_lat,$r_lng); //calcola distanza
	
		if(!$found){	
			//se la distanza dell'evento remoto con gli eventi locali è < 200 metri e tipo e sottotipo sono gli stessi AGGREGO
			if($dist <= 200 && $v['type']['type'] == $evento['type']['type'] && $v['type']['subtype'] == $evento['type']['subtype'])
			{
				$found = true;
		
				//aggrega evento remoto con locale. aggiungi descrizione e locations
				$v['description'] = array_merge($v['description'], $evento['description']); 
			
				$v['locations'] = array_merge($v['locations'], $evento['locations']);
			
				//calcolare reliability
				$v['number_of_notifications'] = count($v['description']);
				$v['freshness'] = max($v['freshness'], $evento['freshness']);
	
			}
		}
	}//Se alla fine del ciclo l'evento remoto non corrisponde a nessuno locale lo aggiungo ad una nuova lista eventi
 if(!$found) $new_events[] = $evento;	
}


/*
* Funzione restituisce distanza tra le coordinate di due punti
*/
function distance($lat1, $lon1, $lat2, $lon2) {

	$theta = $lon1 - $lon2;
	$dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
	$dist = acos($dist);
	$dist = rad2deg($dist);
	$dist = $dist * 60* 1.1515* 1.609344*1000;
	return $dist;

}

?>
