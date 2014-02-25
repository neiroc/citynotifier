<?php

function connect_db(){

	//$url=$SERVER;

    $con=mysqli_connect("localhost","maboh","maboh123","techweb");

    // Check connection
    if (mysqli_connect_errno())
     {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
        $con = False;
      }
    
    return $con;

}


function check_privileges($id_utente){

	if($con = connect_db()){

		$query= "SELECT Utenti.privilegio FROM Utenti WHERE id_utente=".$id_utente.";";

		$risp= mysql_query($con, $query);
		if($row = mysqli_fetch_array($risp)){
			$privilegio = $row['privilegio'];
			return $privilegio;
		}
	}
	return False;
}



function get_stats($id_utente){

	if($con = connect_db()){

		$query= "SELECT Utenti.reputation, Utenti.assiduity FROM Utenti WHERE id_utente=".$id_utente.";";
		//var_dump($query);
		$risp= mysqli_query($con, $query);
		if($row = mysqli_fetch_array($risp)){
			
			return $row;
		}
	}
	return False;
}



function update_reliability($id_utente, $id_evento, $not_num){         

	if($con = connect_db()){

		$query= "SELECT DISTINCT Utenti.reputation, Utenti.assiduity FROM (Utenti INNER JOIN Notifica ON Utenti.id_utente = Notifica.id_utente) WHERE id_evento=".$id_evento.";";

		$risp= mysql_query($con, $query);

		if($row = mysqli_fetch_array($risp)){
			
			$sum=0;
			$j=count($row['reputation']);
			
			for($i=0; $i<$j-1 ; $i++){

			$sum = $sum + (1+($row['reputation'][i] * $row['assiduity'][i]));
			
			}
			
			$reliability =	$sum / (2* $not_num);
		}
	}
	return False;
}

function set_skeptikal($id_utente, $id_evento, $time){

	if($con = connect_db()){

		$query= "SELECT id_event FROM skept WHERE (id_event=$id_evento);";

		$check= mysql_query($con, $query);
		$row = mysqli_fetch_array($check)

		if(!$row['id_event']){

			$insert= "INSERT INTO skept(id_event, id_utente, time) VALUES ($id_utente, $id_evento, $time);";
			
			$risp= mysqli_query($con, $insert);
			if($row = mysqli_fetch_array($risp)){
				
				return True;
		}
	}
	return False;
}

function increase_reputation($id_utente){

	f($con = connect_db()){

		$query= "SELECT Utenti.reputation FROM Utenti WHERE id_utente=$id_utente;";
		$risp= mysql_query($con, $query);

		if($row = mysqli_fetch_array($risp)){

			$reputation=$row['reputation']+0.1;

			if($reputation>1){

				$update="UPDATE Utenti SET reputation= 1 WHERE id_utente=$id_utente;";
			}
			else{
				$update="UPDATE Utenti SET reputation= $reputation WHERE id_utente=$id_utente;";
			}

}


function decrease_reputation($id_utente){

	f($con = connect_db()){

		$query= "SELECT Utenti.reputation FROM Utenti WHERE id_utente=$id_utente;";
		$risp= mysql_query($con, $query);

		if($row = mysqli_fetch_array($risp)){

			$reputation=$row['reputation']-0.1;

			if($reputation<(-1.0){

				$update="UPDATE Utenti SET reputation= -1 WHERE id_utente=$id_utente;";
			}
			else{
				$update="UPDATE Utenti SET reputation= $reputation WHERE id_utente=$id_utente;";
			}

}
/*
function risolvi_skeptikal($id_evento){

	$time = time();

	f($con = connect_db()){
		
		$info_query="SELECT skept.time FROM skept WHERE id_event=$id_evento;";

		$check= mysql_query($con, $query);

		if($row = mysqli_fetch_array($check)){

			$start = $row['time'];

			$query="SELECT DISTINCT Utenti.id_utente, Notifica.status_notif FROM (Utenti INNER JOIN Notifica ON Utenti.id_utente = Notifica.id_utente) WHERE id_evento=".$id_evento." AND time > $start;";

			$risp= mysql_query($con, $query);

			if($row = mysqli_fetch_array($risp)){
				$open=0;
				$closed=0;
				$j=count($row['status_notif'];

				for($i=0; $i<$j-1; $i++){

					if($row['status_notif']=="open"){
						$open++;
					}
					else{
						$closed++;
					}
				}
				if($open>$closed){
					$update="UPDATE Eventi SET status= 'open', last_time= $time WHERE id_event=$id_evento;";



				}
				elseif($open==$closed){
					$update="UPDATE Eventi SET status= 'open' WHERE id_event=$id_evento;";

				}
				else{

				}

			}


		}	
	}
	
}
*/

?>
