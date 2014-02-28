infowindow = new google.maps.InfoWindow();

$('#notifybutton').on('click', function(){
	$('#notifymenu').parent().removeClass('open');
})
//salva in subtype il valore selezionato
$('#notifySubType').on('change', function(){
	subtype=$(this).val();
})

//nasconde i subType non correlati ai Type
$('#notifyType').on('change', function(){
	type=$(this).val();
	subtype='all'
	$('#notifySubType option:nth-child(1)').attr('selected', true);

	switch ($(this).val()) {
		case 'all':
			disableOption(type);
		break;
		case 'problemi_stradali':
			disableOption(type);	
		break;
		case 'emergenze_sanitarie':
			disableOption(type);
		break;
		case 'reati':
			disableOption(type);
		break;
		case 'problemi_ambientali':
			disableOption(type);
		break;
		case 'eventi_pubblici':
			disableOption(type);
		break;
	}
});

//se clicco il tasto di geolocalizzazione nel menu notify
$('#insertLoc').on('click', function(){

	checkSearch=false;

	clearOverlays()

	//geolocalizza
	geoLocal();
})
	


//funzione che disabilita le opzioni
function disableOption(nType){
	
	switch(nType){

		case 'all':
			for(var i=2; i<=18; i++){
				$("#notifySubType option:nth-child("+ i +")").prop('disabled', true);
			}
		break;
		case 'problemi_stradali':
			for (var i=7; i<=18; i++){
				$("#notifySubType option:nth-child("+ i +")").prop('disabled', true);
			}
			//riattivo option disattivate prima
			for (var i=2; i<=6; i++){
				$("#notifySubType option:nth-child("+ i +")").prop('disabled', false);
			}
		break;
		case 'emergenze_sanitarie':
			for (var i=2; i<=18; i++){
				if (i!=7 && i!=8 && i!=9){
					$("#notifySubType option:nth-child("+ i +")").prop('disabled', true);
				}
			}
			//riattivo option disattivate prima
			for (var i=7; i<=9; i++){
				$("#notifySubType option:nth-child("+ i +")").prop('disabled', false);
			}
		break;
		case 'reati':
			for (var i=2; i<=18; i++){
				if (i!=10 && i!=11){
					$("#notifySubType option:nth-child("+ i +")").prop('disabled', true);
				}
			}
			//riattivo option disattivate prima
			for (var i=10; i<=11; i++){
				$("#notifySubType option:nth-child("+ i +")").prop('disabled', false);
			}
		break;
		case 'problemi_ambientali':
			for (var i=2; i<=18; i++){
				if (i!=12 && i!=13 && i!=14 && i!=15){
					$("#notifySubType option:nth-child("+ i +")").prop('disabled', true);
				}
			}
			//riattivo option disattivate prima
			for (var i=12; i<=15; i++){
				$("#notifySubType option:nth-child("+ i +")").prop('disabled', false);
			}
		break;
		case 'eventi_pubblici':
			for (var i=2; i<=18; i++){
				if (i!=16 && i!=17 && i!=18){
					$("#notifySubType option:nth-child("+ i +")").prop('disabled', true);
				}
			}
			//riattivo option disattivate prima
			for (var i=16; i<=18; i++){
				$("#notifySubType option:nth-child("+ i +")").prop('disabled', false);
			}
		break;
	}	
}