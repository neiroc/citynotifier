$(document).ready(function() {
	$("#login").submit(function() {
		var url = "login.php"; // the script where you handle the form input.
		$.ajax({
			type: "POST",
			url: url,
			data: $("#login").serialize(), // serializes the form's elements.
			dataType: 'json',
			success:function(json){	
				if(json.result=="OK")	
					location.href="mappa.php";
				else 
					alert(json.result); 		
			},
			error: function(e){
			console.log(e.message);
			},
		});
		//jQuery.cookie('user_id', userid, {expires:30});
		//jQuery.cookie('username', username, {expires:30});	

		return false; // avoid to execute the actual submit of the form.
	});					
});
