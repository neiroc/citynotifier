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
//da fare

//altrimenti inserisco il nuovo evento e la relativa notifica

if($subtype =! Null){

	$query = "INSERT INTO evento (type, subtype, start_time, last_time, status, lat_med, lng_med) VALUES ('".$type."','".$subtype."','".$time."','".$time."','".$status."','".$lat."','".$lng."');"
}
else{

	$query = "INSERT INTO evento (type, start_time, last_time, status, lat_med, lng_med) VALUES ('".$type."','".$time."','".$time."','".$status."','".$lat."','".$lng."');"
}

if( !mysqli_query($con,$query)){

}


?>
