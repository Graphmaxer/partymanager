<?php

	require_once("../ignored/apiKey.php");
	
	if (isset($_POST["pageToken"])) {
		$pageToken = $_POST["pageToken"];
	}
	else {
		$pageToken = "";
	}

	$noResult = false;

	$videoIdListAlreadyAdded = $_POST["videoIdListAlreadyAdded"];

	$search = htmlspecialchars(urlencode($_POST["searchInput"]));

	$jsonVideos = file_get_contents("https://www.googleapis.com/youtube/v3/search?key=".$apiKey."&part=snippet&type=video&q=".$search."&maxResults=10&pageToken=".$pageToken);

	$decodedJsonVideos = json_decode($jsonVideos);

	$resultsPerPage = $decodedJsonVideos -> {"pageInfo"} -> {"resultsPerPage"};

	$totalResults = $decodedJsonVideos -> {"pageInfo"} -> {"totalResults"};

	if ($totalResults == 0) {
		$resultsPerPage = 0;

		$nextPageToken = "";

		echo "<p id='loungeVotingNoResult'>Aucun résultat</p>";

		$noResult = true;
	}
	else {
		$nextPageToken = $decodedJsonVideos -> {"nextPageToken"};
	}

	for ($i = 0; $i < $resultsPerPage; $i++) {

		$videoId = $decodedJsonVideos -> {"items"}[$i] -> {"id"} -> {"videoId"};
		$thumbnailLink = $decodedJsonVideos -> {'items'}[$i] -> {'snippet'} -> {'thumbnails'} -> {'medium'} -> {'url'};
		$title = $decodedJsonVideos -> {"items"}[$i] -> {"snippet"} -> {"title"};

		$jsonVideoDuration = file_get_contents("https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=".$videoId."&key=".$apiKey);

		$decodedjsonVideoDuration = json_decode($jsonVideoDuration);

		$durationISO = $decodedjsonVideoDuration -> {"items"}[0] -> {"contentDetails"} -> {"duration"};

		$duration = new DateInterval($durationISO);


		echo '<div class="loungeVotingVideoAndTitleBox" id="'.$videoId.'" style="opacity: 0;">';
			echo '<img class="loungeVotingThumbnail" src="'.$thumbnailLink.'"/>';
			
			if ($duration->format('%H') == "00") {
				echo '<div class="loungeVotingDuration">'.$duration->format('%I:%S').'</div>';
			}
			else {
				echo '<div class="loungeVotingDuration">'.$duration->format('%H:%I:%S').'</div>';
			}

			echo '<div class="loungeVotingVideoTitle">'.$title.'</div>';

			if (in_array($videoId, $videoIdListAlreadyAdded)) {
				echo '<div class="loungeVotingAdd loungeVotingAddActive">';
			}
			else {
				echo '<div class="loungeVotingAdd">';
			}
			
			echo '</div>';
		echo '</div>';
	}

	if ($noResult == false) {
		echo "<div id='loungeVotingMore' class=".$nextPageToken." style='opacity: 1;'>Voir plus ...</div>";
	}
	
?>