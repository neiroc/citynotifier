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
}

//definisco il tempo della segnalazione
$time = time();

//connessione al db
$con = connect_db();

//controllo se esiste un evento simile
$query = "SELECT id_event FROM evento WHERE type ='".$segnalazione->{'type'}."' AND subtype ='".$segnalazione->{'subtype'}."' AND (lat_med BETWEEN "






//altrimenti inserisco(creo) il nuovo evento e la relativa notifica

if($subtype =! Null){

	$insert = "INSERT INTO evento (type, subtype, start_time, last_time, status, lat_med, lng_med) VALUES ('".$type."','".$subtype."','".$time."','".$time."','".$status."','".$lat."','".$lng."');";
}
else{

	$insert = "INSERT INTO evento (type, start_time, last_time, status, lat_med, lng_med) VALUES ('".$type."','".$time."','".$time."','".$status."','".$lat."','".$lng."');";
}

//farsi restituire i dati da questa merda di mysqli
if(mysqli_query($con,$insert)){
	//risultato positivo
	$result['event_id'] = mysqli_insert_id($con); 
	$result['result'] = "nuova segnalazione aperta con successo / segnalazione di un evento già in memoria avvenuta con successo";
	//inserisco notifica
}
else{

	$result['result'] =

}

//risposta

//chiudo connessione al db
mysqli_close($con);

//risposta al client



?>
