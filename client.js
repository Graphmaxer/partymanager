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