var currentUrl = window.location.href;
var nodeJsServerUrl;

if (currentUrl == "http://localhost:8080/partymanager/")
	nodeJsServerUrl = "http://127.0.0.1:8000/";
else
	nodeJsServerUrl = "http://partymanagerserver-graphmaxer.rhcloud.com:8000";

var socket = io.connect(nodeJsServerUrl);

$("#loungeCreationButton").click(function() {
	var loungeName = $("#loungeName").val();
	var loungePassword = $("#loungePassword").val();
	var loungeDescription;

	if ($("#loungeDescription").val()) {
		loungeDescription = $("#loungeDescription").val();
	}
	else
	{
		loungeDescription = "";
	}
	
	socket.emit("newLounge", { "loungeName" : loungeName, "loungePassword" : loungePassword,  "loungeDescription" : loungeDescription});
});

socket.on("retrieveLounges", function (lounges) {
	if (lounges.length === 0)
	{
    	loungeList = "Pas de salon";
	}
	else
	{
		var loungeList = "";
		for (var i = 0; i < lounges.length; i++)
		{
			loungeList += "<div><b>" + lounges[i].loungeName + "</b> : " + lounges[i].loungeDescription + "</div>";
		}
	}
	$("#loungeList").html(loungeList);
});

// Si quelqu'un a poste un message, le serveur nous envoie son message avec l'evenement recupererNouveauMessage
/*socket.on('recupererNouveauMessage', function (message) {
	document.getElementById('tchat').innerHTML += '<div class="line"><b>'+message.pseudo+'</b> : '+message.message+'</div>';
});*/