<div id="loungeVoting" class="loungeVotingHided">
	<div id="loungeVotingMainBox">
		<div id="loungeVotingConnectedAs">Connect&eacute;(e) en tant que : <span id="loungeVotingUserName"></span> dans le salon : <span id="loungeVotingActualLoungeName"></span></div>
		
		<div id="loungeVotingContainerBox">
			<div id="loungeVotingButtons">
				<div id="loungeVotingAddMusicButton">
					<div id="loungeVotingAddMusicImage" class="loungeVotingAddMusicImageActive"></div>
				</div>
				<div id="loungeVotingMusicListButton">
					<div id="loungeVotingMusicListImage"></div>
				</div>
				<div id="loungeVotingChatButton">
					<div id="loungeVotingChatImage"></div>
				</div>
				<div id="loungeVotingUserListButton">
					<div id="loungeVotingUserListImage"></div>
				</div>
			</div>
			<div id="loungeVotingContentBox">
				<div id="loungeVotingAddMusicBox" class="loungeVotingAddMusicBoxActive">
					<form onsubmit="return(false)">
						<input type="text" id="loungeVotingSearchInput"/>
						<button id="loungeVotingSearchButton" type="submit">Rechercher</button>
					</form>
					<div id="loungeVotingSearchResult">
					</div>
				</div>

				<div id="loungeVotingMusicListBox">
					<div class="musicList">				
					</div>
				</div>

				<div id="loungeVotingChatBox">
					<div class="chat">
					</div>
					<form class="chatForm" onsubmit="return(false)">	
						<input type="text" class="chatInputMessage" placeholder="Message" autocomplete="off"/><br/>
						<button class="chatSendButton" type="submit">Envoyer</button>
					</form>
				</div>

				<div id="loungeVotingUserListBox">
					<p>Utilisateurs connectés :</p>
					<ul class="userList">
					</ul>
				</div>
			</div>
		</div>
		
		<div id="loungeVotingBack">Quitter le salon</div>
	</div>

</div>