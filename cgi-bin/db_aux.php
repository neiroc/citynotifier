<?php

require 'ChromePhp.php';

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



function update_reliability($id_utente, $id_evento, $not_num){         

	$con2 = connect_db();

	$query= "SELECT DISTINCT Utenti.reputation, Utenti.assiduity FROM (Utenti INNER JOIN Notifiche ON Utenti.id_utente = Notifiche.id_utente) WHERE id_event=".$id_evento.";";

	$risp= mysqli_query($con2, $query);
ChromePhp::log($query);
$row = mysqli_fetch_array($risp);
ChromePhp::log($query);

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

function set_skeptikal($id_evento, $id_utente, $time){

	$con = connect_db();

	$query= "SELECT skept.* FROM skept WHERE id_event=".$id_evento.";";

	$check= mysqli_query($con, $query);
	$row = mysqli_fetch_array($check);
 //var_dump($row['id_event']);
	if(($row['id_event'])== $id_evento){

		return False;

	}
	else{

		$insert= "INSERT INTO skept (id_event, id_utente, time) VALUES (".$id_evento.", ".$id_utente.", ".$time.");";
		
		$risp= mysqli_query($con, $insert);

		if($risp){
			
			return True;
		}	
	}
}

function increase_reputation($id_utente){

	$con = connect_db();

	$query= "SELECT Utenti.reputation FROM Utenti WHERE id_utente=".$id_utente.";";
	$risp= mysqli_query($con, $query);

	if($row = mysqli_fetch_array($risp)){

		$reputation=$row['reputation']+0.1;

		if($reputation>1){

			$update="UPDATE Utenti SET reputation= 1 WHERE id_utente=".$id_utente.";";
		}
		else{
			$update="UPDATE Utenti SET reputation= ".$reputation." WHERE id_utente=".$id_utente.";";
		}
	}
}


function decrease_reputation($id_utente){

	$con = connect_db();

	$query= "SELECT Utenti.reputation FROM Utenti WHERE id_utente=".$id_utente.";";
	$risp= mysqli_query($con, $query);

	if($row = mysqli_fetch_array($risp)){

		$reputation=$row['reputation']-0.1;

		if($reputation<(-1.0)){

			$update="UPDATE Utenti SET reputation= -1 WHERE id_utente=".$id_utente.";";
		}
		else{
			$update="UPDATE Utenti SET reputation= ".$reputation." WHERE id_utente=".$id_utente.";";
		}
	}
}



function risolvi_skeptikal($id_evento){

	$time = time();

	$con = connect_db();
		
	$info_query="SELECT skept.time FROM skept WHERE id_event=".$id_evento.";";

	$check= mysqli_query($con, $info_query);

	if($row = mysqli_fetch_array($check)){

		$start = $row['time'];

		$query="SELECT DISTINCT Utenti.id_utente, Notifiche.status_notif FROM (Utenti INNER JOIN Notifiche ON Utenti.id_utente = Notifica.id_utente) WHERE id_event=".$id_evento." AND time > ".$start.";";

		$risp= mysqli_query($con, $query);

		if($row = mysqli_fetch_array($risp)){
			$open=0;
			$closed=0;
			$j=count($row['status_notif']);

			for($i=0; $i<$j-1; $i++){

				if($row['status_notif'][i]=="open"){
					$open++;
				}
				else{
					$closed++;
				}
			}
			if($open==$closed){
				$update="UPDATE Evento SET status= 'open' WHERE id_event=".$id_evento.";";

				mysqli_query($con, $update);

			}
			else{
				if($open>$closed){
					$update="UPDATE Evento SET status= 'open' WHERE id_event=".$id_evento.";";

					mysqli_query($con, $update);

					for($i=0; $i<$j-1; $i++){

						if($row['status_notif'][i]=="open"){

							increase_reputation($row['id_utente']);
						}
						else{
							
							decrease_reputation($row['id_utente']);
						}
					}

				}
				else{

					$update="UPDATE Evento SET status= 'open' WHERE id_event=".$id_evento.";";

					mysqli_query($con, $update);

					for($i=0; $i<$j-1; $i++){

						if($row['status_notif'][i]=="closed"){

							increase_reputation($row['id_utente']);
						}
						else{
							
							decrease_reputation($row['id_utente']);
						}
					}
				}
				$delete="DELETE FROM skept WHERE id_event=".$id_evento.";";
				mysqli_query($con, $delete);
			}
		}
	}	
}


?>
