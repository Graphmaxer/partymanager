<!DOCTYPE HTML>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Tchat avec Socket.IO</title>
    <script src="https://cdn.socket.io/socket.io-1.4.3.js"></script>
  <style type="text/css">
  body {
    background-color  : rgb(50,50,80);
    color       : white;
    text-align      : center;
  }
  #tchat {
    background-color  : white;
    opacity       : 0.8;
    width       : 500px;
    height        : 300px;
    margin        : auto;
    border        : 3px rgb(40,40,40) solid;
    overflow      : auto;
  }
  .line {
    border-bottom   : 1px rgb(80,80,80) solid;
    padding       : 4px;
    text-align:left;
    color       : rgb(40,40,40);
  }
  </style>
</head>
<body>
  <h1>Tchat avec Socket.IO</h1>
  <div id="tchat"></div>
  <form onsubmit="return (envoiMessage());">
    <b>Message : </b><input type="text" name="message" id="message" style="width:250px;" /> <input type="submit" value="Envoyer" />
  </form>
  <script type="text/javascript">
  // On demande le pseudo de l'utilisateur
  var pseudo = prompt('Votre pseudo ?') || 'Utilisateur';
  
  // On se connecte au serveur
  var socket = io.connect("http://partymanagerserver-graphmaxer.rhcloud.com:8000");
  
  // On creer l'evenement recupererMessages pour recuperer direcement les messages sur serveur
  socket.on('recupererMessages', function (messages) {
    // messages est le tableau contenant tous les messages qui ont ete ecris sur le serveur
    var html = '';
    for (var i = 0; i < messages.length; i++)
      html += '<div class="line"><b>'+messages[i].pseudo+'</b> : '+messages[i].message+'</div>';
    document.getElementById('tchat').innerHTML = html;
  });
  
  // Si quelqu'un a poste un message, le serveur nous envoie son message avec l'evenement recupererNouveauMessage
  socket.on('recupererNouveauMessage', function (message) {
    document.getElementById('tchat').innerHTML += '<div class="line"><b>'+message.pseudo+'</b> : '+message.message+'</div>';
  });
  // Quand on veut envoyer un message (quand il a valider le formulaire)
  function envoiMessage(mess) {
    // On recupere le message
    var message = document.getElementById('message').value;
    
    // On appelle l'evenement se trouvant sur le serveur pour qu'il enregistre le message et qu'il l'envoie a tous les autres clients connectes (sauf nous)
    socket.emit('nouveauMessage', { 'pseudo' : pseudo, 'message' : message });
    
    // On affiche directement notre message dans notre page
    document.getElementById('tchat').innerHTML += '<div class="line"><b>'+pseudo+'</b> : '+message+'</div>';
    
    // On vide le formulaire
    document.getElementById('message').value = '';
    
    // On retourne false pour pas que le formulaire n'actualise pas la page
    return false;
  }
  </script>
</body>
</html>