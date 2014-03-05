<?php

require "db_aux.php";  
require "utility.php";
 
//VARIABILI GLOBALI
$l_events = array(); //local events in getRemote temporanei
$new_events = array(); //nuova lista eventi eventi remoti + locali aggregati
$mergedEvents = array();//solo eventi aggregati dalla remot


//getRemoteEvents(local,all,all,44.49895,11.341896,50,1385856000,1389312000,all);
//echo getLocalEvents(local,all,all,44.49895,11.341896,50000,1385899200,1393520400,all,True);
//http://localhost/richieste?scope=local&type=emergenze_sanitarie&subtype=ferito&lat=44.524966819292565&lng=11.523284912109375&radius=2000&timemin=1388534400&timemax=1393590048&status=all
/*
* Prendi Eventi Locali
*/
function getLocalEvents($scope,$type,$subtype,$lat,$lng,$radius,$timeMin,$timeMax,$status,$mode){
	$list_events = array();
	
	//Connect to DB
	$mysqli = connect_db();

	if($mysqli == False){
		printf("Connect failed: %s\n", mysqli_connect_error());
		exit();
	}

	$query="SELECT Evento.*, Notifiche.*, ( 6371795 * acos( cos( radians($lat) ) * cos( radians( lat_med ) ) * cos( radians( lng_med ) - radians($lng) ) + sin( radians($lat) ) * sin( radians( lat_med ) ) ) ) AS distance FROM Evento, Notifiche WHERE Evento.id_event = Notifiche.id_event AND status != 'archived' GROUP BY Evento.id_event HAVING distance < ".$radius;

	//check parameters
	if($type!="all"){
		$query=$query." AND Evento.type='$type'";
		
		if($subtype!="all"){
			$query=$query." AND Evento.subtype='$subtype'";
		}
	}
	if($status!="all"){
		$query=$query." AND Evento.status='$status'";
	}
	$result = $mysqli->query($query) or die($mysqli->error.__LINE__);
	
	//If result is not empty
	if($result->num_rows){
 		
		//Another query
		$query2 = "SELECT * FROM Notifiche";
		$result2 = $mysqli->query($query2) or die($mysqli->error.__LINE__);

	
		//Set Time Zone
		date_default_timezone_set("Europe/Rome");
		$now = time();
	

		//Get Data from DB and construct the json response 
		while ($row = $result->fetch_assoc()) {
			$event_id = $row['id_event'];
			$user_id = $row['id_utente'];
			$type = $row['type'];
			$subtype = $row['subtype'];
			$start_time = $row['start_time'];
			$freshness = $row['last_time'];
			$status = $row['status'];
			$reliability = $row['event_reliability'];
			$notifications = $row['notifications'];

		 	//variabili per geocode
		 	$lat_med=$row['lat_med'];
	 		$lng_med=$row['lng_med'];
	 		

			 
		 	//Adds descriptions and locations
			while($row2 = $result2->fetch_assoc()){
				$i=$row2['id_event'];
				$list_descr[$i][]=$row2['description'];
				$coordinate[$i][]=array('lat'=>$row2['lat'], 'lng'=>$row2['lng']);
			}
			//Update Status.
			//ChromePhp::log($status);
			if($status != "skeptical"){
				if($type != "problemi_stradali" && ( $subtype != "buca" || $subtype != "lavori_in_corso")){ 
					if($status == "open") {
						$status = updateStatus($now,$freshness,$event_id,$mysqli);
					}
				}
			}
			
			if($mode=True){

				$address=calcola_indirizzo($lat_med, $lng_med);
				$list_events[] = array(
					'event_id'=>'ltw1324_'.$event_id,
					'type'=>array("type"=> $type,"subtype"=>$subtype), 
					'description'=> $list_descr[$event_id],
					'start_time'=> intval($start_time), 
					'freshness'=> intval($freshness), 
					'status'=> $status,
					"reliability"=>floatval($reliability),
					'number_of_notifications'=> intval($notifications),
					'locations'=> $coordinate[$event_id],
					'address'=> $indirizzo
				);

			}
			else{
			
				//ChromePhp::log($address);
				

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
		}
	}//if end

	//risoluzione degli skeptikal
	gestisci_skeptical_aperti();

	//Returns the json
	$messaggio = "Messaggio di servizio";
	$server = "http://ltw1324.web.cs.unibo.it";
	$result = array('request_time' => time(),
								'result' => $messaggio,
								'from_server'=> $server,
								'events' => $list_events);
	//header('Content-Type: application/json; charset=utf-8');

	if($mode==True){
		echo json_encode($result);
	}
	else{
		return json_encode($result);
	}	


}

function calcola_indirizzo($lat, $lng){

	$reverseurl = "https://maps.googleapis.com/maps/api/geocode/json?latlng=".$lat.",".$lng."&language=it&result_type=street_address&sensor=true&key=AIzaSyA6xA6H345Svd58sdTUNpRU5rT5NsA2jPo";

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL,$reverseurl);
	curl_setopt($ch, CURLOPT_TIMEOUT, 30);
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
	$result = curl_exec($ch);
	curl_close($ch);

	$aux=json_decode($result);
	
	$strada=$aux->results[0]->address_components[1]->short_name;
	$civico=$aux->results[0]->address_components[0]->short_name;
	$città=$aux->results[0]->address_components[4]->short_name;
    
	$indirizzo=$strada.",".$civico.",".$città;

	//ChromePhp::log($indirizzo);

	return $indirizzo;
}



/*
*getRemote deve restituire  gli eventi remoti e i locali aggregati ai remoti. NON i locali non aggregati
*/
function getRemoteEvents($scope,$type,$subtype,$lat,$lng,$radius,$timeMin,$timeMax,$status){

	global $new_events;
	global $l_events;
	global $mergedEvents;

	$handles = array();
	$result = array();


	$m_curl = curl_multi_init();

	//ServerList
	$ris = file_get_contents('../data/server.json','r'); 
	$array = json_decode($ris, true); 


	foreach($array['server'] as $url){
	
		$urls = $url."/richieste?scope=local&type=".$type."&subtype=".$subtype."&lat=".$lat."&lng=".$lng."&radius=".$radius."&timemin=".$timeMin."&timemax=".$timeMax."&status=".$status;

		$cURL = curl_init();

		$opt = array(
			CURLOPT_URL => $urls,
			CURLOPT_HEADER => FALSE,
			CURLOPT_RETURNTRANSFER => TRUE,
		 	CURLOPT_TIMEOUT => 5,
			CURLOPT_FAILONERROR => TRUE,
			//CURLOPT_HTTPHEADER => array('Accept: application/json')
		);	
		curl_setopt_array($cURL, $opt);
		curl_multi_add_handle($m_curl, $cURL);
		$handles[] = $cURL;
	}
	$running = null;
	
	do {
		curl_multi_exec($m_curl, $running);
	}while ($running > 0);

	for($i = 0; $i < count($handles); $i++) {
    	if ($handles[$i]) {
			$out = curl_multi_getcontent($handles[$i]);
    		if ($out)
				$result[] = $out;
		}
    	curl_multi_remove_handle($m_curl, $handles[$i]);
	}
	
	//Local Events	
	$l_events = json_decode(getLocalEvents($scope,$type,$subtype,$lat,$lng,$radius,$timeMin,$timeMax,$status,False),true);
	//print_r(json_encode($l_events));

	foreach ($result as $r) {
		$json = json_decode($r,true);
		//print_r(json_encode($json));
		foreach($json['events'] as $event){
			//passo ogni evento remoto e lo confronto con i dati locali. 	
			 compareLocal($event,$scope,$type,$subtype,$lat,$lng,$radius,$timeMin,$timeMax,$status);				
		}
	}

   //print_r($mergedEvents);
	
	//Merge Local with Remote Events 
	
	$new_events = array_merge($mergedEvents, $new_events); 
	//print_r($new_events);
	//print_r($l_events);
	
	//Return json
	$messaggio = "Messaggio di servizio";
	$server = "http://ltw1324.web.cs.unibo.it";
	$result = array('request_time' => time(),
								'result' => $messaggio,
								'from_server'=> $server,
								'events' => $new_events);
	//header('Content-Type: application/json; charset=utf-8');
			
	echo json_encode($result);
}


/*
* Funzione confronta un evento remoto con tutti gli eventi locali. Se è presente aggrega altrimenti aggiunge NO non aggiunge
*/
function compareLocal($evento,$scope,$type,$subtype,$lat,$lng,$radius,$timeMin,$timeMax,$status){
	
	global $l_events; //ci sono tutti gli eventi locali
	global $new_events;
	global $mergedEvents;
	$found = false;

   //serve ancora il puntatore &??
	foreach($l_events['events'] as $v){

		//calcolo di longitudine e latitudine media per gli eventi
		$sum  = 0;
		$sum1 = 0;
		$i    = 0;

		foreach($v['locations'] as $value) {
			$sum  += $value['lat'];
			$sum1 += $value['lng'];
			$i++;	
		}

		$l_lat = $sum/$i;
		$l_lng = $sum1/$i;
	
		$sum  = 0;
		$sum1 = 0;
		$i    = 0;

		foreach($evento['locations'] as $value) {
			$sum  += $value['lat'];
			$sum1 += $value['lng'];
			$i++;
		}
		//aggiunto controllo. server non rispettano protocollo	
		if($i != 0){
			$r_lat = $sum/$i;
			$r_lng = $sum1/$i;
	   	}
	   
		$dist = distance($l_lat,$l_lng,$r_lat,$r_lng); //calcola distanza tra evento locale e remoto
	
		//$timeOK=True;
		//checktime -48h+
		//if(abs($timeMax - $evento['freshness']) < 172800) $timeOK = True;
		//	else $timeOK = False;
		
		if(!$found){	
	
			$eventArea = setDistEvent($v['type']['type'],$v['type']['subtype']);

			//se la distanza dell'evento remoto con gli eventi locali rientra nel raggio d'azione dell'evento aggrega altrimenti no
			if($dist <= $eventArea && $v['type']['type'] == $evento['type']['type'] && $v['type']['subtype'] == $evento['type']['subtype']){
				
				//print "Sto aggregando\n";
				//print_r($v);
				$found = true;
		
				//aggrega evento remoto con locale. aggiungi descrizione e locations
				$v['description'] = array_merge($v['description'], $evento['description']); 
			
				$v['locations'] = array_merge($v['locations'], $evento['locations']);
			
				$v['reliability'] = ($v['reliability'] + $evento['reliability']) / 2;
				$v['number_of_notifications'] = count($v['description']);
				$v['freshness'] = max($v['freshness'], $evento['freshness']);
				
				//lista di soli eventi aggregati				
				$mergedEvents[] = $v;
	        
			}
		}
	}
	//Se alla fine del ciclo l'evento remoto non corrisponde a nessuno locale lo aggiungo ad una nuova lista eventi
	if(!$found) $new_events[] = $evento;

}




?>
