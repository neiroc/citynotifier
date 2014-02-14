$('document').ready(function(){
	
	if (jQuery.cookie('username')){
		cookieuser=jQuery.cookie('username');
		cookielstlat=jQuery.cookie('lastLatitude');
		cookielstlng=jQuery.cookie('lastLongitude');
		cookielat=jQuery.cookie('latitude');
		cookielng=jQuery.cookie('longitude');
		radius=jQuery.cookie('radius');
		cookiestatus=jQuery.cookie('status');
		cookiedata=jQuery.cookie('data');
	}
});
