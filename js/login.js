$(document).ready(function() {
$("#login").submit(function() {

	var url = "/login.php"; // the script where you handle the form input.
	var credenziali={'username':$("[name='username']").val(),'password':$("[name='password']").val()};

		$.ajax({
						type: "POST",
						url: url,
						data: $("#login").serialize(), // serializes the form's elements.
						dataType: 'json',
						success:function(json)
						{
							if(json.result=="OK")
							location.href="mappa.php";
							else alert(json.result);
							 		
						},
								error: function(e){
									console.log(e.message);
							},
					});

return false; // avoid to execute the actual submit of the form.
});					
});
