<?php

require 'db_aux.php';

$data = file_get_contents("php://input");

$notifica=json_decode($data);

$id_evento = $notifica->{'id_evento'};
$id_utente = $notifica->{'id_utente'};
$newstatus = $notifica->{'status'};
$lat = $notifica->{'lat'};
$lng = $notifica->{'lng'};
$description = $notifica->{'description'};
$type = $notifica->{'tipo'};
$subtype = $notifica->{'sottotipo'};

//connessione al db
$con = connect_db();

if($id_utente != Null){

	if(($id_evento != Null) && ($newstatus != Null) && ($lat != Null) && ($lng != Null)){

		//definisco il tempo della notifica
		$time = time();

		if($con == False){
			
			$result['result'] = "errore nell'invio della notifica";
			$result['errore']= "errore di connessione al db server";
		}
		else{

			//recupero info riguardo l'evento

			$query = "SELECT Evento.* FROM Evento WHERE id_event = ".$id_evento;

			$rispostadb = mysqli_query($con,$query);

			$row = mysqli_fetch_array($rispostadb);

			if(($row != Null) &&($type == $row['type'])&&($subtype == $row['subtype'])&&($lat == $row['lat_med'])&&($lng == $row['lng_med'])) { 

				$notifications=($row['notifications']);
				$privilegi = check_privileges($id_utente);
				
				if( (($privilegi >1) && ($newstatus=='archived')) || ( ($privilegi >2) && ($newstatus=='closed') && ($row['subtype']=='lavori_in_corso') || ($row['subtype']=='buca') || ($row['status']=='problemi_ambientali')) ){

					$result['result'] = "errore nell'invio della notifica";
					$result['errore']= "privilegi insufficenti";
				}
				else{
					
					if(($time - $row['last_time'])<172800){
						//aggiungo notifica

						$insert = "INSERT INTO Notifiche (id_utente, id_event, lat, lng, time, status_notif, description)  VALUES (".$id_utente.", ".$id_evento.", ".$lat.", ".$lng.", ".$time.",'".$newstatus."', '".$description."');";

						mysqli_query($con,$insert);

						$lat = ($lat + $row['lat_med'])/2;
						$lng = ($lng + $row['lng_med'])/2;
						$notifications = 1 + $notifications;
						$reliability = update_reliability($id_utente, $id_evento, $notifications);


						if((($row['status']==='closed')&&($newstatus==='open'))||($row['status']==='skeptical')) {//#########################################SKEPTICAL
						
							$skept=set_skeptikal($id_evento, $time);

							if($skept==True){
								//attivo lo skeptical

								$update_query = "UPDATE Evento SET  last_time = ".$time.", status = 'skeptical', event_reliability = ".$reliability.", notifications = ".$notifications.", lat_med = ".$lat.", lng_med = ".$lng."  WHERE id_event = ".$id_evento.";";
								
								mysqli_query($con,$update_query);

								//risposta positiva
								$result['result'] = "notifica inviata con successo";
								$result['msg'] = "Attenzione: generato stato skeptical su evento: ".$id_evento;
							}
							else{

								//lo skeptical esiste già 
								$update_query = "UPDATE Evento SET  last_time = ".$time.", event_reliability = ".$reliability.", notifications = ".$notifications.", lat_med = ".$lat.", lng_med = ".$lng."  WHERE id_event = ".$id_evento.";";
								mysqli_query($con,$update_query);
								$result['result'] = "notifica inviata con successo";
								$result['msg'] = "Attenzione: l'evento è in stato skeptical: ".$id_evento;

							}
						}
						else{

							$update_query = "UPDATE Evento SET status ='".$newstatus."' event_reliability=".$reliability.", notifications = ".$notifications.", lat_med = ".$lat.", lng_med = ".$lng.", last_time = ".$time."  WHERE id_event = ".$id_evento.";";
							ChromePhp::log($update_query);
							mysqli_query($con,$update_query);

							//risposta positiva
							$result['result'] = "notifica inviata con successo";
							
						}
					}
					else{//archivio il precedente evento perchè troppo vecchio e ne creo uno nuovo

						$update_query = "UPDATE Evento SET status = 'archived', last_time = ".$time."  WHERE id_event = ".$id_evento;
						mysqli_query($con,$update_query);

						$stats=get_stats($id_utente);
						$reliability=(1 + ( $stats['reputation'] * $stats['assiduity']))/2;

						$insert = "INSERT INTO Evento (type, subtype, start_time, last_time, status, event_reliability, notifications, lat_med, lng_med) VALUES ('".$type."','".$subtype."','".$time."','".$time."','".$newstatus."',".$reliability.", 1,'".$lat."','".$lng."');";
						
						if(mysqli_query($con,$insert)){
							
							$new_id = mysqli_insert_id($con);
						
							//inserisco notifica
							$insert = "INSERT INTO Notifiche (id_utente, id_event, lat, lng, time, status_notif, description)  VALUES ('".$id_utente."','".$new_id."','".$lat."','".$lng."','".$time."','".$newstatus."','".$description."');";
							$test = mysqli_query($con,$insert);
					
							//risultato positivo
							$result['result'] = "notifica inviata con successo";
							$result['msg'] = "archiviato vecchio evento e creato nuovo evento: ".$new_id;
						}
						else{

							$result['result'] = "Errore nell'invio della notifica";
							$result['errore'] = "errore di connessione con il db server";
						}

					}
				}
			}
			else{//inserire nuovo evento dopo segnalazione di evento remoto

				//ChromePhp::log("nuovo stato");
				$stats=get_stats($id_utente);
				$reliability=(1 + ( $stats['reputation'] * $stats['assiduity']))/2;

				$insert = "INSERT INTO Evento (type, subtype, start_time, last_time, status, event_reliability, notifications, lat_med, lng_med) VALUES ('".$type."','".$subtype."','".$time."','".$time."','".$newstatus."',".$reliability.", 1,'".$lat."','".$lng."');";
				
				if(mysqli_query($con,$insert)){
					
					$new_id = mysqli_insert_id($con);
				
					//inserisco notifica
					$insert = "INSERT INTO Notifiche (id_utente, id_event, lat, lng, time, status_notif, description)  VALUES ('".$id_utente."','".$new_id."','".$lat."','".$lng."','".$time."','".$newstatus."','".$description."');";
					$test = mysqli_query($con,$insert);
			
					//risultato positivo
					$result['result'] = "notifica inviata con successo";
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

//recupero reputation
$query="SELECT Utenti.reputation FROM Utenti WHERE id_utente=".$id_utente.";";

$rep = mysqli_query($con,$query);
if($row = mysqli_fetch_array($rep)){
	$result['reputation'] = $row['reputation'];
}

//risposta al client
$re = json_encode($result);
header('Content-Type: application/json; charset=utf-8');
echo $re;

?>
