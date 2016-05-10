<div id="joinLounge" class="joinLoungeHided">
	<h1>Rejoindre un salon</h1>

	<div id="loungeList">
		
	</div>

	<div id="joinLoungeBack">Retour</div>

	<div id="passwordPopup" class="passwordPopupHided">
		<form onsubmit="return(false)">
			<div id="passwordPopupLoungeTitle">Rejoindre : <span id="passwordPopupLoungeName"></span></div>

			<label for="passwordPopupUserName">Nom : </label>
			<input type="text" id="passwordPopupUserName" pattern="[a-zA-Z0-9]+" maxlength="24" required/><br/>

			<label for="passwordPopupLoungePassword">Mot de passe : </label>
			<input type="password" id="passwordPopupLoungePassword" maxlength="49"/><br/>

			<button id="passwordPopupLoungeButton" type="submit">Rejoindre</button>

			<div id="passwordPopupLoungeBack">Annuler</div>
		</form>
	</div>

</div>