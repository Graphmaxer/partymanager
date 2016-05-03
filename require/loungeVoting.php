<div id="loungeVoting" class="loungeVotingHided">
	<div id="loungeVotingMainBox">
		<div id="loungeVotingConnectedAs">Connect&eacute;(e) en tant que : <span id="loungeVotingUserName"></span> dans le salon : <span id="loungeVotingActualLoungeName"></span></div>
		<div id="loungeVotingLeftBox">
			<input type="text" id="searchInput"/>
				<div id="searchResult">
				</div>
		</div>
		
		<div id="loungeVotingRightBox">
			<div id="loungeVotingRightButtons">
				<div id="loungeVotingRightChatButton">
					<div id="loungeVotingRightChatImage" class="loungeVotingRightChatImageActive"></div>
				</div>
				<div id="loungeVotingRightUserButton">
					<div id="loungeVotingRightUserImage"></div>
				</div>
			</div>
			<div id="loungeVotingChatUserBox">	
				<div id="loungeVotingChatBox">
					<div class="chat">
					</div>
					<form class="chatForm" onsubmit="return(false)">	
						<input type="text" class="chatInputMessage" placeholder="Message" autocomplete="off"/><br/>
						<button class="chatSendButton" type="submit">Envoyer</button>
					</form>
				</div>

				<div id="loungeVotingUserListBox" class="loungeVotingUserListBoxHided">
					<p>Utilisateurs connectés :</p>
					<ul class="userList">
					</ul>
				</div>
			</div>
		</div>
		
		<div id="loungeVotingBack">Quitter le salon</div>
	</div>

</div>