<?php

require 'db_aux.php';


$data = file_get_contents("php://input");

$segnalazione=json_decode($data);

$id_utente = $segnalazione->{'id_utente'};
$type = $segnalazione->{'type'}->{'type'};
$subtype = $segnalazione->{'type'}->{'subtype'};
$status = "open";
$lat = $segnalazione->{'lat'};
$lng = $segnalazione->{'lng'};
$description = $segnalazione->{'description'};
//ChromePhp::log($status);
//connessione al db
$con = connect_db();

if($id_utente!=Null){

	//controllo che la segnalazione contenga i dati necessari
	if(($type !=Null)&&($subtype!=Null)&&($lat != Null) && ($lng != Null)){

		//definisco il tempo della segnalazione
		$time = time();
		
		if($con == False){
			
			$result['result'] = "errore nell'invio della notifica";
			$result['errore']= "errore di connessione al db server";
		}
		else{
			//definisco il radius in base al tipo di evento
			switch ($subtype){

				case "coda" : {
					$radius = 200 ;
					break;
				}
				case "lavori_in_corso" : {
					$radius = 30 ;
					break;
				}
				case "strada_impraticabile" : {
					$radius = 50;
					break;
				}
				case "incendio" : {
					$radius = 100 ;
					break;
				}
				case "tornado" : {
					$radius = 500 ;
					break;
				}
				case "neve" : {
					$radius = 1000  ;
					break;
				}
				case "alluvione" : {
					$radius =  300;
					break;
				}
				case "partita" : {
					$radius = 200 ;
					break;
				}
				case "manifestazione" : {
					$radius =  100;
					break;
				}
				case "concerto" : {
					$radius = 50 ;
					break;
				}

				default:{
					$radius = 20 ;
				}
			}
		

			//controllo se esiste l'evento

			$query = "SELECT Evento.*, ( 6371795 * acos( cos( radians($lat) ) * cos( radians( lat_med ) ) * cos( radians( lng_med ) - radians($lng) ) + sin( radians($lat) ) * sin( radians( lat_med ) ) ) ) AS distance FROM Evento WHERE type ='".$type."' AND subtype ='".$subtype."' GROUP BY Evento.id_event HAVING distance < ".$radius." ORDER BY distance LIMIT 0 , 1";

			$rispostadb = mysqli_query($con,$query);

			if($row = mysqli_fetch_array($rispostadb)){

				$id_evento = $row['id_event'];
				
				//inserisco notifica
					
				$insert = "INSERT INTO Notifiche (id_utente, id_event, lat, lng, time, status_notif, description)  VALUES (".$id_utente.", ".$id_evento.", ".$lat.", ".$lng.", ".$time.", 'open', '".$description."');";
				mysqli_query($con,$insert);

				$lat = ($lat + $row['lat_med'])/2;
				$lng = ($lng + $row['lng_med'])/2;
				$notifications = 1 + ($row['notifications']);
				ChromePhp::log($notifications);
				$reliability = update_reliability($id_utente, $id_evento, $notifications);
				
				if((($row['status']==='closed')&&($newstatus==='open')&&(($time - $row['last_time'])<7200))||($row['status']==='skeptical')) {//#########################################SKEPTICAL
					
					$skept=set_skeptikal($id_evento, $time);

					if($skept==True){
						//ChromePhp::log($notifications);
						$update_query = "UPDATE Evento SET  last_time = ".$time.", status = 'skeptical', event_reliability = ".$reliability.", notifications = ".$notifications.", lat_med = ".$lat.", lng_med = ".$lng."  WHERE id_event = ".$id_evento.";";
						//ChromePhp::log($update_query);
						mysqli_query($con,$update_query);
						//risposta positiva
						$result['result'] = "nuova segnalazione aperta con successo / segnalazione di un evento già in memoria avvenuta con successo";
						$result['skept'] = "Attenzione: generato stato skeptical su evento: ".$id_evento;
					}
					else{

						$update_query = "UPDATE Evento SET  last_time = ".$time.", event_reliability = ".$reliability.", notifications = ".$notifications.", lat_med = ".$lat.", lng_med = ".$lng."  WHERE id_event = ".$id_evento.";";
						
						mysqli_query($con,$update_query);
						$result['result'] = "nuova segnalazione aperta con successo / segnalazione di un evento già in memoria avvenuta con successo";
					}
				}
				else{
					

					$update_query = "UPDATE Evento SET event_reliability=".$reliability.", notifications = ".$notifications.", lat_med = ".$lat.", lng_med = ".$lng.", last_time = ".$time."  WHERE id_event = ".$id_evento.";";
					mysqli_query($con,$update_query);

					//risposta positiva
					$result['event_id'] =  $id_evento;
					$result['result'] = "nuova segnalazione aperta con successo / segnalazione di un evento già in memoria avvenuta con successo";
				}
			}
			//altrimenti inserisco(creo) il nuovo evento e la relativa notifica
			else{
				
				$stats=get_stats($id_utente);
				$reliability=(1 + ( $stats['reputation'] * $stats['assiduity']))/2;
				

				$insert = "INSERT INTO Evento (type, subtype, start_time, last_time, status, event_reliability, notifications, lat_med, lng_med) VALUES ('".$type."','".$subtype."','".$time."','".$time."','".$status."',".$reliability.", 1,'".$lat."','".$lng."');";
				
				
				if(mysqli_query($con,$insert)){
					
					$new_id = mysqli_insert_id($con);
					
					//inserisco notifica
					$insert = "INSERT INTO Notifiche (id_utente, id_event, lat, lng, time, status_notif, description)  VALUES ('".$id_utente."','".$new_id."','".$lat."','".$lng."','".$time."','open','".$description."');";
					$test = mysqli_query($con,$insert);
					
					//risultato positivo
					$result['event_id'] =  $new_id;
					$result['result'] = "nuova segnalazione aperta con successo / segnalazione di un evento già in memoria avvenuta con successo";	
				}
				else{

					$result['result'] = 'Errore nella segnalazione di un nuovo evento o notifica di evento esistente.';
					$result['errore'] = 'errore di connessione con il db server';

				}
			}
		}	
	}
	else{
		$result['result'] = 'Errore nella segnalazione di un nuovo evento o notifica di evento esistente.';
		$result['errore'] = 'dati segnalazione non completi';
	}
}
else{
	$result['result'] = 'Errore nella segnalazione di un nuovo evento o notifica di evento esistente.';
	$result['errore'] = 'utente non riconosciuto';
}

//recupero reputation

$query="SELECT Utenti.reputation FROM Utenti WHERE id_utente=".$id_utente.";";

$rep = mysqli_query($con,$query);
if($row = mysqli_fetch_array($rep)){
	$result['reputation'] = "reputation: 0.2";//$row['reputation'];
	//ChromePhp::log($result['reputation']);
}

//risposta al client
$re = json_encode($result);
//var_dump($re);
header('Content-Type: application/json; charset=utf-8');
echo $re;


?>
