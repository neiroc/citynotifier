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

	$sum=0;
	
	while($row = $risp->fetch_assoc()){
		
		$sum = $sum + (1+(($row['reputation']) * ($row['assiduity'])));
		
	}
	
	$reliability =	($sum / (2 * $not_num));
	ChromePhp::log($reliability);

	return $reliability;	
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

	$con = connect_db();

	$query= "SELECT Utenti.reputation FROM Utenti WHERE id_utente=".$id_utente.";";
	$risp= mysqli_query($con, $query);

	if($row = mysqli_fetch_array($risp)){

		$reputation=$row['reputation'];
		
		$reputation=$reputation+(1/10);


		if($reputation>1){

			$update="UPDATE Utenti SET reputation= 1 WHERE id_utente=".$id_utente.";";
			mysqli_query($con, $update);
		}
		else{
			$update="UPDATE Utenti SET reputation= ".$reputation." WHERE id_utente=".$id_utente.";";
			mysqli_query($con, $update);
		}
	}
}


/*dimuniusce la reputazione di un utente*/
function decrease_reputation($id_utente){

	$con = connect_db();

	$query= "SELECT Utenti.reputation FROM Utenti WHERE id_utente=".$id_utente.";";
	$risp= mysqli_query($con, $query);

	if($row = mysqli_fetch_array($risp)){

		$reputation=$row['reputation'];
		
		$reputation=$reputation-(1/10);

		if($reputation<(-1.0)){

			$update="UPDATE Utenti SET reputation= -1 WHERE id_utente=".$id_utente.";";
			mysqli_query($con, $update);
		}
		else{
			$update="UPDATE Utenti SET reputation= ".$reputation." WHERE id_utente=".$id_utente.";";
			mysqli_query($con, $update);
		}
	}
}



/*risolve lo  stato skeptical dell'evento passato*/

function risolvi_skeptical($id_evento){

	$time = time();

	$con = connect_db();
		
	$info_query="SELECT skept.time FROM skept WHERE id_event=".$id_evento.";";

	$check= mysqli_query($con, $info_query);

	if($row = mysqli_fetch_array($check)){

		$start = $row['time'];

		$query="SELECT DISTINCT Utenti.id_utente, Notifiche.status_notif FROM (Utenti INNER JOIN Notifiche ON Utenti.id_utente = Notifiche.id_utente) WHERE id_event=".$id_evento." AND time >= ".$start.";";

		$risp=mysqli_query($con, $query);

		$open=0;
		$closed=0;

		while($row2 = $risp->fetch_assoc()){
			
			if($row2['status_notif']=="open"){
				$open++;
			}
			else{
				$closed++;
			}
		}

		if($open==$closed){

			$update="UPDATE Evento SET status= 'open', last_time= ".$time." WHERE id_event=".$id_evento.";";

			mysqli_query($con, $update);
		}
		else{

			if($open>$closed){
				$update="UPDATE Evento SET status= 'open', last_time= ".$time." WHERE id_event=".$id_evento.";";

				mysqli_query($con, $update);

				
				$risp=mysqli_query($con, $query);

				while($row3 = $risp->fetch_assoc()){

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

				mysqli_query($con, $update);

				$risp=mysqli_query($con, $query);

				while($row3 = $risp->fetch_assoc()){

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

	$now = time();

	$con = connect_db();

	$query = "SELECT skept.id_event FROM skept WHERE (".$now." - time) > 1000;"; 

	$risp = mysqli_query($con,$query);

	while($row = $risp->fetch_assoc()){
			
			risolvi_skeptical($row['id_event']);
	}
}

?>
