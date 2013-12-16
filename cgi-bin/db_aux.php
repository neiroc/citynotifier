<?php

function connect_db(){

    $con=mysqli_connect("localhost","maboh","maboh123","techweb");

    // Check connection
    if (mysqli_connect_errno())
     {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
      }
    
    return $con;

}

?>
