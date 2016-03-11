$("#searchInput").on("input", function() {
	var searchKeyword = $(this).val();

	$.post("script/search.php", { searchInput: searchKeyword }, function (data) {
		$("#searchResult").html(data);
	});
});