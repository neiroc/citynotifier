var lastLatitude;
var lastLongitude;
var geocoder;

$(document).ready(function(){

	geocoder = new google.maps.Geocoder();
	var mapOptions = {
	  		center: cityCenter,
	  		zoom: 14,
	  		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("gmap"), mapOptions);

	
	//funzione di geolocalizzazione
	geoLocal();
	//riceve l'evento se mi sposto sulla mappa
	google.maps.event.addListener(map, 'click', function(event) {
		//salva le coordinate della mia nuova posizione
		lastLatitude = event.latLng.lat();
    lastLongitude = event.latLng.lng();
		//cancella cookie default
		jQuery.removeCookie('centerLatitude');
		jQuery.removeCookie('centerLongitude');
		//cancella cookie geolocalizzazione
		jQuery.removeCookie('latitude');
		jQuery.removeCookie('longitude');
		//crea i cookie
		jQuery.cookie('lastLatitude', lastLatitude, {expires:30});	
		jQuery.cookie('lastLongitude', lastLongitude, {expires:30});
		//mette il marker
		var markerPosition = new google.maps.LatLng(lastLatitude, lastLongitude);
		getMarker(markerPosition);
		getCircle(markerPosition);
		
	});

});
$('.dropdown-toggle').dropdown()
$('#myModal').on('show.bs.modal', function(){
	
});


function showOnMap(lat,lng,id,type){
		
		var myLatlng = new google.maps.LatLng(lat,lng);
		// Place a marker on the map
		var marker = new google.maps.Marker({
				position: myLatlng,
				map: map,
				draggable:false,
				title:id
				//animation: google.maps.Animation.BOUNCE
		});

var contentString = '<b>'+type+'</b>'+ '<br>'+id+'<br>'+'<p>Descrizione di evento, quel pezzo di merda mi ha tagliato la strada </p>';
var infowindow = new google.maps.InfoWindow({
    content: contentString,
		maxWidth: 200
});

google.maps.event.addListener(marker, 'click', function() {
  infowindow.open(map,marker);
});
}

$("#searchbutton").click(function(e){
	//prendo tipo
	var type = $('#searchType').val();
	//prendo sottotipo
	var subtype = $('#searchSubType').val();
	//prendo stato 
	var status = $('#searchStatus').val();
	//prendo data (devo convertirla in unixtime
	var data = $('#datepickerid').val();
	//prendo le coordinate.ATTENZIONE: assumono valori solo dopo aver cliccato sulla mappa. vedere geolocal.
	if(lastLatitude == undefined){ 
	var lat = latitude;
	var lng = longitude;
	}else
	{ 
	var lat = lastLatitude;
	var lng = lastLongitude;
	}
	
	//prendo raggio di ricerca
	var radius = $('#searchRange').val();
	//trasformo data in unixtme. ATTENZIONE: settare fuso orario corretto
	var unixdata = new Date(data).getTime() / 1000;	
	var oggi = Math.round((new Date()).getTime() / 1000);
	console.log(lat);
	console.log(lng);

	var url = "richieste?scope=local&type="+ type + "&subtype="+ subtype + "&lat="+ lat + "&lng="+ lng+"&radius=" + radius +"&timemin="+ unixdata + "&timemax="+ oggi + "&status="+status;

				$.ajax({
					url: url,
					type: 'GET',
					data: $(this).serialize(),
					dataType:'json',
					success: function(data){
									//for each event add a Marker
									$(data.events).each(function(i, src) {
									showOnMap(src.locations[0].lat,src.locations[0].lng,src.event_id,src.type.type);
												});
					console.log(data);
									} //chiudi function data
					});//fine chiamata ajax

});

