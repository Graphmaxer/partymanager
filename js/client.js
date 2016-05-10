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
    socket.emit("newLounge", { "loungeName": $("#loungeCreationName").val(), "loungePassword": $("#loungeCreationPassword").val(), "loungeDescription": $("#loungeCreationDescription").val(), "hostName": $("#loungeCreationHostName").val() });
});


/////////////////////////
// OPEN LOUNGE HOSTING //
/////////////////////////

var isUserHost = false;

socket.on("openLoungeHosting", function() {
    $("#loungeCreation").addClass("loungeCreationHided");
    $("#loungeHosting").removeClass("loungeHostingHided");
    $("#logo").addClass("logoReduced");

    isUserHost = true;
});


////////////////////
// LOUNGE LISTING //
////////////////////

socket.on("retrieveLounges", function(lounges) {
    var loungeList = "";

    if (lounges.length === 0) {
        loungeList = "<p>Pas de salon</p>";
    } else {
        for (var i = 0; i < lounges.length; i++) {
            loungeList += "<div class='loungeListItem'><span class='loungeListName'>" + lounges[i].loungeName + " : </span><span class='loungeListDescription'>" + lounges[i].loungeDescription + "</span></div>";
        }
    }
    $("#loungeList").html(loungeList);
});


socket.on("retrieveNewLounge", function(lounge) {
    $("#loungeList > p").remove();
    $("#loungeList").append("<div class='loungeListItem' style='opacity: 0;'><span class='loungeListName'>" + lounge.loungeName + " : </span><span class='loungeListDescription'>" + lounge.loungeDescription + "</span></div>");
    $(".loungeListItem[style='opacity: 0;']").animate({ "opacity": "1" }, "slow");
});

socket.on("loungeDeleted", function(loungeName) {
    $(".loungeListItem:contains('" + loungeName + " : ')").animate({ "opacity": "0" }, "slow", function() {
        $(this).remove();

        if ($("#loungeList > div").length == 0) {
            $("#loungeList").html("<p style='opacity: 0;'>Pas de salon</p>");
            $("#loungeList p").animate({ "opacity": "1" }, "slow");
        }
    });


});

////////////////////////
// OPEN LOUNGE VOTING //
////////////////////////

var isUserConnected = false;

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
    socket.emit("openLoungeVotingRequest", { "loungeName": $("#passwordPopupLoungeName").text(), "loungePassword": $("#passwordPopupLoungePassword").val(), "userName": $("#passwordPopupUserName").val(), "clientIdCookies": Cookies.get() });
});

socket.on("loungeVotingOpened", function(loungeInfo) {
    $("#passwordPopup").addClass("passwordPopupHided");
    $("#loungeVotingActualLoungeName").html(loungeInfo.loungeName);
    $("#loungeVotingUserName").html(loungeInfo.userName);
    setTimeout(function() {
        $("#passwordPopupLoungeName").html("");
        $("#passwordPopupLoungePassword").val("");
    }, 500);
    $("#joinLounge").addClass("joinLoungeHided");
    $("#loungeVoting").removeClass("loungeVotingHided");
    $("#logo").addClass("logoReduced");
    $(".chat").animate({ scrollTop: $(".chat").prop("scrollHeight") }, 1000);

    isUserConnected = true;

    /*FOR DEBUG (TEMP) Cookies.set(loungeInfo.loungeName, socket.io.engine.id, { "expires": 1 });*/
});


///////////////////
// LOUNGE VOTING //
///////////////////

$("#loungeVotingBack").click(function() {
    setTimeout(function() {
        $("#loungeVotingActualLoungeName").html("");
        $("#loungeVotingUserName").html("");
        $("#loungeVotingSearchResult").html("");
        $(".musicList").html();
        $(".chat").html("");
        $(".userList").html("");
        socket.emit("userDisconnection");

    }, 500);
    $("#joinLounge").removeClass("joinLoungeHided");
    $("#loungeVoting").addClass("loungeVotingHided");
    $("#logo").removeClass("logoReduced");

    isUserConnected = false;
});


//////////////////
// USER LISTING //
//////////////////

socket.on("retrieveUsers", function(users) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].isHost == true) {
            $(".userList").append("<li class='userListHostName'>" + users[i].userName + "</li>");
        } else {
            $(".userList").append("<li class='userListName'>" + users[i].userName + "</li>");
        }
    }
});

socket.on("retrieveNewUser", function(userName) {
    $(".userList").append("<li class='userListName' style='display: none;'>" + userName + "</li>");
    $(".userListName:hidden").show("slow");
});

socket.on("userListDisconnection", function(userName) {
    $(".userList li:contains('" + userName + "')").hide("slow", function() { this.remove(); });
});


//////////
// CHAT //
//////////

socket.on("retrieveMessages", function(messages) {
    var messageList = "";
    for (var i = 0; i < messages.length; i++) {
        if (messages[i].isHost == true) {
            messageList += "<div class='chatHostMessage'><span class='chatHostMessageAuthor'>" + messages[i].messageAuthor + " : </span><span class='chatHostMessageContent'>" + messages[i].messageContent + "</span></div>";
        } else {
            messageList += "<div class='chatMessage'><span class='chatMessageAuthor'>" + messages[i].messageAuthor + " : </span><span class='chatMessageContent'>" + messages[i].messageContent + "</span></div>";
        }
    }

    $(".chat").html(messageList);
});

socket.on("retrieveNewMessage", function(message) {
    if (message.isHost == true) {
        $(".chat").append("<div class='chatHostMessage' style='opacity: 0;'><span class='chatHostMessageAuthor'>" + message.messageAuthor + " : </span><span class='chatHostMessageContent'>" + message.messageContent + "</span></div>");
    } else {
        $(".chat").append("<div class='chatMessage' style='opacity: 0;'><span class='chatMessageAuthor'>" + message.messageAuthor + " : </span><span class='chatMessageContent'>" + message.messageContent + "</span></div>");
    }

    $(".chat div[style='opacity: 0;']").animate({ "opacity": "1" }, "slow");

    $(".chat").animate({ scrollTop: $(".chat").prop("scrollHeight") }, 300);
});

$(".chatSendButton").click(function() {
    socket.emit("newMessage", $(this).siblings(".chatInputMessage").val());
    $(".chat").animate({ scrollTop: $(".chat").prop("scrollHeight") }, 300);
    $(".chatInputMessage").val("");
});


///////////////////
// MUSIC SEARCH  //
///////////////////

var searchKeyword = "";

$("#loungeVotingSearchButton").click(function() {
    searchKeyword = $("#loungeVotingSearchInput").val();

    $("#loungeVotingSearchResult").html("<div class='loading' style='opacity: 0;'></div>");
    $(".loading").animate({ "opacity": "1" }, "slow");

    $.post("script/search.php", { "searchInput": searchKeyword, "videoIdListAlreadyAdded": videoIdListAlreadyAdded }, function(data) {
        $(".loading").animate({ "opacity": "0" }, "slow", function() {
            $(this).remove();
        });
        $("#loungeVotingSearchResult").append(data);
        $(".loungeVotingVideoAndTitleBox").animate({ "opacity": "1" }, "slow");
    });
});

$("#loungeVotingSearchResult").on("click", "#loungeVotingMore", function() {

    var pageToken = $("#loungeVotingMore").attr("class");

    $("#loungeVotingMore").fadeOut("slow", function() {
        $("#loungeVotingMore").remove();
    });

    $("#loungeVotingSearchResult").append("<div class='loading' style='opacity: 0;'></div>");
    $(".loading").animate({ "opacity": "1" }, "slow");

    $("#loungeVotingSearchResult").animate({ scrollTop: $("#loungeVotingSearchResult").prop("scrollHeight") }, 500);

    $.post("script/search.php", { "searchInput": searchKeyword, "pageToken": pageToken, "videoIdListAlreadyAdded": videoIdListAlreadyAdded }, function(data) {
        $(".loading").animate({ "opacity": "0" }, "slow", function() {
            $(this).remove();
        });

        $("#loungeVotingSearchResult").append(data);
        $(".loungeVotingVideoAndTitleBox").animate({ "opacity": "1" }, "slow");
        $("#loungeVotingSearchResult").animate({ scrollTop: $("#loungeVotingSearchResult").prop("scrollHeight") }, 500);
    });
});


//////////////////
// ADDING MUSIC //
//////////////////

$("#loungeVotingSearchResult").on("click", ".loungeVotingAdd", function() {
    if (!$(this).hasClass("loungeVotingAddActive")) {
        $(this).addClass("loungeVotingAddActive");
        socket.emit("musicAdded", $(this).parent().attr("id"));
    }
});


///////////////////
// MUSIC LISTING //
///////////////////

var videoIdListAlreadyAdded = [];

socket.on("retrieveMusic", function(musicList) {
    if (musicList.length == 0) {
        videoIdListAlreadyAdded = [""];

        $(".musicList").html("<p class='loungeVotingNoMusic'>Aucune musique</p>");
    } 
    else {
        for (var i = 0; i < musicList.length; i++) {
            videoIdListAlreadyAdded.push(musicList[i].videoId);

            if (musicList[i].score > 0) {
                var score = "<div class='loungeVotingScore' style='color: #2ecc71;'>" + musicList[i].score + "</div>";
            }
            else if (musicList[i].score < 0) {
                var score = "<div class='loungeVotingScore' style='color: #e74c3c;'>" + musicList[i].score + "</div>";
            }
            else {
                var score = "<div class='loungeVotingScore'>" + musicList[i].score + "</div>";
            }

            $(".musicList").append("<div class='loungeVotingVideoAndTitleBox' id='" + musicList[i].videoId + "'>" +
                "<img class='loungeVotingThumbnail' src='" + musicList[i].thumbnailLink + "'/>" +
                "<div class='loungeVotingDuration'>" + musicList[i].duration + "</div>" +
                "<div class='loungeVotingVideoTitle'>" + musicList[i].title + "</div>" +
                "<div class='loungeVotingVoteBox'>" +
                "<div class='loungeVotingUpVote'></div>" +
                score +
                "<div class='loungeVotingDownVote'></div>" +
                "</div>" +
                "</div>");
        }
    }
});

socket.on("retrieveNewMusic", function(videoInfo) {
    if ($(".musicList").find(".loungeVotingNoMusic").length == 1) {
        $(".loungeVotingNoMusic").fadeOut("slow", function() {
            $(this).remove();
        });
    }

    $("#loungeVotingSearchResult").find("#" + videoInfo.videoId + " > .loungeVotingAdd").addClass("loungeVotingAddActive");

    $(".musicList").append("<div class='loungeVotingVideoAndTitleBox' id='" + videoInfo.videoId + "' style='opacity: 0;'>" +
        "<img class='loungeVotingThumbnail' src='" + videoInfo.thumbnailLink + "'/>" +
        "<div class='loungeVotingDuration'>" + videoInfo.duration + "</div>" +
        "<div class='loungeVotingVideoTitle'>" + videoInfo.title + "</div>" +
        "<div class='loungeVotingVoteBox'>" +
        "<div class='loungeVotingUpVote'></div>" +
        "<div class='loungeVotingScore' style='color: #2ecc71;'>" + videoInfo.score + "</div>" +
        "<div class='loungeVotingDownVote'></div>" +
        "</div>" +
        "</div>");
    $(".musicList div[style='opacity: 0;']").animate({ "opacity": "1" }, "slow");
});

socket.on("retrieveNewLikedMusic", function(videoId) {
    $("#loungeVotingMusicListBox > .musicList").find("#" + videoId + " > .loungeVotingVoteBox > .loungeVotingDownVote").removeClass("loungeVotingDownVoteActive");
    $("#loungeVotingMusicListBox > .musicList").find("#" + videoId + " > .loungeVotingVoteBox > .loungeVotingUpVote").addClass("loungeVotingUpVoteActive");
});

socket.on("retrieveNewDislikedMusic", function(videoId) {
    $("#loungeVotingMusicListBox > .musicList").find("#" + videoId + " > .loungeVotingVoteBox > .loungeVotingUpVote").removeClass("loungeVotingUpVoteActive");
    $("#loungeVotingMusicListBox > .musicList").find("#" + videoId + " > .loungeVotingVoteBox > .loungeVotingDownVote").addClass("loungeVotingDownVoteActive");
});

socket.on("retrieveLikedAndDislikedMusic", function(likedAndDislikedMusic) {

});

//////////
// VOTE //
//////////

$(".musicList").on("click", ".loungeVotingUpVote", function() {
    if (!$(this).hasClass("loungeVotingUpVoteActive")) {
        $(this).addClass("loungeVotingUpVoteActive");
        socket.emit("upVote", $(this).parent().parent().attr("id"));
    }
});

$(".musicList").on("click", ".loungeVotingDownVote", function() {
    if (!$(this).hasClass("loungeVotingDownVoteActive")) {
        $(this).addClass("loungeVotingDownVoteActive");
        socket.emit("downVote", $(this).parent().parent().attr("id"));
    }
});

socket.on("addScore", function(videoId) {
    if (isUserConnected) {
        var actualScore = parseInt($("#loungeVotingMusicListBox > .musicList").find("#" + videoId + " > .loungeVotingVoteBox > .loungeVotingScore").text());
        $("#loungeVotingMusicListBox > .musicList").find("#" + videoId + " > .loungeVotingVoteBox > .loungeVotingScore").text(actualScore + 1);
    }
});

socket.on("minusScore", function(videoId) {
    if (isUserConnected) {
        var actualScore = parseInt($("#loungeVotingMusicListBox > .musicList").find("#" + videoId + " > .loungeVotingVoteBox > .loungeVotingScore").text());
        $("#loungeVotingMusicListBox > .musicList").find("#" + videoId + " > .loungeVotingVoteBox > .loungeVotingScore").text(actualScore - 1);
    }
});




///////////////////
// DISCONNECTION //
///////////////////

$(window).on("beforeunload", function() {
    if (isUserConnected) {
        return "Si vous quitter cette page, vous serez déconnecté(e)";
    }

    if (isUserHost) {
        return "Si vous quitter cette page, ce salon sera supprimé";
        socket.emit("hostDisconnection");
    }
});

socket.on("loungeClosedForUsers", function() {
    setTimeout(function() {
        $("#loungeVotingActualLoungeName").html("");
        $("#loungeVotingUserName").html("");
        $(".chat").html("");
        $(".userList").html("");
        socket.emit("userDisconnection");

    }, 500);
    $("#joinLounge").removeClass("joinLoungeHided");
    $("#loungeVoting").addClass("loungeVotingHided");
    $("#logo").removeClass("logoReduced");

    isUserConnected = false;
});


////////////
// RESUME //
////////////

socket.on("resumeSession", function(userName) {
    $("#errorBox").append("<div class='errorMessage'>Vous avez repris la session en tant que : " + userName + "</div>").removeClass("errorBoxHided");

    setTimeout(function() {
        $("#errorBox").addClass("errorBoxHided");
    }, 4000);

    setTimeout(function() {
        $("#errorBox").children("div:first").remove();
    }, 4500);
});