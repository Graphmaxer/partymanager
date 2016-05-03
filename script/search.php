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

		$videoId = $decodedJsonVideos -> {"items"}[$i] -> {"id"} -> {"videoId"};
		$thumbnailLink = $decodedJsonVideos -> {'items'}[$i] -> {'snippet'} -> {'thumbnails'} -> {'medium'} -> {'url'};
		$title = $decodedJsonVideos -> {"items"}[$i] -> {"snippet"} -> {"title"};

		$jsonVideoDuration = file_get_contents("https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=".$videoId."&key=".$apiKey);

		$decodedjsonVideoDuration = json_decode($jsonVideoDuration);

		$durationISO = $decodedjsonVideoDuration -> {"items"}[0] -> {"contentDetails"} -> {"duration"};

		$duration = new DateInterval($durationISO);


		echo'<div class="loungeVotingVideoAndTitleBox">';
			echo '<img class="videoThumbnail" src="'.$thumbnailLink.'"/>';
			echo'<h2 class="VideoTitle">'.$title.'</h2>';

			if ($duration->format('%H') == "00") {
				echo '<div class="loungeVotingDuree">'.$duration->format('%I:%S').'</div>';
			}
			else {
				echo '<div class="loungeVotingDuree">'.$duration->format('%H:%I:%S').'</div>';
			}
		echo'</div>';
	}
?>