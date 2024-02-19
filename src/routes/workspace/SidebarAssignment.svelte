<script lang="ts">
	import QuickBar from './quickActions/QuickBar.svelte';
	import FileViewer from './FileViewer.svelte';
	import UserAvatar from '$lib/components/UserAvatar.svelte';
	export let sidebarVisible: boolean;
</script>

<nav class="sideBar" class:hidden={!sidebarVisible}>
	<div class="settings br-2 float-panel">
		<div class="top">
			<UserAvatar name />
			<button
				class="reset"
				on:click={() => {
					sidebarVisible = !sidebarVisible;
				}}
			>
				<span class="material-symbols-rounded icon-w-4">keyboard_double_arrow_left</span>
			</button>
		</div>
		<QuickBar />
	</div>

	<div class="settings assignment br-2 float-panel flex-1 overflow-scroll">
		<div>
			<h1>Matematik FP9</h1>
			<h2>Prøven med hjælpemidler - opgavehæfte</h2>
			<h3>Prøven varer 3 timer (180 minutter)</h3>
			<br />
			<p>K&aelig;re elev</p>
			<br />
			<p>Pr&oslash;ven best&aring;r af 7 opgaver. Du har 3 timer til at l&oslash;se dem.</p>
			<br />
			<p>
				Ved hver opgave st&aring;r der, hvor mange point den h&oslash;jst kan give.Pr&oslash;ven kan
				i alt h&oslash;jst give 60 point. Du bestemmer selv, hvilkenr&aelig;kkef&oslash;lge du laver
				opgaverne i, og hvor lang tid du vil bruge p&aring; hver af dem.
			</p>
			<br />
			<p>
				Det er vigtigt, at du begrunder dine svar i alle opgaver.Det betyder, at du i hver opgave
				skal vise eller forklare, hvordandu er n&aring;et frem til dit svar. Du kan fx begrunde dit
				svar med tekst,beregninger og/eller tegninger.
			</p>
			<br />
			<p>
				En del af de point, du kan f&aring; i hver opgave, kommer fra dine begrundelser.I de fleste
				opgaver kan du ikke f&aring; det h&oslash;jeste antal point, hvis du ikkebegrunder dit svar,
				selv om dine resultater er rigtige.
			</p>
			<br />
			<p>
				I nogle af opgaverne skal du beregne et antal eller en st&oslash;rrelse. I andreopgaver skal
				du vise, hvordan du finder frem til et bestemt resultat ellerafg&oslash;re, om en
				p&aring;stand er sand eller falsk.
			</p>
			<br />
			<p>
				Der er ogs&aring; opgaver, hvor du skal l&oslash;se et matematisk problem ved
				atunders&oslash;ge. I disse opgaver forventer vi ikke, at du p&aring; forh&aring;nd kender
				enmetode, du kan bruge til at l&oslash;se problemet. Ordet &rsquo;unders&oslash;g&rsquo;
				signalerer, at duselv skal finde p&aring; en god m&aring;de at l&oslash;se problemet
				p&aring; ved at bruge matematik,du kender.
			</p>
			<br />
			<p>God arbejdslyst.</p>
			<br />
			<p>Styrelsen for Undervisning og Kvalitet</p>
		</div>
	</div>
</nav>

<style lang="scss">
	.settings {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 1rem;
		flex-direction: column;
		background-color: var(--color-bg-1);
	}

	.sideBar {
		pointer-events: auto;
		resize: horizontal;
		width: 30rem;
		min-width: 10rem;
		max-width: 30rem;
		display: flex;
		gap: 0.75rem;
		flex-direction: column;

		&.hidden {
			button {
				span {
					rotate: 180deg;
				}

				position: sticky;
				left: 10px;

				transform: translate(4.5rem, -1rem);
			}
		}
	}

	.top {
		display: flex;

		align-items: center;

		justify-content: space-between;

		button {
			span {
				font-size: 2rem;

				transition: rotate 300ms ease;
				vertical-align: middle;
			}

			transition: all 100ms;

			background-color: var(--color-bg-1);

			padding: 0.25rem;

			color: var(--color-text-1);

			border-radius: 8px;

			&:hover {
				color: var(--color-text-0);
			}
		}
	}
</style>
