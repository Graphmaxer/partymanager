var currentUrl = window.location.href;
var nodeJsServerUrl;

var localhostRegex = new RegExp("^(http|https)(:\/\/)(localhost)(:[0-9]*)?(\/partymanager)(.*)$");
var cloud9Regex = new RegExp("^(http|https)(:\/\/)(partymanager)(-|\.)(graphmaxer\.c9users\.io)(.*)$");
var openShiftRegex = new RegExp("^(http|https)(:\/\/)(partymanager-graphmaxer\.rhcloud\.com)(.*)$");

if (localhostRegex.test(currentUrl))
    nodeJsServerUrl = "http://127.0.0.1:8000/";
else if (cloud9Regex.test(currentUrl))
    nodeJsServerUrl = "http://partymanager-server-graphmaxer.c9users.io:8080";
else if (openShiftRegex.test(currentUrl))
    nodeJsServerUrl = "http://partymanagerserver-graphmaxer.rhcloud.com:8000";

var socket = io.connect(nodeJsServerUrl);


///////////////////
// ERROR HANDLER //
///////////////////

socket.on("errorMessage", function(errorMessage) {
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
    socket.emit("newLounge", { "loungeName": $("#loungeCreationName").val(), "loungePassword": $("#loungeCreationPassword").val(), "loungeDescription": $("#loungeCreationDescription").val(), "hostName" : $("#loungeCreationHostName").val()});
});


////////////////////////
// OPEN LOUNGE VOTING //
////////////////////////

socket.on("openLoungeHosting", function() {
    $("#loungeCreation").addClass("loungeCreationHided");
    $("#loungeHosting").removeClass("loungeHostingHided");
    $("#logo").addClass("logoReduced");
});


////////////////////
// LOUNGE LISTING //
////////////////////

socket.on("retrieveLounges", function(lounges) {
    var loungeList = "";

    if (lounges.length === 0) {
        loungeList = "Pas de salon";
    } else {
        for (var i = 0; i < lounges.length; i++) {
            loungeList += "<div class='loungeListItem'><span class='loungeListName'>" + lounges[i].loungeName + " : </span><span class='loungeListDescription'>" + lounges[i].loungeDescription + "</span></div>";
        }
    }
    $("#loungeList").html(loungeList);
});


socket.on("retrieveNewLounge", function(lounge) {
    $("#loungeList").append("<div class='loungeListItem'><span class='loungeListName'>" + lounge.loungeName + " : </span><span class='loungeListDescription'>" + lounge.loungeDescription + "</span></div>");
});


////////////////////////
// OPEN LOUNGE VOTING //
////////////////////////

$("#loungeList").on("click", ".loungeListItem", function() {
    $("#passwordPopup").removeClass("passwordPopupHided");
    setTimeout(function() {
        $("#passwordPopupUserName").focus();
    }, 50);

    $("#passwordPopupLoungeName").html($(this).find(":first-child").text().slice(0, -3));
});

$("#passwordPopupLoungeBack").click(function() {
    $("#passwordPopup").addClass("passwordPopupHided");
    setTimeout(function() {
        $("#passwordPopupLoungeName").html("");
        $("#passwordPopupLoungePassword").val("");
    }, 500);

});

$("#passwordPopupLoungeButton").click(function() {
    socket.emit("openLoungeVotingRequest", { "loungeName": $("#passwordPopupLoungeName").text(), "loungePassword": $("#passwordPopupLoungePassword").val(), "userName": $("#passwordPopupUserName").val() });
});

socket.on("loungeVotingOpened", function(loungeInfo) {
    $("#passwordPopup").addClass("passwordPopupHided");
    $("#loungeVotingActualLoungeName").html($("#passwordPopupLoungeName").text());
    $("#loungeVotingUserName").html($("#passwordPopupUserName").val());
    setTimeout(function() {
        $("#passwordPopupLoungeName").html("");
        $("#passwordPopupLoungePassword").val("");
    }, 500);
    $("#joinLounge").addClass("joinLoungeHided");
    $("#loungeVoting").removeClass("loungeVotingHided");
    $("#logo").addClass("logoReduced");
    $("#chat").animate({ scrollTop: $("#chat").prop("scrollHeight") }, 1000);
});


///////////////////
// LOUNGE VOTING //
///////////////////

$("#loungeVotingBack").click(function() {
    setTimeout(function() {
        $("#loungeVotingActualLoungeName").html("");
        $("#loungeVotingUserName").html("");
        $("#loungeVotingChat").html("");
        $(".userList").html("");
        socket.emit("userDisconnection");
        
    }, 500);
    $("#joinLounge").removeClass("joinLoungeHided");
    $("#loungeVoting").addClass("loungeVotingHided");
    $("#logo").removeClass("logoReduced");
});


//////////////////
// USER LISTING //
//////////////////

socket.on("retrieveUsers", function(users) {
    for (var i = 0; i < users.length; i++) {
        $(".userList").append("<li class='userListName'>" + users[i].userName + "</li>");
    }
});

socket.on("retrieveNewUser", function(userName) {
    $(".userList").append("<li class='userListName' style='display: none;'>" + userName + "</li>");
    $(".userListName:hidden").show("slow");
});

socket.on("userListDisconnection", function(userName) {
    $(".userList li").filter(function() {
        return $(this).text() == userName;
    }).hide("slow", function(){ this.remove(); });
});


//////////
// CHAT //
//////////

socket.on("retrieveMessages", function(messages) {
    var messageList = "";
    for (var i = 0; i < messages.length; i++) {
        if (messages[i].isHost == true) {
            messageList += "<div class='hostMessage'><span class='hostMessageAuthor'>" + messages[i].messageAuthor + " : </span><span class='hostMessageContent'>" + messages[i].messageContent + "</span></div>";
        }
        else {
            messageList += "<div class='message'><span class='messageAuthor'>" + messages[i].messageAuthor + " : </span><span class='messageContent'>" + messages[i].messageContent + "</span></div>";
        }
    }

    $("#loungeHostingChat").html(messageList);
    $("#loungeVotingChat").html(messageList);
});

socket.on("retrieveNewMessage", function(message) {
    $("#loungeHostingChat").append("<div class='message'><span class='messageAuthor'>" + message.messageAuthor + " : </span><span class='messageContent'>" + message.messageContent + "</span></div>");
    $("#loungeVotingChat").append("<div class='message'><span class='messageAuthor'>" + message.messageAuthor + " : </span><span class='messageContent'>" + message.messageContent + "</span></div>");
    $("#loungeHostingChat").animate({ scrollTop: $("#loungeHostingChat").prop("scrollHeight") }, 300);
    $("#loungeVotingChat").animate({ scrollTop: $("#loungeVotingChat").prop("scrollHeight") }, 300);
});


/////////////////////////
// LOUNGE HOSTING CHAT //
/////////////////////////

$("#loungeHostingChatSendButton").click(function() {
    socket.emit("newMessage", $("#loungeHostingChatInputMessage").val());
    $("#loungeHostingChat").animate({ scrollTop: $("#loungeHostingChat").prop("scrollHeight") }, 300);
    $("#loungeHostingChatInputMessage").val("");
});


////////////////////////
// LOUNGE VOTING CHAT //
////////////////////////

$("#loungeVotingChatSendButton").click(function() {
    socket.emit("newMessage", $("#loungeVotingChatInputMessage").val());
    $("#loungeVotingChat").animate({ scrollTop: $("#loungeVotingChat").prop("scrollHeight") }, 300);
    $("#loungeVotingChatInputMessage").val("");
});