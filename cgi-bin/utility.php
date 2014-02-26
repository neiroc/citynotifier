<?php
/*
* Funzione Aggiorna Stato degli eventi dopo 20 minuti. tranne per buca!
*/
function updateStatus($now,$freshness,$event_id,$mysqli){
			
				$diff = $now - $freshness;
				if($diff > 1200) {
						$updateStatusQuery = "UPDATE Evento SET status=\"closed\" WHERE id_event=".$event_id;
						$updateResult = $mysqli->query($updateStatusQuery);
						return "closed";
				}
}

function gestisci_skeptical_aperti(){

	$now = time();

	$con = connect_db();

	$query = "SELECT skept.* FROM skept WHERE (".$now." - time) < 600;"; 

	$risp = mysqli_query($con,$query);

	if($row = mysqli_fetch_array($risp)){

		$j = count($row['id_event']);

		for($i=0; $i<$j-1; $i++){

			risolvi_skeptikal(($row['id_event'][i]));

		}
	}
}


/*
* Funzione restituisce distanza tra le coordinate di due punti
*/
function distance($lat1, $lon1, $lat2, $lon2) {

	$theta = $lon1 - $lon2;
	$dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
	$dist = acos($dist);
	$dist = rad2deg($dist);
	$dist = $dist * 60* 1.1515* 1.609344*1000;
	return $dist;

}

?>
