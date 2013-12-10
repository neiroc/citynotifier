 <?php

require 'db_aux.php';

//controllo che i campi siano stati inseriti correttamente

//NOTA: CONTROLLARE IL FLUSSO 
//if(isset($_POST['json'])){
	var_dump($_POST);
	$login=json_decode($_POST['json']);
	//echo $login->page;
	$username = $login['username'];
	$password = $login['password'];
	//console.log($username);
	//console.log($password);
//}
	echo $username;
	echo $password;
//connessione con il db
$con=connect_db();
    
//interrogo il db e controllo se i dati di accesso corrispondono
    
$query="SELECT id_utente,username,user_pass FROM Utenti where username='".$username."' AND user_pass='".$password."';";
    
$risposta = mysqli_query($con,$query);
    
if(($row = mysqli_fetch_array($risposta))&&($row['username']==$username)&&($row['user_pass']==$password)){
                    
    $result['result'] = "login effettuato con successo";	
    $re = json_encode($result);
	echo $re;
                           
}
else{
            
	$result['result'] = "Credenziali Errate";
	$re = json_encode($result);
	echo $re;

}
   
//chiudo la connessione con il db server	
mysqli_close($con);

?> 
