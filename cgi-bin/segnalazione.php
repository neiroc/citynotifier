<?php

require 'db_aux.php';

$data = file_get_contents("php://input");
//var_dump($data);

$segnalazione=json_decode($data);

 
//controllo che la segnalazione contenga i dati necessari
if(($segnalazione->{'lat'} != Null) && ($segnalazione->{'lng'} != Null)){

	$type = $segnalazione->{'type'}->{'type'};
	$subtype = $segnalazione->{'type'}->{'subtype'};
	$status = "open";
	$lat = $segnalazione->{'lat'};
	$lng = $segnalazione->{'lng'};
	$description = $segnalazione->{'description'};
	$id_utente = $segnalazione->{'id_utente'};

	//definisco il tempo della segnalazione
	$time = time();

	//connessione al db
	$con = connect_db();
	if($con == False){
		$result['result'] = "errore di connessione al db server";
	}
	else{
		//definisco il radius in base al tipo di evento
		//############################################################################ DA FINIRE
		/*switch ($subtype){

			case "coda" : {
				$radius =  ;
				break;
			}
			case "lavori_in_corso" : {
				$radius =  ;
				break;
			}
			case "strada_impraticabile" : {
				$radius =  ;
				break;
			}
			case "incendio" : {
				$radius =  ;
				break;
			}
			case "tornado" : {
				$radius =  ;
				break;
			}
			case "neve" : {
				$radius =  ;
				break;
			}
			case "alluvione" : {
				$radius =  ;
				break;
			}
			case "partita" : {
				$radius =  ;
				break;
			}
			case "manifestazione" : {
				$radius =  ;
				break;
			}
			case "concerto" : {
				$radius =  ;
				break;
			}

			default:{
				$radius =  ;
			}



		}*/
		$radius = 20;

		//controllo se esiste l'evento

		$query = "SELECT Evento.*, ( 6371795 * acos( cos( radians($lat) ) * cos( radians( lat_med ) ) * cos( radians( lng_med ) - radians($lng) ) + sin( radians($lat) ) * sin( radians( lat_med ) ) ) ) AS distance FROM Evento WHERE type ='".$type."' AND subtype ='".$subtype."' GROUP BY Evento.id_event HAVING distance < ".$radius." ORDER BY distance LIMIT 0 , 1";
//$query="SELECT Evento.*, Notifiche.*, ( 6371795 * acos( cos( radians($lat) ) * cos( radians( lat_med ) ) * cos( radians( lng_med ) - radians($lng) ) + sin( radians($lat) ) * sin( radians( lat_med ) ) ) ) AS distance FROM Evento, Notifiche WHERE Evento.id_event = Notifiche.id_event GROUP BY Evento.id_event HAVING distance < ".$radius." ORDER BY distance LIMIT 0 , 20";

		$rispostadb = mysqli_query($con,$query);

		if($row = mysqli_fetch_array($rispostadb)){

			$id_evento = $row['id_event'];
//var_dump($id_evento);
			if(($row['status']=='closed')&&($row['last_time'] < $time)){//#########################################SKEPTICAL
				//skeptical
			}
			else{
				
				$insert = "INSERT INTO Notifiche (id_utente, id_event, lat, lng, time, status_notif, description)  VALUES (".$id_utente.", ".$id_evento.", ".$lat.", ".$lng.", ".$time.", 'open', '".$description."');";
				mysqli_query($con,$insert);

				$lat = ($lat + $row['lat_med'])/2;
				$lng = ($lat + $row['lng_med'])/2;
				$notifications = $row['notifications']+1;

				$update_query = "UPDATE Evento SET notifications = ".$notifications.", lat_med = ".$lat.", lng_med = ".$lng.", last_time = ".$time."  WHERE id_event = ".$id_evento.";";
				mysqli_query($con,$update_query);

				//risposta positiva
				$result['event_id'] =  $id_evento;
				$result['result'] = "nuova segnalazione aperta con successo / segnalazione di un evento già in memoria avvenuta con successo";

			}

		}
		//altrimenti inserisco(creo) il nuovo evento e la relativa notifica
		else{
			

			$insert = "INSERT INTO Evento (type, subtype, start_time, last_time, status, notifications, lat_med, lng_med) VALUES ('".$type."','".$subtype."','".$time."','".$time."','".$status."', 1,'".$lat."','".$lng."');";
			
			//var_dump($insert);
			if(mysqli_query($con,$insert)){
				
				$new_id = mysqli_insert_id($con);
				//var_dump($new_id);
				//inserisco notifica
				$insert = "INSERT INTO Notifiche (id_utente, id_event, lat, lng, time, status_notif, description)  VALUES ('".$id_utente."','".$new_id."','".$lat."','".$lng."','".$time."','open','".$description."');";
				$test = mysqli_query($con,$insert);
				//var_dump($test);
				
				//risultato positivo
				$result['event_id'] =  $new_id;
				$result['result'] = "nuova segnalazione aperta con successo / segnalazione di un evento già in memoria avvenuta con successo";
				
				
			}
			else{

				$result['result'] = 'Errore nella segnalazione di un nuovo evento o notifica di evento esistente.';

			}
		}
	}

	
}
else{
	$result['result'] = 'Errore nella segnalazione di un nuovo evento o notifica di evento esistente.';
}


//risposta al client

$re = json_encode($result);
//var_dump($re);
header('Content-Type: application/json; charset=utf-8');
echo $re;


?>
