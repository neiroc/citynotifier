 <?php
session_start(); // Parte l'azione delle sessioni

$db = mysql_connect('localhost', 'root', 'pass'); //Accede al database
	if(!$db) { die("non riesco a connettermi: ". mysql_error()); }

mysql_select_db('utenti', $db) or die('Could not select database.'); // Compilare il nome del database a cui accedere

$username = $_POST['username'];// Prendo l'username ricevuto da jQuery
$password = $_POST['password']; // Prendo la password ricevuta da jQuery NON VAAAAA

$query = mysql_query("SELECT * FROM utenti WHERE username = 'test'"); // seleziona tutte le righe dalla tabella utenti
$rows = mysql_num_rows($query); // Ottengo il numero di righe pari a quanti utenti ci sono
//$righ = mysql_fetch_row($query);
$row = mysql_fetch_row($query);
 
if($row[1] == $username ){ // Controllo se l'username esiste, osservando se c'è la riga con username che equivale al nome utente dato
    if($row[2] == $password){ // non entra qui perche la pass non risulta..why??
        $_SESSION['username'] = $username; // Salvo la sessione dell'username
        $_SESSION['password'] = $password; // Salvo la sessione della password
        echo 1; // Chiudo il caricamento della pagina rilasciando il messaggio
    }else{
        die("Passwor errata!"); // Chiudo il caricamento della pagina rilasciando il messaggio
    }
}else{
    die("Utente non esistente"); // Chiudo il caricamento della pagina rilasciando il messaggio
}
?> 
