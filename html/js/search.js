var radius;
var type;
var subtype;
var status;
var data;
//formato calendario
$('.datepicker').datepicker({
	format: "dd mm yyyy"
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

	//reimposta il subType di default se viene cambiato il type
	$('#searchSubType option:nth-child(1)').attr('selected', true);

	switch ($(this).val()) {
		case 'problemi_stradali':
			disableOpt(1);	
			break;
		case 'emergenze_sanitarie':
			disableOpt(2);
			break;
		case 'reati':
			disableOpt(3);
			break;
		case 'problemi_ambientali':
			disableOpt(4);
			break;
		case 'eventi_pubblici':
			disableOpt(5);
			break;
	}
});

//funzione ricerca indirizzo
function codeAddress() {
	var address = $('#searchAddress').val();
	geocoder.geocode( { 'address': address}, function(results, status) {
	  	if (status == google.maps.GeocoderStatus.OK) {
			range = $('#searchRange').val().split(" ")[0].replace(',','.');
			if(jQuery.isNumeric(range) && range > 0){
				
				//crea il cerchio
				distanceWidget = new DistanceWidget(map, results[0].geometry.location);
				radiusWidgetCheck = true
				
				//setta il raggio del cerchio			
				radiusWidget.set('distance', range);
				radiusWidget.center_changed();
			}
			else {
				//se non è stato specificato alcun valore, prendo quello del cookie
				if (jQuery.cookie('radius')){
					range= jQuery.cookie('radius')
				}
				//altrimenti quello di default
				else {
					range=RADIUS;					
				}
				$('#searchRange').val(range + " km ");

				//crea il cerchio
				var distanceWidget = new DistanceWidget(map, results[0].geometry.location);
				radiusWidgetCheck = true;
				
				//setta il raggio del cerchio			
				radiusWidget.set('distance', range);
				radiusWidget.center_changed();
			}
			
			//scrive nel menu notify l'indirizzo cercato nel menu search (serve?)
			$('#notifyAddress').val($('#searchAddress').val());
			
		}
		else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
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


/**
 * Radius changing listener on enter pressed
 */
$("#search").next().on('keypress', '#searchRange', function(e) {
	
if (e.which === 13){
    	var klm = $('#searchRange').val().split(" ")[0].replace(',','.');
    	//valore inserito correttamente
		if(jQuery.isNumeric(klm) && klm > 0) {
			radius = klm;
    	    radiusWidget.set('distance', klm);
    	    radiusWidget.center_changed();
    	    $('#searchRange').parent().removeClass("error");
    	}
    	else if(!(jQuery.isNumeric(klm)) || klm <= 0){
    		//raggio errato
			$('#searchRange').parent().addClass("error");
			$('#searchRange').val("Insert a valid radius");
		}
	}	
});

$('#search').on('click', function(){

	//crea la posizione del marker
	myP = new google.maps.LatLng(lastLatitude, lastLongitude);
	//Crea un marker se non è presente sulla mappa
	if (!marker){
		
		//crea il marker
		getMarker(myP)

		//crea un nuovo cerchio
		distanceWidget = new DistanceWidget(map, myP)
		radiusWidgetCheck = true;
	}
	//Crea il cerchio se il marker è già presente
	if (radiusWidgetCheck==false && marker){

		distanceWidget = new DistanceWidget(map, myP);
		radiusWidgetCheck = true;
			
	}
})

