<?php
session_start(); 
// verifico che esista la sessione di autenticazione
if (empty($_SESSION['username'])) {
  echo "Non hai il permesso di accedere all'area privata";
  exit;
}



// gestisco la richiesta di logout
if (isset($_GET['logout'])) {
  session_destroy();
  echo "Sei uscito con successo";
  exit;
}
?>
<html>
<head>
<title>Area privata</title>
</head>
<body>
<!-- CONTENUTO AREA PRIVATA -->
BENVENUTO CARO PIEZZ E MERD
</body>
</html>
