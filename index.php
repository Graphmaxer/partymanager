<!DOCTYPE HTML>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
	<title>PartyManager : Let the crowd take control</title>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/> 
	<link rel="stylesheet" type="text/css" href="style/main.css"/>
	<link rel="stylesheet" type="text/css" href="style/home.css"/>
	<link rel="stylesheet" type="text/css" href="style/loungeCreation.css"/>
	<link rel="stylesheet" type="text/css" href="style/loungeHosting.css"/>
	<link rel="stylesheet" type="text/css" href="style/joinLounge.css"/>
	<link rel="stylesheet" type="text/css" href="style/loungeVoting.css"/>
	<link rel="stylesheet" type="text/css" href="style/chat.css"/>
	<script type="text/javascript" src="js/lib/jquery.min.js"></script>
	<script type="text/javascript" src="js/lib/socket.io-1.4.3.js"></script>	
</head>
<body>
	<img id="logo" src="img/PartyManagerLogo.png" alt="PartyManager Logo"/><br/>

	<div id="errorBox" class="errorBoxHided"></div>

	<?php require_once("require/home.php");

	require_once("require/loungeCreation.php");

	require_once("require/joinLounge.php");

	require_once("require/loungeHosting.php");

	require_once("require/loungeVoting.php"); ?>

	<script type="text/javascript" src="js/client.js"></script>
	<script type="text/javascript" src="js/main.js"></script>
	<script type="text/javascript" src="js/search.js"></script>
</body>
</html>