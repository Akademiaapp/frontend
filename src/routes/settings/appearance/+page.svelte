<script>
	import { themeVariant } from '../../store';

	let selectedTheme = 'light'; // default value

	function handleThemeChange() {
		console.log(selectedTheme); // logs the current selected value
		themeVariant.set(selectedTheme);
	}
</script>

<h2>Themes</h2>

<div class="theme-selection flex gap-6">
	<label>
		<input type="radio" value="light" bind:group={selectedTheme} on:change={handleThemeChange} />
		<div class="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
			<div class="flex gap-2 rounded-sm bg-[#ecedef] p-2">
				<div class="w-10 space-y-2 rounded-md bg-white p-2">
					<div class="h-2 w-full rounded-lg bg-[#ecedef]"></div>
					<div class="h-2 w-full rounded-lg bg-[#ecedef]"></div>
				</div>
				<div class="space-y-2">
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
		</div>
		Light
	</label>

	<label>
		<input type="radio" value="dark" bind:group={selectedTheme} on:change={handleThemeChange} />
		<div
			class="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground"
		>
			<div class="flex gap-2 rounded-sm bg-slate-950 p-2">
				<div class="w-10 space-y-2 rounded-md bg-slate-800 p-2">
					<div class="h-2 w-full rounded-lg bg-slate-400"></div>
					<div class="h-2 w-full rounded-lg bg-slate-400"></div>
				</div>
				<div class="space-y-2">
					<div class="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
						<div class="h-2 w-[80px] rounded-lg bg-slate-400" />
						<div class="h-2 w-[100px] rounded-lg bg-slate-400" />
					</div>
					<div class="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
						<div class="h-4 w-4 rounded-full bg-slate-400" />
						<div class="h-2 w-[100px] rounded-lg bg-slate-400" />
					</div>
					<div class="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
						<div class="h-4 w-4 rounded-full bg-slate-400" />
						<div class="h-2 w-[100px] rounded-lg bg-slate-400" />
					</div>
				</div>
			</div>
		</div>
		<span class="block w-full p-2 text-center font-normal"> Dark </span></label
	>
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
