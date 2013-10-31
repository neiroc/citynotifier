/*setta il tasto invio per il login*/

$('#slick-login').keydown(function(e){
    if(e.which === 13){ //Enter key
        $('#login_button').click();
    }
});

/*effettua il post al server che controlla la correttezza dei parametri*/

function login_send(var1, var2) {
   alert("provs2");

}
