<?php

	$apiKey = "AIzaSyCWgYLX8xehW16dSrgFnT99Z395EldfOLg";
	$pageToken = "";

	$search = $_POST["searchInput"];

	$jsonVideos = file_get_contents("https://www.googleapis.com/youtube/v3/search?key=".$apiKey."&part=snippet&q=".$search."&maxResults=10&pageToken=".$pageToken);

	$decodedJsonVideos = json_decode($jsonVideos);

	$resultsPerPage = $decodedJsonVideos -> {"pageInfo"} -> {"resultsPerPage"};

	for ($i = 0; $i < $resultsPerPage; $i++) {

		$thumbnailLink = $decodedJsonVideos -> {'items'}[$i] -> {'snippet'} -> {'thumbnails'} -> {'medium'} -> {'url'};

		echo '<img class="video-thumbnail" src="'.$thumbnailLink.'"/>';
	}
?>