<!DOCTYPE HTML>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
	<title>PartyManager : Let the crowd take control</title>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
	<script type="text/javascript" src="https://cdn.socket.io/socket.io-1.4.3.js"></script>
	<script type="text/javascript" src="client.js"></script>
	<link rel="stylesheet" type="text/css" href="style/main.css"/>
	<link href='https://fonts.googleapis.com/css?family=Work+Sans:400,700' rel='stylesheet' type='text/css'/>
</head>
<body>
	<img src="img/PartyManagerLogo.png"/><br/>

	<h1>Bienvenue, vous pouvez :</h1>

	<div id="tchat"></div>
	<form onsubmit="return (envoiMessage());">
		<b>Message : </b>
		<input type="text" name="message" id="message" style="width:250px;" />
		<input type="submit" value="Envoyer" />
	</form>
	
	
</body>
</html>