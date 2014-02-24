<?php

function connect_db(){

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

function check_stats($id_utente){

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


?>
