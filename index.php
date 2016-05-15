<!DOCTYPE HTML>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
	<title>PartyManager : Let the crowd take control</title>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
	<link rel="icon" type="image/png" href="img/favicon.png" />
	<link rel="stylesheet" type="text/css" href="style/mediaQueries.css"/>
	<link rel="stylesheet" type="text/css" href="style/main.css"/>
	<link rel="stylesheet" type="text/css" href="style/home.css"/>
	<link rel="stylesheet" type="text/css" href="style/loungeCreation.css"/>
	<link rel="stylesheet" type="text/css" href="style/loungeHosting.css"/>
	<link rel="stylesheet" type="text/css" href="style/joinLounge.css"/>
	<link rel="stylesheet" type="text/css" href="style/loungeVoting.css"/>
	<link rel="stylesheet" type="text/css" href="style/chat.css"/>
	<script type="text/javascript" src="js/lib/jquery.min.js"></script>
	<script type="text/javascript" src="js/lib/socket.io-1.4.3.js"></script>
	<script type="text/javascript" src="js/lib/js.cookie.js"></script>
</head>
<body>
	<script> 
		var $buoop = {c:2}; 
		function $buo_f(){ 
		 var e = document.createElement("script"); 
		 e.src = "//browser-update.org/update.min.js"; 
		 document.body.appendChild(e);
		};
		try {document.addEventListener("DOMContentLoaded", $buo_f,false)}
		catch(e){window.attachEvent("onload", $buo_f)}
	</script>
	
	<img id="logo" src="img/PartyManagerLogo.png" alt="PartyManager Logo"/><br/>

	<div id="errorBox"></div>

	<?php require_once("require/home.php");

	require_once("require/loungeCreation.php");

	require_once("require/joinLounge.php");

	require_once("require/loungeHosting.php");

	require_once("require/loungeVoting.php"); ?>

	<script type="text/javascript" src="js/client.js"></script>
	<script type="text/javascript" src="js/main.js"></script>
</body>
</html>