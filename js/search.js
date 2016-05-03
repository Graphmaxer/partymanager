$("#loungeVotingSearchButton").click(function() {
	var searchKeyword = $("#loungeVotingSearchInput").val();

	$.post("script/search.php", { searchInput: searchKeyword }, function (data) {
		$("#loungeVotingSearchResult").html(data);
	});
});