$(document).ready(function() {
	$("#login").submit(function() {
		console.log($('#username').val())
		var url = "login.php"; // the script where you handle the form input.
		$.ajax({
			type: "POST",
			url: url,
			data: $("#login").serialize(), // serializes the form's elements.
			dataType: 'json',
			success:function(json){	
				if(json.result=="OK"){	
					jQuery.cookie('username', $('#username').val(), {expires:30});
					//console.log($('#username').val())
					location.href="mappa.php";
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
