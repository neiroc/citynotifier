<?php

require 'db_aux.php';

$data = file_get_contents("php://input");

//$result['result'] = "DEBUG: ";
//$result['error'] = $data;


$notifica=json_decode($data);

$id_evento = $notifica->{'id_evento'};
$id_utente = $notifica->{'id_utente'};
$newstatus = $notifica->{'status'};
$lat = $notifica->{'lat'};
$lng = $notifica->{'lng'};
$description = $notifica->{'description'};
$type = $notifica->{'tipo'};
$subtype = $notifica->{'sottotipo'};

if($id_utente != Null){

	if(($id_evento != Null) && ($newstatus != Null) && ($lat != Null) && ($lng != Null)){

		//definisco il tempo della notifica
		$time = time();

		//connessione al db
		$con = connect_db();
		
		if($con == False){
			
			$result['result'] = "errore nell'invio della notifica";
			$result['errore']= "errore di connessione al db server";
		}
		else{

			//recupero info riguardo l'evento

			$query = "SELECT Evento.* FROM Evento WHERE id_event = ".$id_evento;

			$rispostadb = mysqli_query($con,$query);

			if($row = mysqli_fetch_array($rispostadb)){ 

				if( (check_privileges($id_utente) >2) && (($newstatus=='archived') || ($newstatus=='closed')) && (($row['subtype']=='lavori_in_corso') || ($row['subtype']=='buca') || ($row['status']=='problemi_ambientali')) ){

					$result['result'] = "errore nell'invio della notifica";
					$result['errore']= "privilegi insufficenti";
				}
				else{
					
					//aggiungo notifica

					$insert = "INSERT INTO Notifiche (id_utente, id_event, lat, lng, time, status_notif, description)  VALUES (".$id_utente.", ".$id_evento.", ".$lat.", ".$lng.", ".$time.",'".$newstatus."', '".$description."');";

					mysqli_query($con,$insert);

					$lat = ($lat + $row['lat_med'])/2;
					$lng = ($lat + $row['lng_med'])/2;
					$notifications = 1 + ($row['notifications']);
					$reliability = update_reliability($id_utente, $id_evento, $notifications);

//var_dump($reliability);
					if(($row['status']==='closed')&&($newstatus==='open')&&(($time - $row['last_time'])<7200)){//#########################################SKEPTICAL
					
						$skept=set_skeptikal($id_evento, $id_utente, $time);

						if($skept==True){
							//attivo lo skeptical
							$update_query = "UPDATE Evento SET  last_time = ".$time.", status = 'skeptical', event_reliability = ".$reliability.", notifications = ".$notifications.", lat_med = ".$lat.", lng_med = ".$lng."  WHERE id_event = ".$id_evento.";";
							//var_dump($update_query);
							mysqli_query($con,$update_query);
							//risposta positiva
							$result['result'] = "notifica inviata con successo";
							$result['skept'] = "Attenzione: generato stato skeptical su evento: ".$id_evento;
						}
						else{
							//lo skeptical esiste già
							$update_query = "UPDATE Evento SET  last_time = ".$time.", event_reliability = ".$reliability.", notifications = ".$notifications.", lat_med = ".$lat.", lng_med = ".$lng."  WHERE id_event = ".$id_evento.";";
							mysqli_query($con,$update_query);
							$result['result'] = "notifica inviata con successo";
							//$result['skept'] = "Attenzione: l'evento è in stato skeptical: ".$id_evento;

						}


					}
					else{
						
						$update_query = "UPDATE Evento SET status = ".$newstatus."event_reliability=".$reliability.", notifications = ".$notifications.", lat_med = ".$lat.", lng_med = ".$lng.", last_time = ".$time."  WHERE id_event = ".$id_evento;
						mysqli_query($con,$update_query);

						//risposta positiva
						$result['result'] = "notifica inviata con successo";
					}
				}
			}
			else{//inserire nuovo stato
				$stats=get_stats($id_utente);
				$reliability=(1 + ( $stats['reputation'] * $stats['assiduity']))/2;

				$insert = "INSERT INTO Evento (type, subtype, start_time, last_time, status, event_reliability, notifications, lat_med, lng_med) VALUES ('".$type."','".$subtype."','".$time."','".$time."','".$newstatus."',".$reliability.", 1,'".$lat."','".$lng."');";
				
				//var_dump($insert);
				if(mysqli_query($con,$insert)){
					
					$new_id = mysqli_insert_id($con);
					//var_dump($new_id);
					//inserisco notifica
					$insert = "INSERT INTO Notifiche (id_utente, id_event, lat, lng, time, status_notif, description)  VALUES ('".$id_utente."','".$new_id."','".$lat."','".$lng."','".$time."','".$newstatus."','".$description."');";
					$test = mysqli_query($con,$insert);
					//var_dump($test);
					
					//risultato positivo
					$result['result'] = "notifica inviata con successo";
					$result['skept'] = "nuoooo";

					
					
				}
				else{

					$result['result'] = "Errore nell'invio della notifica";
					$result['errore'] = "errore di connessione con il db server";
				}

			}
		}			
	}
	else{

		$result['result'] = "errore nell'invio della notifica";
		$result['errore']= "dati notifica incompleti";
	}
}

else{

	$result['result'] = "errore nell'invio della notifica";
	$result['errore']= "utente non riconosciuto";

}

//risposta al client
$re = json_encode($result);
header('Content-Type: application/json; charset=utf-8');
echo $re;

?>
