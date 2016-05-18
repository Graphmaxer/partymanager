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

var errorMessageLocked = false;

socket.on("errorMessage", function(errorMessage) {
    if (errorMessageLocked == false) {
        errorMessageLocked = true;

        $("#errorBox").append("<div class='errorMessage' style='display: none;'>Erreur : " + errorMessage + "</div>");
        $("#errorBox .errorMessage:hidden").show("slow");

        setTimeout(function() {
            $("#errorBox").children("div:first").hide("slow", function() {
                $(this).remove();
            });
            errorMessageLocked = false;
        }, 4500);
    }
});


/////////////////////
// LOUNGE CREATION //
/////////////////////

$("#loungeCreationButton").click(function() {
    socket.emit("newLounge", { "loungeName": $("#loungeCreationName").val(), "loungePassword": $("#loungeCreationPassword").val(), "loungeDescription": $("#loungeCreationDescription").val(), "hostName": $("#loungeCreationHostName").val() });
});


////////////////////
// LOUNGE HOSTING //
////////////////////

var isUserHost = false;

socket.on("openLoungeHosting", function() {
    $("#loungeCreation").addClass("loungeCreationHided");
    $("#loungeHosting").removeClass("loungeHostingHided");
    $("#logo").addClass("logoReduced");

    isUserHost = true;
});

$("#loungeHostingLeftSpeaker").on("click", ".loungeHostingDeleteButton", function() {
    socket.emit("removeMusic", $(this).parent().attr("id"));
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
            if (lounges[i].loungeDescription == "") {
                loungeList += "<div class='loungeListItem' id='" + lounges[i].loungeName + "''><span class='loungeListName'>" + lounges[i].loungeName + "</span></div>";
            } else {
                loungeList += "<div class='loungeListItem' id='" + lounges[i].loungeName + "''><span class='loungeListName'>" + lounges[i].loungeName + " : </span><span class='loungeListDescription'>" + lounges[i].loungeDescription + "</span></div>";
            }

        }
    }
    $("#loungeList").html(loungeList);
});


socket.on("retrieveNewLounge", function(lounge) {
    $("#loungeList > p").remove();

    if (lounge.loungeDescription == "") {
        $("#loungeList").append("<div class='loungeListItem' id='" + lounge.loungeName + "'' style='opacity: 0;'><span class='loungeListName'>" + lounge.loungeName + "</span></div>");
    } else {
        $("#loungeList").append("<div class='loungeListItem' id='" + lounge.loungeName + "'' style='opacity: 0;'><span class='loungeListName'>" + lounge.loungeName + " : </span><span class='loungeListDescription'>" + lounge.loungeDescription + "</span></div>");
    }

    $(".loungeListItem[style='opacity: 0;']").animate({ "opacity": "1" }, "slow");
});

socket.on("loungeDeleted", function(loungeName) {
    $(".loungeListItem[id='" + loungeName + "']").animate({ "opacity": "0" }, "slow", function() {
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
    }, 100);

    $("#passwordPopupLoungeName").html($(this).attr("id"));
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

    Cookies.set(loungeInfo.loungeName, socket.io.engine.id, { "expires": 1 });
});


///////////////////
// LOUNGE VOTING //
///////////////////

$("#loungeVotingBack").click(function() {
    setTimeout(function() {
        $("#loungeVotingActualLoungeName").html("");
        $("#loungeVotingUserName").html("");
        $("#loungeVotingSearchResult").html("");
        $(".musicList").html("");
        $(".chat").html("");
        $(".userList").html("");
        videoIdListAlreadyAdded = [];
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
    var usersList = "";
    for (var i = 0; i < users.length; i++) {
        if (users[i].isHost == true) {
            usersList += "<li class='userListHostName'>" + users[i].userName + "</li>";
        } else {
            usersList += "<li class='userListName'>" + users[i].userName + "</li>";
        }
    }

    if (isUserHost) {
        $("#loungeHostingUserListBox > .userList").html(usersList);
    } else if (isUserConnected) {
        $("#loungeVotingUserListBox > .userList").html(usersList);
    }
});

socket.on("retrieveNewUser", function(userName) {
    if (isUserHost) {
        $("#loungeHostingUserListBox > .userList").append("<li class='userListName' style='display: none;'>" + userName + "</li>");
        $("#loungeHostingUserListBox .userListName:hidden").show("slow");
    } else if (isUserConnected) {
        $("#loungeVotingUserListBox > .userList").append("<li class='userListName' style='display: none;'>" + userName + "</li>");
        $("#loungeVotingUserListBox .userListName:hidden").show("slow");
    }
});

socket.on("userListDisconnection", function(userName) {
    if (isUserHost) {
        $("#loungeHostingUserListBox > .userList li:contains('" + userName + "')").hide("slow", function() { this.remove(); });
    } else if (isUserConnected) {
        $("#loungeVotingUserListBox > .userList li:contains('" + userName + "')").hide("slow", function() { this.remove(); });
    }
});


//////////
// CHAT //
//////////

socket.on("retrieveMessages", function(messages) {
    var messageList = "";
    if (messages.length == 0) {
        messageList = "<p class='chatNoMessage'>Aucun message</p>";
    }

    for (var i = 0; i < messages.length; i++) {
        if (messages[i].isHost == true) {
            messageList += "<div class='chatHostMessage'><span class='chatHostMessageAuthor'>" + messages[i].messageAuthor + " : </span><span class='chatHostMessageContent'>" + messages[i].messageContent + "</span></div>";
        } else {
            messageList += "<div class='chatMessage'><span class='chatMessageAuthor'>" + messages[i].messageAuthor + " : </span><span class='chatMessageContent'>" + messages[i].messageContent + "</span></div>";
        }
    }

    if (isUserHost) {
        $("#loungeHostingChatBox > .chat").html(messageList);
    } else if (isUserConnected) {
        $("#loungeVotingChatBox > .chat").html(messageList);
    }

});

socket.on("retrieveNewMessage", function(message) {
    if (message.isHost == true) {
        var newMessage = "<div class='chatHostMessage' style='opacity: 0;'><span class='chatHostMessageAuthor'>" + message.messageAuthor + " : </span><span class='chatHostMessageContent'>" + message.messageContent + "</span></div>";
    } else {
        var newMessage = "<div class='chatMessage' style='opacity: 0;'><span class='chatMessageAuthor'>" + message.messageAuthor + " : </span><span class='chatMessageContent'>" + message.messageContent + "</span></div>";
    }

    if (isUserHost) {
        if ($("#loungeHostingChatBox > .chat").find(".chatNoMessage").length == 1) {
            $("#loungeHostingChatBox .chatNoMessage").hide("slow", function() {
                $(this).remove();
            });
        }
        $("#loungeHostingChatBox > .chat").append(newMessage);
        $("#loungeHostingChatBox > .chat div[style='opacity: 0;']").animate({ "opacity": "1" }, "slow");
        $("#loungeHostingChatBox > .chat").animate({ scrollTop: $(".chat").prop("scrollHeight") }, 300);
    } else if (isUserConnected) {
        if ($("#loungeVotingChatBox > .chat").find(".chatNoMessage").length == 1) {
            $("#loungeVotingChatBox .chatNoMessage").hide("slow", function() {
                $(this).remove();
            });
        }
        $("#loungeVotingChatBox > .chat").append(newMessage);
        $("#loungeVotingChatBox > .chat div[style='opacity: 0;']").animate({ "opacity": "1" }, "slow");
        $("#loungeVotingChatBox > .chat").animate({ scrollTop: $(".chat").prop("scrollHeight") }, 300);
    }
});

var sendMessageLocked = false;
var sendsendMessageErrorLocked = false;

$(".chatSendButton").click(function() {
    if (sendMessageLocked == false) {
        sendMessageLocked = true;

        socket.emit("newMessage", $(this).siblings(".chatInputMessage").val());
        $(".chat").animate({ scrollTop: $(".chat").prop("scrollHeight") }, 300);
        $(".chatInputMessage").val("");

        setTimeout(function() {
            sendMessageLocked = false;
        }, 10000);
    } else if (sendMessageErrorLocked == false) {
        sendMessageErrorLocked = true;
        $("#errorBox").append("<div class='errorMessage' style='display: none;'>Erreur : vous devez attendre avant d'envoyer un nouveau message</div>");
        $("#errorBox .errorMessage:hidden").show("fast");

        setTimeout(function() {
            $("#errorBox").children("div:first").hide("slow", function() {
                $(this).remove();
            });
            sendMessageErrorLocked = false;
        }, 4500);
    }
});


//////////////////
// MUSIC SEARCH //
//////////////////

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

    $("#loungeVotingMore").hide("slow", function() {
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

        videoIdListAlreadyAdded.push($(this).parent().attr("id"));
    }
});


///////////////////
// MUSIC LISTING //
///////////////////

var videoIdListAlreadyAdded = [];

socket.on("retrieveMusic", function(musicList) {
    if (musicList.length == 0) {
        videoIdListAlreadyAdded = [""];

        $("#loungeVotingMusicListBox > .musicList").html("<p class='loungeVotingNoMusic'>Aucune musique</p>");
    } else {
        for (var i = 0; i < musicList.length; i++) {
            videoIdListAlreadyAdded.push(musicList[i].videoId);

            if (musicList[i].score > 0) {
                var score = "<div class='loungeVotingScore' style='color: #2ecc71;'>" + musicList[i].score + "</div>";
            } else if (musicList[i].score < 0) {
                var score = "<div class='loungeVotingScore' style='color: #e74c3c;'>" + musicList[i].score + "</div>";
            } else {
                var score = "<div class='loungeVotingScore'>" + musicList[i].score + "</div>";
            }

            if (isUserHost) {
                $(".loungeHostingSpeakers > .musicList").append("<div class='loungeHostingVideoAndTitleBox' id='" + musicList[i].videoId + "'>" +
                    "<img class='loungeHostingThumbnail' src='" + musicList[i].thumbnailLink + "'/>" +
                    "<div class='loungeHostingDeleteButton'></div>" +
                    "<div class='loungeHostingDuration'>" + musicList[i].duration + "</div>" +
                    "<div class='loungeHostingVideoTitle'>" + musicList[i].title + "</div>" +
                    "<div class='loungeHostingVoteBox'>" +
                    "<div class='loungeHostingUpVote'></div>" +
                    score +
                    "<div class='loungeHostingDownVote'></div>" +
                    "</div>" +
                    "</div>");
            } else if (isUserConnected) {
                $("#loungeVotingMusicListBox > .musicList").append("<div class='loungeVotingVideoAndTitleBox' id='" + musicList[i].videoId + "'>" +
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
    }
});

socket.on("retrieveNewMusic", function(videoInfo) {
    $("#loungeVotingSearchResult").find("#" + videoInfo.videoId + " > .loungeVotingAdd").addClass("loungeVotingAddActive");

    if (isUserHost) {
        if ($(".loungeHostingSpeakers > .musicList").find(".loungeHostingNoMusic").length == 1) {
            $(".loungeHostingSpeakers .loungeHostingNoMusic").hide("slow", function() {
                $(this).remove();
                player.loadVideoById(videoInfo.videoId);
            });
        }

        $(".loungeHostingSpeakers > .musicList").append("<div class='loungeHostingVideoAndTitleBox' id='" + videoInfo.videoId + "' style='opacity: 0;'>" +
            "<img class='loungeHostingThumbnail' src='" + videoInfo.thumbnailLink + "'/>" +
            "<div class='loungeHostingDeleteButton'></div>" +
            "<div class='loungeHostingDuration'>" + videoInfo.duration + "</div>" +
            "<div class='loungeHostingVideoTitle'>" + videoInfo.title + "</div>" +
            "<div class='loungeHostingVoteBox'>" +
            "<div class='loungeHostingUpVote'></div>" +
            "<div class='loungeHostingScore' style='color: #2ecc71;'>" + videoInfo.score + "</div>" +
            "<div class='loungeHostingDownVote'></div>" +
            "</div>" +
            "</div>");
        $(".loungeHostingSpeakers > .musicList div[style='opacity: 0;']").animate({ "opacity": "1" }, "slow");
    } else if (isUserConnected) {
        if ($("#loungeVotingMusicListBox > .musicList").find(".loungeVotingNoMusic").length == 1) {
            $("#loungeVotingMusicListBox .loungeVotingNoMusic").hide("slow", function() {
                $(this).remove();
            });
        }

        $("#loungeVotingMusicListBox > .musicList").append("<div class='loungeVotingVideoAndTitleBox' id='" + videoInfo.videoId + "' style='opacity: 0;'>" +
            "<img class='loungeVotingThumbnail' src='" + videoInfo.thumbnailLink + "'/>" +
            "<div class='loungeVotingDuration'>" + videoInfo.duration + "</div>" +
            "<div class='loungeVotingVideoTitle'>" + videoInfo.title + "</div>" +
            "<div class='loungeVotingVoteBox'>" +
            "<div class='loungeVotingUpVote'></div>" +
            "<div class='loungeVotingScore' style='color: #2ecc71;'>" + videoInfo.score + "</div>" +
            "<div class='loungeVotingDownVote'></div>" +
            "</div>" +
            "</div>");
        $("#loungeVotingMusicListBox > .musicList div[style='opacity: 0;']").animate({ "opacity": "1" }, "slow");
    }

});

socket.on("retrieveNewLikedMusic", function(videoId) {
    if (isUserHost) {
        $(".loungeHostingSpeakers > .musicList").find("#" + videoId + " > .loungeHostingVoteBox > .loungeHostingDownVote").removeClass("loungeHostingDownVoteActive");
        $(".loungeHostingSpeakers > .musicList").find("#" + videoId + " > .loungeHostingVoteBox > .loungeHostingUpVote").addClass("loungeHostingUpVoteActive");
    } else if (isUserConnected) {
        $("#loungeVotingMusicListBox > .musicList").find("#" + videoId + " > .loungeVotingVoteBox > .loungeVotingDownVote").removeClass("loungeVotingDownVoteActive");
        $("#loungeVotingMusicListBox > .musicList").find("#" + videoId + " > .loungeVotingVoteBox > .loungeVotingUpVote").addClass("loungeVotingUpVoteActive");
    }
});

socket.on("retrieveNewDislikedMusic", function(videoId) {
    if (isUserHost) {
        $(".loungeHostingSpeakers > .musicList").find("#" + videoId + " > .loungeHostingVoteBox > .loungeHostingUpVote").removeClass("loungeHostingUpVoteActive");
        $(".loungeHostingSpeakers > .musicList").find("#" + videoId + " > .loungeHostingVoteBox > .loungeHostingDownVote").addClass("loungeHostingDownVoteActive");
    } else if (isUserConnected) {
        $("#loungeVotingMusicListBox > .musicList").find("#" + videoId + " > .loungeVotingVoteBox > .loungeVotingUpVote").removeClass("loungeVotingUpVoteActive");
        $("#loungeVotingMusicListBox > .musicList").find("#" + videoId + " > .loungeVotingVoteBox > .loungeVotingDownVote").addClass("loungeVotingDownVoteActive");
    }
});

socket.on("retrieveLikedAndDislikedMusic", function(likedAndDislikedMusic) {
    for (var i = 0; i < likedAndDislikedMusic.likedMusic.length; i++) {
        $("#loungeVotingMusicListBox > .musicList").find("#" + likedAndDislikedMusic.likedMusic[i] + " > .loungeVotingVoteBox > .loungeVotingUpVote").addClass("loungeVotingUpVoteActive");
    }

    for (var i = 0; i < likedAndDislikedMusic.dislikedMusic.length; i++) {
        $("#loungeVotingMusicListBox > .musicList").find("#" + likedAndDislikedMusic.dislikedMusic[i] + " > .loungeVotingVoteBox > .loungeVotingDownVote").addClass("loungeVotingDownVoteActive");
    }

});

socket.on("musicRemoved", function(videoId) {
    if (isUserHost) {
        $("#loungeHostingLeftSpeaker").find("#" + videoId).hide("slow", function() {
            if (player.getVideoData().video_id === $("#loungeHostingLeftSpeaker > .musicList > div:first-child").attr("id") && $("#loungeHostingLeftSpeaker > .musicList > div").length != 0 && videoId == player.getVideoData().video_id) {
                player.loadVideoById($("#loungeHostingLeftSpeaker > .musicList > div:nth-child(2)").attr("id"));
            }
            
            if (player.getVideoData().video_id === $("#loungeHostingLeftSpeaker > .musicList > div:first-child").attr("id") && $("#loungeHostingLeftSpeaker > .musicList > div").length == 0) {
                player.loadVideoById("");
            }

            $(this).remove();

            if ($("#loungeHostingLeftSpeaker > .musicList > div").length == 0) {
                $("#loungeHostingLeftSpeaker > .musicList").append("<p class='loungeHostingNoMusic' style='opacity: 0;'>Aucune musique</p>");
                $("#loungeHostingLeftSpeaker > .musicList p[style='opacity: 0;']").animate({ "opacity": "1" }, "slow");
            }
        });
    } else if (isUserConnected) {
        $("#loungeVotingMusicListBox").find("#" + videoId).hide("slow", function() {
            $(this).remove();

            if ($("#loungeVotingMusicListBox > .musicList > div").length == 0) {
                $("#loungeVotingMusicListBox > .musicList").append("<p class='loungeVotingNoMusic' style='opacity: 0;'>Aucune musique</p>");
                $("#loungeVotingMusicListBox > .musicList p[style='opacity: 0;']").animate({ "opacity": "1" }, "slow");
            }
        });

        $("#loungeVotingSearchResult").find("#" + videoId + " > .loungeVotingAdd").removeClass("loungeVotingAddActive");

        if (videoIdListAlreadyAdded.indexOf(videoId) != -1) {
            videoIdListAlreadyAdded.splice(videoIdListAlreadyAdded.indexOf(videoId), 1);
        }
    }
});

//////////
// VOTE //
//////////

$("#loungeVotingMusicListBox > .musicList").on("click", ".loungeVotingUpVote", function() {
    if (!$(this).hasClass("loungeVotingUpVoteActive")) {
        $(this).addClass("loungeVotingUpVoteActive");
        socket.emit("upVote", $(this).parent().parent().attr("id"));
    } else {
        $(this).removeClass("loungeVotingUpVoteActive");
        socket.emit("cancelVote", $(this).parent().parent().attr("id"));
    }
});

$("#loungeVotingMusicListBox > .musicList").on("click", ".loungeVotingDownVote", function() {
    if (!$(this).hasClass("loungeVotingDownVoteActive")) {
        $(this).addClass("loungeVotingDownVoteActive");
        socket.emit("downVote", $(this).parent().parent().attr("id"));
    } else {
        $(this).removeClass("loungeVotingDownVoteActive");
        socket.emit("cancelVote", $(this).parent().parent().attr("id"));
    }
});


$(".loungeHostingSpeakers > .musicList").on("click", ".loungeHostingUpVote", function() {
    if (!$(this).hasClass("loungeHostingUpVoteActive")) {
        $(this).addClass("loungeHostingUpVoteActive");
        socket.emit("upVote", $(this).parent().parent().attr("id"));
    } else {
        $(this).removeClass("loungeHostingUpVoteActive");
        socket.emit("cancelVote", $(this).parent().parent().attr("id"));
    }
});

$(".loungeHostingSpeakers > .musicList").on("click", ".loungeHostingDownVote", function() {
    if (!$(this).hasClass("loungeHostingDownVoteActive")) {
        $(this).addClass("loungeHostingDownVoteActive");
        socket.emit("downVote", $(this).parent().parent().attr("id"));
    } else {
        $(this).removeClass("loungeHostingDownVoteActive");
        socket.emit("cancelVote", $(this).parent().parent().attr("id"));
    }
});


socket.on("addScore", function(videoIdAndScore) {
    if (isUserHost) {
        var actualScore = parseInt($(".loungeHostingSpeakers > .musicList").find("#" + videoIdAndScore.videoId + " > .loungeHostingVoteBox > .loungeHostingScore").text());
        $(".loungeHostingSpeakers > .musicList").find("#" + videoIdAndScore.videoId + " > .loungeHostingVoteBox > .loungeHostingScore").text(actualScore + videoIdAndScore.scoreToAdd);

        if (actualScore + videoIdAndScore.scoreToAdd > 0) {
            $(".loungeHostingSpeakers > .musicList").find("#" + videoIdAndScore.videoId + " > .loungeHostingVoteBox > .loungeHostingScore").css("color", "#2ecc71");
        } else if (actualScore + videoIdAndScore.scoreToAdd < 0) {
            $(".loungeHostingSpeakers > .musicList").find("#" + videoIdAndScore.videoId + " > .loungeHostingVoteBox > .loungeHostingScore").css("color", "#e74c3c");
        } else if (actualScore + videoIdAndScore.scoreToAdd == 0) {
            $(".loungeHostingSpeakers > .musicList").find("#" + videoIdAndScore.videoId + " > .loungeHostingVoteBox > .loungeHostingScore").css("color", "#7f8c8d");
        }
    } else if (isUserConnected) {
        var actualScore = parseInt($("#loungeVotingMusicListBox > .musicList").find("#" + videoIdAndScore.videoId + " > .loungeVotingVoteBox > .loungeVotingScore").text());
        $("#loungeVotingMusicListBox > .musicList").find("#" + videoIdAndScore.videoId + " > .loungeVotingVoteBox > .loungeVotingScore").text(actualScore + videoIdAndScore.scoreToAdd);
        if (actualScore + videoIdAndScore.scoreToAdd > 0) {
            $("#loungeVotingMusicListBox > .musicList").find("#" + videoIdAndScore.videoId + " > .loungeVotingVoteBox > .loungeVotingScore").css("color", "#2ecc71");
        } else if (actualScore + videoIdAndScore.scoreToAdd < 0) {
            $("#loungeVotingMusicListBox > .musicList").find("#" + videoIdAndScore.videoId + " > .loungeVotingVoteBox > .loungeVotingScore").css("color", "#e74c3c");
        } else if (actualScore + videoIdAndScore.scoreToAdd == 0) {
            $("#loungeVotingMusicListBox > .musicList").find("#" + videoIdAndScore.videoId + " > .loungeVotingVoteBox > .loungeVotingScore").css("color", "#7f8c8d");
        }
    }
});

socket.on("minusScore", function(videoIdAndScore) {
    if (isUserHost) {
        var actualScore = parseInt($(".loungeHostingSpeakers > .musicList").find("#" + videoIdAndScore.videoId + " > .loungeHostingVoteBox > .loungeHostingScore").text());
        $(".loungeHostingSpeakers > .musicList").find("#" + videoIdAndScore.videoId + " > .loungeHostingVoteBox > .loungeHostingScore").text(actualScore - videoIdAndScore.scoreToMinus);

        if (actualScore - videoIdAndScore.scoreToMinus > 0) {
            $(".loungeHostingSpeakers > .musicList").find("#" + videoIdAndScore.videoId + " > .loungeHostingVoteBox > .loungeHostingScore").css("color", "#2ecc71");
        } else if (actualScore - videoIdAndScore.scoreToMinus < 0) {
            $(".loungeHostingSpeakers > .musicList").find("#" + videoIdAndScore.videoId + " > .loungeHostingVoteBox > .loungeHostingScore").css("color", "#e74c3c");
        } else if (actualScore - videoIdAndScore.scoreToMinus == 0) {
            $(".loungeHostingSpeakers > .musicList").find("#" + videoIdAndScore.videoId + " > .loungeHostingVoteBox > .loungeHostingScore").css("color", "#7f8c8d");
        }
    } else if (isUserConnected) {
        var actualScore = parseInt($("#loungeVotingMusicListBox > .musicList").find("#" + videoIdAndScore.videoId + " > .loungeVotingVoteBox > .loungeVotingScore").text());
        $("#loungeVotingMusicListBox > .musicList").find("#" + videoIdAndScore.videoId + " > .loungeVotingVoteBox > .loungeVotingScore").text(actualScore - videoIdAndScore.scoreToMinus);

        if (actualScore - videoIdAndScore.scoreToMinus > 0) {
            $("#loungeVotingMusicListBox > .musicList").find("#" + videoIdAndScore.videoId + " > .loungeVotingVoteBox > .loungeVotingScore").css("color", "#2ecc71");
        } else if (actualScore - videoIdAndScore.scoreToMinus < 0) {
            $("#loungeVotingMusicListBox > .musicList").find("#" + videoIdAndScore.videoId + " > .loungeVotingVoteBox > .loungeVotingScore").css("color", "#e74c3c");
        } else if (actualScore - videoIdAndScore.scoreToMinus == 0) {
            $("#loungeVotingMusicListBox > .musicList").find("#" + videoIdAndScore.videoId + " > .loungeVotingVoteBox > .loungeVotingScore").css("color", "#7f8c8d");
        }
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
        $("#loungeVotingSearchResult").html("");
        $(".musicList").html("");
        $(".chat").html("");
        $(".userList").html("");
        videoIdListAlreadyAdded = [];
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
    $("#errorBox").append("<div class='errorMessage' style='display: none;'>Vous avez repris la session en tant que : " + userName + "</div>");
    $("#errorBox .errorMessage:hidden").show("slow");

    setTimeout(function() {
        $("#errorBox").children("div:first").hide("slow", function() {
            $(this).remove();
        });
    }, 4500);
});
