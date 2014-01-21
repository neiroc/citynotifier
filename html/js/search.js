//formato calendario
$('.datepicker').datepicker({
	format: "dd MM yyyy"
});

//mantiene il dropdown aperto pur cliccando sul calendario
$(document).on('click', '.day, .month, .year, .dow, .datepicker-switch, .next, .prev', function (e) {
    e.stopPropagation();
});

//Chiude calendario quando si clicca sul giorno
$(document).on('click','.day', function(){
	$('.datepicker-dropdown').fadeOut();
});

//ricerca indirizzo specoficato nel form
$('#searchLoc').on('click', function(){
	codeAddress();
});

//nasconde i subType non correlati ai Type
$('#searchType').on('change', function(){

	$('#searchSubType option:nth-child(1)').attr('selected', true);

	switch ($(this).val()) {
		case 'Problemi stradali':
				disableOpt(1);	
			break;
		case 'Emergenze sanitarie':
			disableOpt(2);
			break;
		case 'Reati':
			disableOpt(3);
			break;
		case 'Problemi ambientali':
			disableOpt(4);
			break;
		case 'Eventi pubblici':
			disableOpt(5);
			break;
	}
});

//funzione ricerca indirizzo
function codeAddress() {
	var address = $('#searchAddress').val();
	geocoder.geocode( { 'address': address}, function(results, status) {
	  	if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
		  	getMarker(results[0].geometry.location);
		} 
		else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
		getCircle(results[0].geometry.location);
	});
}

//funzione che disabilita le opzioni
function disableOpt(nType){
	switch(nType){
	case 1:
		for (var i=8; i<=19; i++){
			$("#searchSubType option:nth-child("+ i +")").prop('disabled', true);
		}
		//riattivo option disattivate prima
		for (var i=3; i<=7; i++){
			$("#searchSubType option:nth-child("+ i +")").prop('disabled', false);
		}
	break;
	case 2:
		for (var i=3; i<=19; i++){
			if (i!=8 && i!=9 && i!=10){
				$("#searchSubType option:nth-child("+ i +")").prop('disabled', true);
			}
		}
		//riattivo option disattivate prima
		for (var i=8; i<=10; i++){
			$("#searchSubType option:nth-child("+ i +")").prop('disabled', false);
		}
	break;
	case 3:
		for (var i=3; i<=19; i++){
			if (i!=11 && i!=12){
				$("#searchSubType option:nth-child("+ i +")").prop('disabled', true);
			}
		}
		//riattivo option disattivate prima
		for (var i=11; i<=12; i++){
			$("#searchSubType option:nth-child("+ i +")").prop('disabled', false);
		}
	break;
	case 4:
		for (var i=3; i<=19; i++){
			if (i!=13 && i!=14 && i!=15 && i!=16){
				$("#searchSubType option:nth-child("+ i +")").prop('disabled', true);
			}
		}
		//riattivo option disattivate prima
		for (var i=13; i<=16; i++){
			$("#searchSubType option:nth-child("+ i +")").prop('disabled', false);
		}
	break;
	case 5:
		for (var i=3; i<=19; i++){
			if (i!=17 && i!=18 && i!=19){
				$("#searchSubType option:nth-child("+ i +")").prop('disabled', true);
			}
		}
		//riattivo option disattivate prima
		for (var i=17; i<=19; i++){
			$("#searchSubType option:nth-child("+ i +")").prop('disabled', false);
		}
	break;
	}	
}
