$('#logout').on('click', function(){
	//xml= new XMLHttpRequest();

	//$.ajax({
		//url:url,
		//method:'POST',
		//data: null,
		//success:function(json){	
			//if(json.result=="OK")	
				location.href="index.html";
			//else 
				//alert(json.result); 		
		//},
		//error: function(e){
			//console.log(e.message);
		//},
	//});
		jQuery.removeCookie('user_id');
		jQuery.removeCookie('username');
		//return false; // avoid to execute the actual submit of the form.
});					

