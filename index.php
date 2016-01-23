<!DOCTYPE HTML>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Tchat avec Socket.IO</title>
    <script type="text/javascript" src="https://cdn.socket.io/socket.io-1.4.3.js"></script>
    <script type="text/javascript" src="client.js"></script>
    <link rel="stylesheet" type="text/css" href="style/main.css">
</head>
<body>
    <h1>Tchat avec Socket.IO</h1>
    <div id="tchat"></div>
    <form onsubmit="return (envoiMessage());">
        <b>Message : </b>
        <input type="text" name="message" id="message" style="width:250px;" />
        <input type="submit" value="Envoyer" />
    </form>

</body>
</html>