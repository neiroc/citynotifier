<?php

/*
* Funzione Aggiorna Stato degli eventi dopo 20 minuti. tranne per buca e lavori in corso
*/
function updateStatus($now,$freshness,$event_id,$mysqli){
				
				$diff = $now - $freshness;
				if($diff > 1200) {
						$updateStatusQuery = "UPDATE Evento SET status=\"closed\" WHERE id_event=".$event_id;
						$updateResult = $mysqli->query($updateStatusQuery);
						return "closed";
				}else return "open";
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
