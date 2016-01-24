<!DOCTYPE HTML>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
	<title>PartyManager : Let the crowd take control</title>
	<link rel="stylesheet" type="text/css" href="style/main.css"/>
	<link rel="stylesheet" type="text/css" href="style/home.css"/>
	<link rel="stylesheet" type="text/css" href="style/loungeCreation.css"/>
	<link href='https://fonts.googleapis.com/css?family=Work+Sans:400,700' rel='stylesheet' type='text/css'/>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
	<script type="text/javascript" src="https://cdn.socket.io/socket.io-1.4.3.js"></script>	
</head>
<body>
	<img id="logo" src="img/PartyManagerLogo.png" alt="PartyManager Logo"/><br/>

	<?php require_once("require/home.php"); ?>

	<?php require_once("require/loungeCreation.php"); ?>

	<script type="text/javascript" src="js/client.js"></script>
	<script type="text/javascript" src="js/main.js"></script>
</body>
</html>