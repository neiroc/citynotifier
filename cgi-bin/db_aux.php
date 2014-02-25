<?php

function connect_db(){

	//$url=$SERVER;

    $con=mysqli_connect("localhost","cacaturo","cacaturo123","techweb");

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


?>
