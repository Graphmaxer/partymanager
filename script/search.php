<?php

	$apiKey = "AIzaSyCWgYLX8xehW16dSrgFnT99Z395EldfOLg";
	$pageToken = "";

	$search = htmlspecialchars(urlencode($_POST["searchInput"]));

	$jsonVideos = file_get_contents("https://www.googleapis.com/youtube/v3/search?key=".$apiKey."&part=snippet&type=video&q=".$search."&maxResults=10&pageToken=".$pageToken);

	$decodedJsonVideos = json_decode($jsonVideos);

	$resultsPerPage = $decodedJsonVideos -> {"pageInfo"} -> {"resultsPerPage"};

	$totalResults = $decodedJsonVideos -> {"pageInfo"} -> {"totalResults"};

	if ($totalResults == 0) {
		$resultsPerPage = 0;

		echo "<h1>Aucun résultat</h1>";
	}

	for ($i = 0; $i < $resultsPerPage; $i++) {

		$thumbnailLink = $decodedJsonVideos -> {'items'}[$i] -> {'snippet'} -> {'thumbnails'} -> {'medium'} -> {'url'};


		echo '<img class="videoThumbnail" src="'.$thumbnailLink.'"/>';

	}
?>