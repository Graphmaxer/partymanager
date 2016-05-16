<div id="loungeCreation" class="loungeCreationHided">
	<h1>Création d'un salon</h1>
	<form onsubmit="return(false)">
		<div class="loungeCreationField">
			<label for="loungeCreationName">Nom du salon : </label>
			<input type="text" id="loungeCreationName" pattern="[a-zA-Z0-9\u00C0-\u017F?! ]+" maxlength="24" required/>
		</div>

		<div class="loungeCreationField">
			<label for="loungeCreationHostName">Votre nom : </label>
			<input type="text" id="loungeCreationHostName" pattern="[a-zA-Z0-9\u00C0-\u017F?!]+" maxlength="24" required/>
		</div>

		<div class="loungeCreationField">
			<label for="loungeCreationPassword">Mot de passe du salon : </label>
			<input type="password" id="loungeCreationPassword" maxlength="49" required/>
		</div>

		<div class="loungeCreationField">
			<label for="loungeCreationDescription">Courte description du salon (optionnelle) :</label><br/>
			<input type="text" id="loungeCreationDescription" pattern="[a-zA-Z0-9\u00C0-\u017F?! ]+" maxlength="39"/>
		</div>

		<button id="loungeCreationButton" type="submit">Créer le salon</button>
	</form>

	<div id="loungeCreationBack">Retour</div>
</div>