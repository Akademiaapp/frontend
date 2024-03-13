<h1>Hvad er du?</h1>

<div class="flex flex-col gap-2">
	<input class="hidden" type="radio" id="option1" name="userType" value="option1" />
	<label for="option1">
		<div>
			Tester
			<p class="des">Optimalt for en jury som hurtigt vil få et overblik over Akademia</p>
		</div>
	</label>

	<input class="hidden" type="radio" id="option2" name="userType" value="option2" />
	<label for="option2">
		<img src="/illustrations/undraw_professor.svg" alt="A personal notebook" />
		Underviser</label
	>

	<input class="hidden" type="radio" id="option3" name="userType" value="option3" />
	<label for="option3">
		<img src="/illustrations/undraw_education.svg" alt="A personal notebook" />
		Elev</label
	>
</div>

<style lang="scss">
	label {
		cursor: pointer;

		display: flex;

		align-items: center;
		gap: 1rem;

		padding: 0.5rem 1rem;

		border-width: 1px;

		border-radius: 0.25rem;

		// box-sizing: border-box;

		img {
			aspect-ratio: 1;
			height: 3rem;
			width: auto;
		}

		.des {
			font-size: 0.75rem;
			color: var(--color-text-2);
		}
	}

	input[type='radio']:checked + label {
		/* color: #ff0000; Change this to the color you want */
		/* font-weight: bold; Add any other styles you want */

		border: solid 1px var(--color-accent-1);

		box-shadow: inset 0 0 0 1px var(--color-accent-1);

		// border: none;
	}
</style>
