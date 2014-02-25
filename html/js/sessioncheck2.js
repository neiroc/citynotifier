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
		type=jQuery.cookie('type');	
		subtype=jQuery.cookie('subtype');
	};
		console.log(status)
		console.log(type)
		if(!type)
			type='all';

		if(!subtype){
			subtype='all';
			status='all'
		}
		//setta i valori dei menu (notify)
		$('#notifyType').val('none');
		$('#notifySubType').val('none');
		disableOption(type);
		
		//setta i valori dei menu (search)
		$('#searchType').val(type);
		$('#searchSubType').val(subtype);
		$('#searchStatus').val(status);
		disableOpt(type);
	
	
});