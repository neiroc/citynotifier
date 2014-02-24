<?php

//aggiungere controlli (?)

$result['result'] = "logout effettuato con successo";
header('Content-Type: application/json; charset=utf-8');	
$re = json_encode($result);
echo $re;
 

?>
