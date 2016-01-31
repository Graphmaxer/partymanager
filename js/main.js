$("#goToLoungeHostingTEMP").click(function() {
	$("#home").addClass("homeHided");
	$("#loungeHosting").removeClass("loungeHostingHided");
	$("#logo").addClass("logoReduced");
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


/////////////////
// JOIN LOUNGE //
/////////////////

$("#joinLoungeBack").click(function() {
	$("#home").removeClass("homeHided");
	$("#joinLounge").addClass("joinLoungeHided");
});