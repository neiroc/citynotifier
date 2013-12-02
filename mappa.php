<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="ico/favicon.png">





    <title>City Notifier - Mappa</title>

    <!-- Bootstrap core CSS -->
    <link href="css/bootstrap.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="css/starter-template.css" rel="stylesheet">

    <!-- Just for debugging purposes. Don't actually copy this line! -->
    <!--[if lt IE 9]><script src="../../docs-assets/js/ie8-responsive-file-warning.js"></script><![endif]-->

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
    <![endif]-->
  </head>

	<body>

    <div class="navbar navbar-inverse navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">City Notifier</a>
        </div>
        <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li id="bar_username" class="active"><a href="#">Home</a></li>
            <li><a href="#mappa">Map</a></li>
            <li><a id="table" href="#myModal" role="button" data-toggle="modal">
					Table
				</a>
			</li>
			<li class="dropdown">
				<a id="search" role="button" data-toggle="dropdown" href="#" >Search
					<b class="caret"></b>
				</a>
				<ul id="menu3" class="dropdown-menu" role="menu" aria-labelledby="drop6">
            <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Action</a></li>
            <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Another action</a></li>
            <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Something else here</a></li>
            <li role="presentation" class="divider"></li>
            <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Separated link</a></li>
          </ul>
			</li>
			<li class="dropdown">
				<a id="notify" role="button" data-toggle="dropdown" href="#" >Notify
					<b class="caret"></b>
				</a>
				<ul id="menu3" class="dropdown-menu" role="menu" aria-labelledby="drop6">
            <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Action</a></li>
            <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Another action</a></li>
            <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Something else here</a></li>
            <li role="presentation" class="divider"></li>
            <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Separated link</a></li>
          </ul>
			</li>
          </ul>
			<ul class="nav navbar-nav navbar-right">
				<li>
					<button type="button" class="btn btn-danger" id="logout">
						<span class="glyphicon glyphicon-off"></span>
						Logout
					</button>
				</li>
			</ul>
        </div><!--/.nav-collapse -->
      </div>
    </div>


      <div class="starter-template">
       <div id="gmap"> </div>
      </div>

	<!-- Modal -->
	<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	  <div class="modal-dialog">
		<div class="modal-content">
		  <div class="modal-header">
		    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		    <h4 class="modal-title" id="myModalLabel">List of Events</h4>
		  </div>
		  <div class="modal-body">
		  	<table class="table table-striped">
				<thead>
					<tr>
						<th>Type/Subtype</th>
						<th>Date</th>
						<th>Location</th>
						<th>Reliability</th>
						<th>Status</th>
					</tr>
				</thead>
			</table>
		  </div>
		  <div class="modal-footer">
		    <!--<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>-->
		  </div>
		</div><!-- /.modal-content -->
	  </div><!-- /.modal-dialog -->
	</div><!-- /.modal -->

		

  

    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="js/jquery-2.0.3.js"></script>
	<script src="js/jquery.cookie.js"></script>
    <script src="js/bootstrap.min.js"></script>
  	<script src="js/geo.js"></script>
	<script src="js/map.js"></script>
	<script src="js/logout.js"></script>
	<script type="text/javascript"
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAzoBwjcMDm7YmdVppL9e3V3aXyY1rYieI&sensor=true">
    </script>
	
  </body>
</html>

