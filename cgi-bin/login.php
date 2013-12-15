 <?php

require 'db_aux.php';

//recupero il file json contenente le credenziali di login e lo decodifico
$data = file_get_contents("php://input");
$login=json_decode($data);

//NOTA: CONTROLLARE IL FLUSSO 
if(($login->{'username'} != Null)&&($login->{'password'} != Null)){
	
	$username = $login->{'username'};
	$password = $login->{'password'};

}
	
//connessione con il db
$con=connect_db();
	
//interrogo il db e controllo se i dati di accesso corrispondono		
$query="SELECT id_utente,username,user_pass FROM Utenti where username='".$username."' AND user_pass='".$password."';";
	
$risposta = mysqli_query($con,$query);
		
if(($row = mysqli_fetch_array($risposta))&&($row['username']==$username)&&($row['user_pass']==$password)){
						
	$result['result'] = "login effettuato con successo";//risposta positiva
	header('Content-Type: application/json');	
	$re = json_encode($result);
	echo $re;
                           
}


else{
            
	$result['result'] = "Credenziali Errate";//risposta negativa
	$re = json_encode($result);
	echo $re;

}
   
//chiudo la connessione con il db server	
mysqli_close($con);

?> 
