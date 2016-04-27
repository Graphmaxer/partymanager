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

		echo'<div class="loungeVotingVideoAndTitleBox">';
			echo '<img class="videoThumbnail" src="'.$thumbnailLink.'"/>';
			echo'<h2 class="VideoTitle">Titre de la vidéo</h2>';
			echo '<div class="loungeVotingNombreVue">20 000</div>';
			echo '<div class="loungeVotingUpVote">1500/</div>';
			echo '<div class="loungeVotingDownVote"> 13</div>';
			echo '<div class="loungeVotingDuree">3.53</div>';
		echo'</div>';
	}
?>