$(document).ready(function() {
	$("#login").submit(function() {
		console.log($('#username').val());
		var url = "/cgi-bin/login.php"; // the script where you handle the form input.
		$.ajax({
			type: "POST",
			url: url,
			data: $("#login").serialize(), // serializes the form's elements.
			dataType: 'json',
			success:function(json){	
				if(json.result==="login effettuato con successo"){	
					jQuery.cookie('username', $('#username').val(), {expires:30});
					//console.log($('#username').val())
					console.log("daje")
					location.href="../mappa.html";
				}
				else {
				
					alert(json.result);
				} 		
			},
			error: function(e){
			console.log(e.message);
			},
		});
		return false; // avoid to execute the actual submit of the form.
	});					
});
