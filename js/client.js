var currentUrl = window.location.href;
var nodeJsServerUrl;

if (currentUrl == "http://localhost:8080/partymanager/")
	nodeJsServerUrl = "http://127.0.0.1:8000/";
else if (currentUrl == "http://partymanager-graphmaxer.c9users.io/")
	nodeJsServerUrl = "http://partymanager-server-graphmaxer.c9users.io:8080";
else
	nodeJsServerUrl = "http://partymanagerserver-graphmaxer.rhcloud.com:8000";

var socket = io.connect(nodeJsServerUrl);

///////////////////
// ERROR HANDLER //
///////////////////

socket.on("errorMessage", function (errorMessage) {
	$("#errorBox").append("<div class='errorMessage'>Erreur : " + errorMessage + "</div>").removeClass("errorBoxHided");

	setTimeout(function() {
		$("#errorBox").addClass("errorBoxHided");
	}, 4000);

	setTimeout(function() {
		$("#errorBox").children("div:first").remove();
	}, 4500);
});


/////////////////////
// LOUNGE CREATION //
/////////////////////

$("#loungeCreationButton").click(function() {
	var loungeName = $("#loungeCreationName").val();
	var loungePassword = $("#loungeCreationPassword").val();
	var loungeDescription = $("#loungeCreationDescription").val();
	
	socket.emit("newLounge", { "loungeName" : loungeName, "loungePassword" : loungePassword,  "loungeDescription" : loungeDescription});
});

socket.on("openLounge", function (lounge) {
	$("#loungeCreation").addClass("loungeCreationHidedBottom");
	$("#loungeHosting").removeClass("loungeHostingHided");
	$("#logo").addClass("logoReduced");
});


////////////////////
// LOUNGE LISTING //
////////////////////

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
			loungeList += "<div class='loungeListItem'><span class='loungeListName'>" + lounges[i].loungeName + " : </span><span class='loungeListDescription'>" + lounges[i].loungeDescription + "</span></div>";
		}
	}
	$("#loungeList").html(loungeList);
});


socket.on("retrieveNewLounge", function (lounge) {
	$("#loungeList").append("<div class='loungeListItem'><span class='loungeListName'>" + lounge.loungeName + " : </span><span class='loungeListDescription'>" + lounge.loungeDescription + "</span></div>");
});


///////////
// TCHAT //
///////////

$("#tchatSendButton").click(function() {
	var messageAuthor = $("#tchatInputAuthor").val();
	var messageContent = $("#tchatInputMessage").val();
	
	socket.emit("newMessage", { "messageAuthor" : messageAuthor, "messageContent" : messageContent});
	$("#tchat").animate({ scrollTop: $("#tchat").prop("scrollHeight")}, 1000);
});

socket.on("retrieveMessages", function (messages) {
	var messageList = "";
	for (var i = 0; i < messages.length; i++)
	{
		messageList += "<div class='message'><span class='messageAuthor'>" + messages[i].messageAuthor + " : </span><span class='messageContent'>" + messages[i].messageContent + "</span></div>";
	}

	$("#tchat").html(messageList);
});

socket.on("retrieveNewMessage", function (message) {
	$("#tchat").append("<div class='message'><span class='messageAuthor'>" + message.messageAuthor + " : </span><span class='messageContent'>" + message.messageContent + "</span></div>");
});