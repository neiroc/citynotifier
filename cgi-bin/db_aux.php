<?php

include 'ChromePhp.php';



/*effettua la connessione al db server*/
function connect_db(){

	

    //$con=mysqli_connect("localhost","my1323","h7YecW3U9","my1323");
	$con=mysqli_connect("localhost","maboh","maboh123","techweb");

    // Check connection
    if (mysqli_connect_errno()){
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
        $con = False;
      }
    
    return $con;

}



/*controlla i privilegi di un utente*/
function check_privileges($id_utente){

	$con = connect_db();

	$query= "SELECT Utenti.privilegio FROM Utenti WHERE id_utente=".$id_utente.";";

	$risp= mysqli_query($con, $query);
	if($row = mysqli_fetch_array($risp)){
		$privilegio = $row['privilegio'];
		return $privilegio;
	}
	else{
	return False;
	}
}



/*resituisce le statistiche dell'utente passato*/
function get_stats($id_utente){

	
	$con = connect_db();
	$query= "SELECT Utenti.reputation, Utenti.assiduity FROM Utenti WHERE id_utente=".$id_utente.";";
	//var_dump($query);
	$risp= mysqli_query($con, $query);
	if($row = mysqli_fetch_array($risp)){
		
		return $row;
	}
	else{
	return False;
	}
}



/*aggiorna la reliability di un evento dopo una segnalazione o notifica*/
function update_reliability($id_utente, $id_evento, $not_num){         

	$con2 = connect_db();

	$query= "SELECT DISTINCT Utenti.reputation, Utenti.assiduity FROM (Utenti INNER JOIN Notifiche ON Utenti.id_utente = Notifiche.id_utente) WHERE id_event=".$id_evento.";";

	$risp= mysqli_query($con2, $query);
//ChromePhp::log($query);
$row = mysqli_fetch_array($risp);
//ChromePhp::log($query);

	if($row = mysqli_fetch_array($risp)){
		
		$sum=0;
		$j=count($row['reputation']);
		
		for($i=0; $i<$j-1 ; $i++){

		$sum = $sum + (1+(($row['reputation'][i]) * ($row['assiduity'][i])));
		
		}
		
		$reliability =	($sum / (2 * $not_num));
		ChromePhp::log($reliability);

		return $reliability;
	}
	else{
	return 1.0;
	}	
}


/*inserisce un evento nella lista degli skeptical*/
function set_skeptikal($id_evento, $time){

	$con = connect_db();

	$query= "SELECT skept.* FROM skept WHERE id_event=".$id_evento.";";

	$check= mysqli_query($con, $query);
	$row = mysqli_fetch_array($check);

	if(($row['id_event'])== $id_evento){

		return False;

	}
	else{

		$insert= "INSERT INTO skept (id_event, time) VALUES (".$id_evento.", ".$time.");";
		
		$risp= mysqli_query($con, $insert);

		if($risp){
			
			return True;
		}	
	}
}


/*aumenta la reputazione di un utente*/
function increase_reputation($id_utente){
ChromePhp::log("increase");
	$con = connect_db();

	$query= "SELECT Utenti.reputation FROM Utenti WHERE id_utente=".$id_utente.";";
	$risp= mysqli_query($con, $query);

	if($row = mysqli_fetch_array($risp)){

		$reputation=($row['reputation'])+0.1;
ChromePhp::log($reputation);

		if($reputation>1){

			$update="UPDATE Utenti SET reputation= 1 WHERE id_utente=".$id_utente.";";
		}
		else{
			$update="UPDATE Utenti SET reputation= ".$reputation." WHERE id_utente=".$id_utente.";";
		}
	}
}


/*dimuniusce la reputazione di un utente*/
function decrease_reputation($id_utente){
ChromePhp::log("decrease");
	$con = connect_db();

	$query= "SELECT Utenti.reputation FROM Utenti WHERE id_utente=".$id_utente.";";
	$risp= mysqli_query($con, $query);

	if($row = mysqli_fetch_array($risp)){

		$reputation=($row['reputation'])-0.1;
ChromePhp::log($reputation);
		if($reputation<(-1.0)){

			$update="UPDATE Utenti SET reputation= -1 WHERE id_utente=".$id_utente.";";
		}
		else{
			$update="UPDATE Utenti SET reputation= ".$reputation." WHERE id_utente=".$id_utente.";";
		}
	}
}



/*risolve lo  stato skeptical dell'evento passato*/

function risolvi_skeptical($id_evento){
ChromePhp::log("risolvo singolo skept");
	$time = time();
//ChromePhp::log($id_evento);
	$con = connect_db();
		
	$info_query="SELECT skept.time FROM skept WHERE id_event=".$id_evento.";";

	$check= mysqli_query($con, $info_query);
//ChromePhp::log($info_query);
	if($row = mysqli_fetch_array($check)){

		$start = $row['time'];

		$query="SELECT DISTINCT Utenti.id_utente, Notifiche.status_notif FROM (Utenti INNER JOIN Notifiche ON Utenti.id_utente = Notifiche.id_utente) WHERE id_event=".$id_evento." AND time >= ".$start.";";

ChromePhp::log($query);
		$risp=mysqli_query($con, $query);

		$open=0;
		$closed=0;

		while($row2 = $risp->fetch_assoc()){
			ChromePhp::log($row2);
			if($row2['status_notif']=="open"){
				$open++;
			}
			else{
				$closed++;
			}
		}

		if($open==$closed){
		ChromePhp::log("diobbestia");	
			$update="UPDATE Evento SET status= 'open', last_time= ".$time." WHERE id_event=".$id_evento.";";

			mysqli_query($con, $update);

		}
		else{
			if($open>$closed){
				$update="UPDATE Evento SET status= 'open', last_time= ".$time." WHERE id_event=".$id_evento.";";

				mysqli_query($con, $update);
ChromePhp::log("riapro");
				
				$risp=mysqli_query($con, $query);

				while($row3 = $risp->fetch_assoc()){
ChromePhp::log($row3);
ChromePhp::log($row3['status_notif']);
ChromePhp::log($row3['id_utente']);
					if($row3['status_notif']=="open"){

						increase_reputation($row3['id_utente']);
					}
					else{
						
						decrease_reputation($row3['id_utente']);
					}
				}

			}
			else{

				$update="UPDATE Evento SET status= 'closed', last_time= ".$time." WHERE id_event=".$id_evento.";";
ChromePhp::log("richiudo");
				mysqli_query($con, $update);

				$risp=mysqli_query($con, $query);

				while($row3 = $risp->fetch_assoc()){
ChromePhp::log($row3);
ChromePhp::log($row3['status_notif']);
ChromePhp::log($row3['id_utente']);
					if($row3['status_notif']=="closed"){

						increase_reputation($row3['id_utente']);
					}
					else{
						
						decrease_reputation($row3['id_utente']);
					}
				}
			}
		}
	$delete="DELETE FROM skept WHERE id_event=".$id_evento.";";
	mysqli_query($con, $delete);		
	}	
}


/*gestisce la risoluzione degli stati skeptical uno a uno*/

function gestisci_skeptical_aperti(){
ChromePhp::log("gestisco skeptical");
	$now = time();

	$con = connect_db();

	$query = "SELECT skept.id_event FROM skept WHERE (".$now." - time) > 60;"; 

	$risp = mysqli_query($con,$query);

	while($row = $risp->fetch_assoc()){
			ChromePhp::log($row['id_event']);
			risolvi_skeptical($row['id_event']);
	}
}

?>
