<?php

require 'db_aux.php';

$data = file_get_contents("php://input");

$notifica=json_decode($data);

if($notifica->{'id_utente'} != Null){

	if(($notifica->{'id_evento'} != Null)&&($notifica->{'status'} != Null)&&($notifica->{'lat'} != Null)&&($notifica->{'lng'} != Null)){

		$id_evento = $notifica->{'id_evento'};
		$id_utente = $notifica->{'id_utente'};
		$status = $notifica->{'status'};
		$lat = $notifica->{'lat'};
		$lng = $notifica->{'lng'};
		$description = $notifica->{'description'};
		

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

			$query = "SELECT Evento.* FROM Evento WHERE id_utente = ".$id_utente.";";

			$rispostadb = mysqli_query($con,$query);

			if($row = mysqli_fetch_array($rispostadb)){

				if( (check_privileges($id_utente) >2) && ($status=='closed') && (($row['subtype']=='lavori_in_corso') || ($row['subtype']=='buca') || ($row['status']=='problemi_ambientali')) ){

					$result['result'] = "errore nell'invio della notifica";
					$result['errore']= "privilegi insufficenti";
				}
				else{
					if(($row['status']=='closed')&&($status == 'open')&&($row['last_time'] < $time)){//###################################SKEPTICAL
						//skeptical
					}
					else{
						//aggiungo notifica

						$insert = "INSERT INTO Notifiche (id_utente, id_event, lat, lng, time, status_notif, description)  VALUES (".$id_utente.", ".$id_evento.", ".$lat.", ".$lng.", ".$time.", 'open', '".$description."');";

						mysqli_query($con,$insert);

						$lat = ($lat + $row['lat_med'])/2;
						$lng = ($lat + $row['lng_med'])/2;
						$notifications = $row['notifications']+1;
						$reliability = update_reliability($id_utente, $id_evento, $notifications);

						$update_query = "UPDATE Evento SET event_reliability=".$reliability.", notifications = ".$notifications.", lat_med = ".$lat.", lng_med = ".$lng.", last_time = ".$time."  WHERE id_event = ".$id_evento.";";
						mysqli_query($con,$update_query);

						//risposta positiva
						$result['event_id'] =  $id_evento;
						$result['result'] = "notifica inviata con successo";
					}
				}
			}
			else{

				$result['result'] = "errore nell'invio della notifica";
				$result['errore']= "errore di connessione al db server";
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