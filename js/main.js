// Disable tab key
$(document).keydown(function(objEvent) {
    if (objEvent.keyCode == 9 && isUserConnected) {
        objEvent.preventDefault();
    }
});

$('body').bind('touchmove', function(ev) {
    ev.preventDefault();
});

//////////
// HOME //
//////////

$("#createLoungeButton").click(function() {
    $("#home").addClass("homeHided");
    $("#loungeCreation").removeClass("loungeCreationHided");
});

$("#joinLoungeButton").click(function() {
    $("#home").addClass("homeHided");
    $("#joinLounge").removeClass("joinLoungeHided");
});


/////////////////////
// LOUNGE CREATION //
/////////////////////

$("#loungeCreationBack").click(function() {
    $("#home").removeClass("homeHided");
    $("#loungeCreation").addClass("loungeCreationHided");
});


////////////////////
// LOUNGE HOSTING //
////////////////////

$("#loungeHostingRightChatImage").click(function() {
    $("#loungeHostingRightUserImage").removeClass("loungeHostingRightUserImageActive");
    $("#loungeHostingRightChatImage").addClass("loungeHostingRightChatImageActive");
    $("#loungeHostingUserListBox").addClass("loungeHostingUserListBoxHided");
    $("#loungeHostingChatBox").removeClass("loungeHostingChatBoxHided");
});

$("#loungeHostingRightUserImage").click(function() {
    $("#loungeHostingRightChatImage").removeClass("loungeHostingRightChatImageActive");
    $("#loungeHostingRightUserImage").addClass("loungeHostingRightUserImageActive");
    $("#loungeHostingChatBox").addClass("loungeHostingChatBoxHided");
    $("#loungeHostingUserListBox").removeClass("loungeHostingUserListBoxHided");
});


////////////
// VIDEO  //
////////////

var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player("loungeHostingVideo", {
        playerVars: { "rel": 0, "autoplay": 1, "iv_load_policy": 3 },
        events: {
            "onStateChange": onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {
    if (event.data === 0) {
        socket.emit("removeMusic", player.getVideoData().video_id);
    }
}


/////////////////
// JOIN LOUNGE //
/////////////////

$("#joinLoungeBack").click(function() {
    $("#home").removeClass("homeHided");
    $("#joinLounge").addClass("joinLoungeHided");
});


///////////////////
// LOUNGE VOTING //
///////////////////

$("#loungeVotingButtons div div").click(function() {
    $("#loungeVotingButtons div div").removeClass();
    $(this).addClass($(this).attr("id") + "Active");

    $("#loungeVotingContentBox > div").removeClass();
    $("#loungeVotingContentBox").find("#" + $(this).attr("id").slice(0, -5) + "Box").addClass($(this).attr("id").slice(0, -5) + "BoxActive");
});
