<?php

require 'db_aux.php';

$data = file_get_contents("php://input");

if($data =! Null){
	$notifica=json_decode($data);
}

if(($notifica->{'id_evento'} != Null)&&($notifica->{'id_utente'} != Null)&&($notifica->{'status'} != Null)&&($notifica->{'lat'} != Null)&&($notifica->{'lng'} != Null)){

	$id_evento = $notifica->{'id_evento'};
	$id_utente = $notifica->{'id_utente'};
	$status = $notifica->{'status'};
	$lat = $notifica->{'lat'};
	$lng = $notifica->{'lng'};

	if ($notifica->{'description'} != Null){
		$description = $notifica->{'description'};
	}
	else{
		$description = Null;
	}

	//definisco il tempo della notifica
	$time = time();

	//connessione al db
	if(!($con = connect_db())){
		$result['result'] = "errore di connessione al db server";
	}
	else{
		//recupero info riguardo l'evento

		$query = "SELECT evento.* FROM evento WHERE id_utente = '".$id_utente."';";

		if( $rispostadb = mysqli_query($con,$query)){

			if($row = mysqli_fetch_array($rispostadb)){

				if((row['status']=='closed')&&($status == 'open')&&(row['last_time'] < $time)){//###################################SKEPTICAL
					//skeptical
				}
				else{
					//aggiungo notifica
					//aggiungere contatore?
					$insert = "INSERT INTO notifiche (id_utente, id_event, lat, lng, time, status_notif, description)  VALUES ($id_utente, $id_evento, $lat, $lng, $time, $status, $description);"
					mysqli_query($con,$insert);

					$lat = ($lat + row['lat_med'])/2;
					$lng = ($lat + row['lng_med'])/2;

					$update_query = "UPDATE evento SET lat_med = $lat, lng_med = $lng, last_time = $time  WHERE id_event = $id_evento;"
					mysqli_query($con,$update_query);

					//risposta positiva
					$result['event_id'] =  $id_evento;
					$result['result'] = "notifica inviata con successo";
				}
			}

		}
		else{

			$result['result'] = "errore nell'invio della notifica";

		}

	}

		
}
else{

	$result['result'] = "errore nell'invio della notifica";

}


//risposta al client
$re = json_encode($result);
header('Content-Type: application/json');
echo $re;

?>