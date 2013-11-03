					$("#login").submit(function() {

									var url = "login.php"; // the script where you handle the form input.

									$.ajax({
										      type: "POST",
										      url: url,
										      data: $("#login").serialize(), // serializes the form's elements.
										      success: function(data)
										      {
										          if(data ==1) window.location="mappa.php"; // show response from the php script
															else alert(data);			
										      }
										    });

									return false; // avoid to execute the actual submit of the form.
					});
