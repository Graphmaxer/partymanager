$("#createLoungeButton").click(function() {
	$("#home").addClass("homeHided");
	$("#loungeCreation").removeClass("loungeCreationHided");
});

$("#loungeCreationBack").click(function() {
	$("#home").removeClass("homeHided");
	$("#loungeCreation").addClass("loungeCreationHided");
});





$("#joinLoungeButton").click(function() {
	$("#home").addClass("homeHided");
	$("#joinLounge").removeClass("joinLoungeHided");
});

$("#joinLoungeBack").click(function() {
	$("#home").removeClass("homeHided");
	$("#joinLounge").addClass("joinLoungeHided");
});