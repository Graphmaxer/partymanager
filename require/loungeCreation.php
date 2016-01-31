<div id="loungeCreation" class="loungeCreationHided">
	<h1>Création d'un salon</h1>
	<form onsubmit="return(false)">
		<div class="loungeCreationField">
			<label for="loungeName">Nom du salon : </label>
			<input type="text" id="loungeCreationName" required/>
		</div>

		<div class="loungeCreationField">
			<label for="loungePassword">Mot de passe du salon : </label>
			<input type="password" id="loungeCreationPassword" required/>
		</div>

		<div class="loungeCreationField">
			<label for="loungeDescription">Courte description du salon (optionnelle) :</label><br/>
			<input type="text" id="loungeCreationDescription"></input>
		</div>

		<button id="loungeCreationButton" type="submit">Créer le salon</button>
	</form>

	<div id="loungeCreationBack">Retour</div>
</div>