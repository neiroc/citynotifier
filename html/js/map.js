//GLOBAL VARIABLES
var lastLatitude;
var lastLongitude;
var geocoder;
var markersArray = [];
var id_count;
var tabella;
var infowindow = null;
var checkSearch;
var upUs;
var rep;


$(document).ready(function(){

	upUser();
	upRep();

	geocoder = new google.maps.Geocoder();
	var mapOptions = {
	 	center: cityCenter,
	  	zoom: 14,
	  	mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("gmap"), mapOptions);
	
	checkSearch=true;
	
	//se esistono i cookie
	if (lastLatitude && lastLongitude){
		//mi rimetti nell'ultima posizione disponibile
		alternLoc();
	}
	else{
		//funzione di geolocalizzazione
		geoLocal();
	}

	//riceve l'evento se mi sposto sulla mappa
	google.maps.event.addListener(map, 'click', function(event) {
		
		//salva le coordinate della mia nuova posizione
		lastLatitude = event.latLng.lat();
    	lastLongitude = event.latLng.lng();
				
		myPosition = new google.maps.LatLng(lastLatitude, lastLongitude);
		
		//converto il punto cliccato in indirizzo leggibile e lo inserisco nel form		
		geocodePosition(myPosition);
		
		radiusWidgetCheck=false;
		//mette il marker
		getMarker(myPosition);
	});

});//END DOCUMENT READY!

$('.dropdown-toggle').dropdown()

//INSERISCI DATI NELLA TABELLA
$('#table').on('click', function(){

//MOSTRA TABELLA
	$('#myModal').modal({
		backdrop:false
		}).on('show', function(){ 
		//something
    });
});

//aggiorna l'user in navbar
function upUser(){
	upUs="User: "+ jQuery.cookie('username');
	$('#navuser1').html(upUs + '<span class="glyphicon glyphicon-user"></span>');
}

//aggiorna la reputazine nel menu utente
function upRep(){
	if (!rep)
		rep=jQuery.cookie('reputation');

	$('.badge-success').html(rep)
}

/*Crea marker sulla mappa per ogni evento ricevuto dalla richiesta */
function showOnMap(lat,lng,id,type,subtype,status,rel,inizio,ultima,descr){

	//Nuovo oggetto Infowindow
	infowindow = new google.maps.InfoWindow;

	var data_inizio = timeConverter(inizio);
	var data_fine = timeConverter(ultima);

	var myLatlng = new google.maps.LatLng(lat,lng);

	// Place a marker on the map
	var marker = new google.maps.Marker({
		position: myLatlng,
		icon: getPin(type, subtype, status),
		map: map,
		draggable:false,
		title:id
	});

	//push marker in array
	markersArray.push(marker);
	
	var pos = marker.getPosition();

	var circle_event = new google.maps.Circle({
		center: pos,
		map:map,
		radius:0,
		strokeOpacity:0.8,
		strokeWeight: 0,
		fillColor: "#F86F05",
	});

	google.maps.event.addListener(marker, 'mouseover', function() {
		var area = calculateEventArea(type,subtype); //area di aggregamento
		circle_event.setRadius(area);
	});
		
   google.maps.event.addListener(marker, 'mouseout', function() {
		circle_event.setRadius(0);
	});

		
	google.maps.event.addListener(marker, 'click', function() {
		//CONTENT INFOWINDOW
		if(status == 'closed'){
			var contentString = '<div id="info"><h1>Dettagli Evento</h1><b>ID : </b>'+id+'<br><b>Tipo: </b>'+type+'<br><b>Sottotipo: </b>'+subtype+'<br><b>Stato: </b><span class="label label-danger">'+status+'</span>&nbsp&nbsp<b>Affidabilità :</b> '+rel+'<br><b>Inizio :</b>'+data_inizio+'<br><b>Ultima :</b>'+data_fine+'<br><b>Descrizioni :</b><br><textarea readonly id="descr">'+descr+'</textarea><br><b>Notifica :</b><br><textarea id="notif"></textarea><br><button type="button" class="btn btn-default btn-sm" style="background-color:green; color:white;"  onclick=\"notify(\''+id+'\',\'open\',\''+lat+'\',\''+lng+'\',\''+type+'\',\''+subtype+'\')\"><span class="glyphicon glyphicon-play-circle"></span> Apri</button><button type="button" class="btn btn-default btn-sm" style="background-color:red; color:white;"  onclick=\"notify(\''+id+'\',\'closed\',\''+lat+'\',\''+lng+'\',\''+type+'\',\''+subtype+'\')\"><span class="glyphicon glyphicon-off"></span>Chiudi</button></div>';
		}
		else if(status == 'open'){
				var contentString = '<div id="info"><h1>Dettagli Evento</h1><b>ID : </b>'+id+'<br><b>Tipo: </b>'+type+'<br><b>Sottotipo: </b>'+subtype+'<br><b>Stato: </b><span class="label label-success">'+status+'</span><br><b>Inizio :</b>'+data_inizio+'<br><b>Ultima :</b>'+data_fine+'<br><b>Descrizioni :</b><br><textarea readonly id="descr">'+descr+'</textarea><br><b>Notifica :</b><br><textarea id="notif"></textarea><br><button type="button" class="btn btn-default btn-sm" style="background-color:green; color:white;"  onclick=\"notify(\''+id+'\',\'open\',\''+lat+'\',\''+lng+'\',\''+type+'\',\''+subtype+'\')\"><span class="glyphicon glyphicon-play-circle"></span> Apri</button><button type="button" class="btn btn-default btn-sm" style="background-color:red; color:white;"  onclick=\"notify(\''+id+'\',\'closed\',\''+lat+'\',\''+lng+'\',\''+type+'\',\''+subtype+'\')\"><span class="glyphicon glyphicon-off"></span>Chiudi</button></div>';
		}
		else var contentString = '<div id="info"><h1>Dettagli Evento</h1><b>ID : </b>'+id+'<br><b>Tipo: </b>'+type+'<br><b>Sottotipo: </b>'+subtype+'<br><b>Stato: </b><span class="label label-warning">'+status+'</span><br><b>Inizio :</b>'+data_inizio+'<br><b>Ultima :</b>'+data_fine+'<br><b>Descrizioni :</b><br><textarea readonly id="descr">'+descr+'</textarea><br><b>Notifica :</b><br><textarea id="notif"></textarea><br><button type="button" class="btn btn-default btn-sm" style="background-color:green; color:white;"  onclick=\"notify(\''+id+'\',\'open\',\''+lat+'\',\''+lng+'\',\''+type+'\',\''+subtype+'\')\"><span class="glyphicon glyphicon-play-circle"></span> Apri</button><button type="button" class="btn btn-default btn-sm" style="background-color:red; color:white;"  onclick=\"notify(\''+id+'\',\'closed\',\''+lat+'\',\''+lng+'\',\''+type+'\',\''+subtype+'\')\"><span class="glyphicon glyphicon-off"></span>Chiudi</button></div>';
			infowindow.setContent(contentString);
			infowindow.open(map,marker);
		});

		google.maps.event.addListener(map, 'click', function() {
			infowindow.close();
	});
}


/*
* Show Events on Table
*/
function showOnTable(event_id,subtype,type,freshness,status,descr,lat,lng){
	freshness = timeConverter(freshness);
	//MakeTable	
	tabella[0].innerHTML +="<td>"+event_id+"</td><td>"+type+" /<br>"+subtype+"</td><td id=\"tableEventAddress"+id_count+"\"><img align=\"center\" src=\"img/load2.gif\"></td><td>"+freshness+"</td><td>"+status+"</td><td><div class=\"btn-group\"><button class=\"btn btn-primary\">Mostra</button><button class=\"btn btn-primary dropdown-toggle\" data-toggle=\"dropdown\"><span class=\"caret\"></span></button><ul class=\"dropdown-menu\"><h5 class=\"muted\">"+descr+"</div></h5></ul></div></td>";
}



/*
* OnClick start request 
*/
$("#searchbutton").click(function(e){
	//chiudo il dropdown
	$('#searchmenu').parent().removeClass('open');
	//chiamo la funzione di ricerca
	search();
});


//Remove Markers from Map
function clearOverlays() {
	for (var i = 0; i < markersArray.length; i++ ) {
    	markersArray[i].setMap(null);
  	}
  	markersArray.length = 0;
}

//in caso di chiusura browser senza logout, salva i cookie per il prossimo accesso
$(window).unload(function(){

	if (jQuery.cookie('session_user')){
		jQuery.cookie('lastLatitude', lastLatitude, {expires:30});	
		jQuery.cookie('lastLongitude', lastLongitude, {expires:30});
		jQuery.cookie('latitude', latitude, {expires:30});	
		jQuery.cookie('longitude', longitude, {expires:30});		
		jQuery.cookie('radius', radius, {expires:30});
		jQuery.cookie('type', type, {expires:30});	
		jQuery.cookie('subtype', subtype, {expires:30});
		jQuery.cookie('status', status, {expires:30});
		jQuery.cookie('data', data, {expires:30});
	}
});

/*
* Convert UnixTime to Date
*/
function timeConverter(UNIX_timestamp){
 var a = new Date(UNIX_timestamp*1000);
 var months = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Aug','Set','Ott','Nov','Dic'];
     var year = a.getFullYear();
     var month = months[a.getMonth()];
     var date = a.getDate();
     var hour = a.getHours();
     var min = a.getMinutes();
     var sec = a.getSeconds();
     var time = date+' '+month+' '+year+'<br> ore: '+hour+':'+min+':'+sec ;
     return time;
 }
 
 /**
 * Get Pin Event
 */
function getPin(type, subtype, status){
    var mDir = "/img/pins/";
    switch (type){
        case"problemi_stradali" :
            switch(subtype){
                case "incidente": mDir = mDir+"car_accident"; break;
                case "buca": mDir = mDir+"buca"; break;
                case "coda": mDir = mDir+"coda"; break;
                case "lavori_in_corso": mDir = mDir+"lavoriincorso"; break;
                case "strada_impraticabile": mDir = mDir+"stradanonpercorribile"; break;
            }
            break;
        
        case "emergenze_sanitarie" :
            switch(subtype){
                case "incidente": mDir = mDir+"incidente"; break;
                case "malore": mDir = mDir+"malore"; break;
                case "ferito": mDir = mDir+"ferito"; break;
                }
            break;
        
        case "reati" :
            switch(subtype){
                case "furto": mDir = mDir+"thief"; break;
                case "attentato": mDir = mDir+"shooting"; break;
            }
            break;
            
        case "problemi_ambientali" :
            switch(subtype){
                case "incendio" : mDir = mDir+"fire"; break;
                case "tornado" : mDir = mDir+"tornado"; break;
                case "neve" : mDir = mDir+"snow"; break;
                case "alluvione" : mDir = mDir+"rain"; break;
            }
            break;
        case "eventi_pubblici" :
            switch(subtype){
                case "partita" : mDir = mDir+"football"; break;
                case "manifestazione" : mDir = mDir+"manifestazione"; break;
                case "concerto" : mDir = mDir+"livemusic"; break;
                }
            break;
        break;
    }
    
    switch (status){
        case "open" : return mDir + "Open.png";
        case "closed" : return mDir + "Closed.png"
        case "skeptical" : return mDir + ".png";
    }
}//#########################################################################################################

//###################################################################################################################################
//funzione che effettua la ricerca
function search() {
	
	clearOverlays();
	//prendo tipo
	type = $('#searchType').val();
	//prendo sottotipo
	subtype = $('#searchSubType').val();
	//prendo stato 
	status = $('#searchStatus').val();
	//prendo data (devo convertirla in unixtime
	data = $('#datepickerid').val();
	
	id_count=0;
	tabella = $("#tabella");
	tabella.html("<thead><tr><th>ID</th><th>Tipo/Sottotipo</th><th>Luogo</th><th>Data/Freschezza</th><th>Stato</th><th>Descrizione</th></tr></thead>");
	
	
	//prendo le coordinate.	
	var lat = lastLatitude;
	var lng = lastLongitude;

	//prendo raggio di ricerca
	radius = radiusWidget.get('distance')*1000;
	//trasformo data in unixtime
   var unixdata = data_converter(data) + 3600;
   var now = Math.round((new Date()).getTime() / 1000 + 3600); 


	var url = "richieste?scope=local&type="+ type + "&subtype="+ subtype + "&lat="+ lat + "&lng="+ lng+"&radius=" + radius +"&timemin="+ unixdata + "&timemax="+ now + "&status="+status;
  
	$.ajax({
		url: url,
		type: 'GET',
		data: $(this).serialize(),
		dataType:'json',
		success: function(data){
			//for each event add a Marker 
			$(data.events).each(function(i, src) {
				if(src.locations.length){//aggiungo un controllo. alcuni server mandano eventi senza locations!!
				//mid point
				media = average(data.events[i]);
				showOnMap(media.lat,media.lng,src.event_id,src.type.type,src.type.subtype,src.status,src.reliability,src.start_time,src.freshness,src.description);
				showOnTable(src.event_id,src.type.subtype,src.type.type,src.freshness,src.status,src.description,src.locations[0].lat,src.locations[0].lng);
		      id_count++;
		      }
			});
			//console.log(data);
			//console.log(markersArray[0]);
			//console.log(data.events);
			//if(data.events.length != 0)// setTableAddress(data.events, 0, data.events.length - 1, 0, 0);
			
		
		} //chiudi function data
	});//fine chiamata ajax
	radius = radius / 1000;

	window.setTimeout("search();", 6000000);
}

//Setta gli indirizzi degli eventi in tabella ricorsivamente
function setTableAddress(events, actual, last, timeout, table_count) {
	
	geocoder = new google.maps.Geocoder();
	
	var llat, llng;

	llat = events[actual].locations[0].lat; 
	llng = events[actual].locations[0].lng;
	//console.log(llat);
	//console.log(llng);


	var LatLng = new google.maps.LatLng(llat, llng);
	
	geocoder.geocode({'latLng': LatLng}, function(results, status) {
    		if (status == google.maps.GeocoderStatus.OK) {		
			if (results[0]) {
		
				res = results[0].address_components[1].long_name + " n." +
				      results[0].address_components[0].long_name + ",<br> " +
				      results[0].address_components[2].long_name;
			}
			else res = "Indirizzo non trovato.";
		}
		else { 
			if ( (timeout < 16) && status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
				setTimeout(function(){ setTableAddress(events, actual, last, (timeout+1), table_count); }, 425);
				return;
			}
			else {
				/*
				var ih = $("#tableEventAddress" + (actual + table_count)).html();
				if (ih == "<img src=\"img/load2.gif\">") res = "Ricerca indirizzo fallita. Causa: " + status;
				else res = ih;*/
				console.log("errore");
			}		
		}
		 //console.log(res);
		$("#tableEventAddress" + (actual + table_count)).html(res);
		if (actual < last) setTimeout(function(){ setTableAddress(events, actual+1, last, 0, table_count); }, 450);
	});
}

//funzione di conversione date to timestamp
function data_converter(strDate) {
	var dateParts = strDate.split(" ");
	var newDate = dateParts[1] + "/" + dateParts[0] + "/" + dateParts[2];
	var date = parseInt((new Date(newDate)).getTime()) / 1000; //secondi
	return date;
}

