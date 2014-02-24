<?php

require 'db_aux.php';

$data = file_get_contents("php://input");

if($data =! Null){
	$segnalazione=json_decode($data);
}

//controllo che la segnalazione contenga i dati necessari
if(($segnalazione->{'type'} != Null)&&($segnalazione->{'lat'} != Null)&&($segnalazione->{'lng'} != Null)){

	$type = $segnalazione->{'type'};
	if($segnalazione->{'subtype'} =! Null){
		$subtype = $segnalazione->{'subtype'};
	}
	else{
		$subtype = Null;
	}
	$status = "open";
	$lat = $segnalazione->{'lat'};
	$lng = $segnalazione->{'lng'};

	if ($segnalazione->{'description'} != Null){
		$description = $segnalazione->{'description'};
	}
	else{
		$description = Null;
	}
	$id_utente = segnalazione->{'id_utente'};
	
	//definisco il tempo della segnalazione
	$time = time();

	//connessione al db
	if(!($con = connect_db())){
		$result['result'] = "errore di connessione al db server";
	}
	else{
		//definisco il radius in base al tipo di evento
		//############################## DA FINIRE
		if($type == )


		//controllo se esiste l'evento

		$query = "SELECT evento.* FROM evento WHERE type ='".$type."' AND subtype ='".$subtype."' AND (( 6371795 * acos( cos( radians($lat) ) * cos( radians( lat_med ) ) * cos( radians( lng_med ) - radians($lng) ) + sin( radians($lat) ) * sin( radians( lat_med ) ) ) ) < $radius);";

		if( $rispostadb = mysqli_query($con,$query)){

			if($row = mysqli_fetch_array($rispostadb)){

				$id_evento = row['id_event'];

				if((row['status']=='closed')&&(row['last_time'] < $time)){//#########################################SKEPTICAL
					//skeptical
				}
				else{
					//aggiungere contatore?
					$insert = "INSERT INTO notifiche (id_utente, id_event, lat, lng, time, status_notif, description)  VALUES ($id_utente, $id_evento, $lat, $lng, $time, 'open', $description);"
					mysqli_query($con,$insert);

					$lat = ($lat + row['lat_med'])/2;
					$lng = ($lat + row['lng_med'])/2;

					$update_query = "UPDATE evento SET lat_med = $lat, lng_med = $lng, last_time = $time  WHERE id_event = $id_evento;"
					mysqli_query($con,$update_query);

					//risposta positiva
					$result['event_id'] =  $id_evento;
					$result['result'] = "nuova segnalazione aperta con successo / segnalazione di un evento già in memoria avvenuta con successo";

				}
			}

		}
		//altrimenti inserisco(creo) il nuovo evento e la relativa notifica
		else{
			

			$insert = "INSERT INTO evento (type, subtype, start_time, last_time, status, lat_med, lng_med) VALUES ('".$type."','".$subtype."','".$time."','".$time."','".$status."','".$lat."','".$lng."');";
			
			//farsi restituire i dati da questa merda di mysqli
			if(mysqli_query($con,$insert)){
				
				$new_id = mysqli_insert_id($con);
				//inserisco notifica
				$insert = "INSERT INTO notifiche (id_utente, id_event, lat, lng, time, status_notif, description)  VALUES ($id_utente, $new_id, $lat, $lng, $time, 'open', $description);"
				mysqli_query($con,$insert);

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
header('Content-Type: application/json');
echo $re;


?>
