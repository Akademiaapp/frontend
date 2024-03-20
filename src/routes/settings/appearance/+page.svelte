<script>
	let selectedTheme = 'light'; // default value

	function handleThemeChange() {
		console.log(selectedTheme); // logs the current selected value
	}
</script>

<h2>Themes</h2>

<div class="theme-selection flex">
	<label>
		<input type="radio" value="light" bind:group={selectedTheme} on:change={handleThemeChange} />
		<div class="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
			<div class="space-y-2 rounded-sm bg-[#ecedef] p-2">
				<div class="space-y-2 rounded-md bg-white p-2 shadow-sm">
					<div class="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
					<div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
				</div>
				<div class="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
					<div class="h-4 w-4 rounded-full bg-[#ecedef]" />
					<div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
				</div>
				<div class="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
					<div class="h-4 w-4 rounded-full bg-[#ecedef]" />
					<div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
				</div>
			</div>
		</div>
		Light
	</label>

	<label>
		<input type="radio" value="dark" bind:group={selectedTheme} on:change={handleThemeChange} />
		Dark
	</label>

	<label>
		<input type="radio" value="blue" bind:group={selectedTheme} on:change={handleThemeChange} />
		Blue
	</label>
</div>

<style>
	input {
		display: none;
	}

	label {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	input:checked + div {
		border-color: hsl(var(--foreground));
	}
</style>
