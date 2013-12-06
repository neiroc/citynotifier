 <?php


if(isset($_POST['username']) && isset($_POST['password']))	{
	$username = $_POST['username'];
	$password = $_POST['password'];
	$string = file_get_contents('utenti.json', 'r');
	$json_o = json_decode($string, true);
	$count = 0;  
	

	foreach($json_o['users'] as $p){
		if($p['username'] ==  $username && $password==$p['password']){
			session_start(); //Avvio sessioni
			$_SESSION["isLoggedIn"] =$p['user_id']; 
			$_SESSION["username"]=$p['username'];
			$_SESSION["password"]=$p['password'];
			$_SESSION["reputation"]=$p['reputation'];
			$_SESSION["assiduity"]=$p['assiduity'];
			$_SESSION["privilegi"]=$p['privilegi'];
			$result['result'] = "OK";	//stampa risultato json
			$re = json_encode($result);
			echo $re;
			$count = 1;
			break;
		}
	} //Controllo per ogni user

	if($count==0){
		$result['result'] = "Credenziali Errate";
		$re = json_encode($result);
		echo $re;
	}

}
else{					
	$result['result'] = "405 : ViolentMethodForbidden";
	$re = json_encode($result);
	echo $re;
}

?> 
