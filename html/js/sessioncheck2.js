$('document').ready(function(){
	
	if (jQuery.cookie('username')){
		cookieuser=jQuery.cookie('username');
		lastLatitude=jQuery.cookie('lastLatitude');
		lastLongitude=jQuery.cookie('lastLongitude');
		latitude=jQuery.cookie('latitude');
		longitude=jQuery.cookie('longitude');
		radius=jQuery.cookie('radius');
		status=jQuery.cookie('status');
		data=jQuery.cookie('data');
	}
});
