<?php

//aggiungere controlli (?)

$result['result'] = "logout effettuato con successo";
header('Content-Type: application/json');	
$re = json_encode($result);
echo $re;
 

?>
