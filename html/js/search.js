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

//rimuove l'errore dal form del range
$('#searchRange').on('focus', function(){
	$(this).parent().removeClass("error")
})

$('#searchAddress').on('focus', function(){
	$(this).parent().removeClass("error")
})

$('#searchCity').val(cityDefault);

//salva in subtype il valore selezionato
$('#searchSubType').on('change', function(){
	subtype=$(this).val();
})

$('#searchStatus').on('change', function(){
	status=$(this).val();
})
//nasconde i subType non correlati ai Type
$('#searchType').on('change', function(){
	type=$(this).val();
	subtype='all'
	//reimposta il subType di default se viene cambiato il type
	$('#searchSubType option:nth-child(1)').attr('selected', true);

	switch ($(this).val()) {
		case 'problemi_stradali':
			disableOpt(type);	
			break;
		case 'emergenze_sanitarie':
			disableOpt(type);
			break;
		case 'reati':
			disableOpt(type);
			break;
		case 'problemi_ambientali':
			disableOpt(type);
			break;
		case 'eventi_pubblici':
			disableOpt(type);
			break;
	}
});

//funzione ricerca indirizzo
function codeAddress() {
	var address = $('#searchAddress').val()+", "+ $('#searchCity').val();

	geocoder.geocode( { 'address': address}, function(results, status) {
	  	if (status == google.maps.GeocoderStatus.OK) {
	  		
			if (results[0].geometry.location.lat() != cityCenter.lat() && results[0].geometry.location.lng() != cityCenter.lng()){

				checkRange(results[0].geometry.location);
						
				//scrive nel menu notify l'indirizzo cercato nel menu search (serve?)
				$('#notifyAddress').val(address);
			}
			else errorAlert("Indirizzo non valido")
		}
		else {
			$('#searchAddress').parent().addClass("error")
			$('#searchAddress').val("Insert a valid address");
			errorAlert('Cannot find address');
		}
	});
}

//funzione che disabilita le opzioni
function disableOpt(nType){
	switch(nType){
	case 'problemi_stradali':
		for (var i=7; i<=18; i++){
			$("#searchSubType option:nth-child("+ i +")").prop('disabled', true);
		}
		//riattivo option disattivate prima
		for (var i=2; i<=6; i++){
			$("#searchSubType option:nth-child("+ i +")").prop('disabled', false);
		}
	break;
	case 'emergenze_sanitarie':
		for (var i=2; i<=18; i++){
			if (i!=7 && i!=8 && i!=9){
				$("#searchSubType option:nth-child("+ i +")").prop('disabled', true);
			}
		}
		//riattivo option disattivate prima
		for (var i=7; i<=9; i++){
			$("#searchSubType option:nth-child("+ i +")").prop('disabled', false);
		}
	break;
	case 'reati':
		for (var i=2; i<=18; i++){
			if (i!=10 && i!=11){
				$("#searchSubType option:nth-child("+ i +")").prop('disabled', true);
			}
		}
		//riattivo option disattivate prima
		for (var i=10; i<=11; i++){
			$("#searchSubType option:nth-child("+ i +")").prop('disabled', false);
		}
	break;
	case 'problemi_ambientali':
		for (var i=2; i<=18; i++){
			if (i!=12 && i!=13 && i!=14 && i!=15){
				$("#searchSubType option:nth-child("+ i +")").prop('disabled', true);
			}
		}
		//riattivo option disattivate prima
		for (var i=12; i<=15; i++){
			$("#searchSubType option:nth-child("+ i +")").prop('disabled', false);
		}
	break;
	case 'eventi_pubblici':
		for (var i=2; i<=18; i++){
			if (i!=16 && i!=17 && i!=18){
				$("#searchSubType option:nth-child("+ i +")").prop('disabled', true);
			}
		}
		//riattivo option disattivate prima
		for (var i=16; i<=18; i++){
			$("#searchSubType option:nth-child("+ i +")").prop('disabled', false);
		}
	break;
	}	
}
/**
 * Radius changing listener on enter pressed
 */
$("#search").next().on('keypress', '#searchRange', function(e) {

	var code = e.keyCode || e.which;

	if (code === 13){
    	var klm = $('#searchRange').val().split(" ")[0].replace(',','.');
    	//valore inserito correttamente
		if(jQuery.isNumeric(klm) && klm > 0) {
			radius = klm;
    	    radiusWidget.set('distance', klm);
    	    radiusWidget.center_changed();
			$('#searchRange').val(klm +" km")
    	}
    	else if(!(jQuery.isNumeric(klm)) || klm <= 0){
    		//raggio errato
			$('#searchRange').parent().addClass("error")
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
	if (radiusWidgetCheck===false && marker){
		distanceWidget = new DistanceWidget(map, myP);
		radiusWidgetCheck = true;
	}
});


function checkRange(results){
	
	getMarker(results);

	//prendo il valore dal form del range
	range = $('#searchRange').val().split(" ")[0].replace(',','.');
	//console.log(range);
	if(range.length === 0) {
		console.log(range)
		console.log("porcodio")
		if (radius){
			range = radius
		}	
		else{
			range = RADIUS;
		}
		//crea il cerchio
		distanceWidget = new DistanceWidget(map, results);
		radiusWidgetCheck = true;		
		
		//setta il raggio del cerchio			
		radiusWidget.set('distance', range);
		radiusWidget.center_changed();
		
		$('#searchRange').val(range + " km ");					
	}
	else if(jQuery.isNumeric(range) && range > 0){

		//crea il cerchio
		distanceWidget = new DistanceWidget(map, results);
		radiusWidgetCheck = true;
		
		//setta il raggio del cerchio			
		radiusWidget.set('distance', range);
		radiusWidget.center_changed();
	}
	//se non è stato specificato alcun valore, prendo quello del cookie altrimenti quello di default
	else if(range<=0){
		
		radiusWidgetCheck = false;
		$('#searchRange').parent().addClass("error")
		$('#searchRange').val("Insert a valid radius");
	}
}

