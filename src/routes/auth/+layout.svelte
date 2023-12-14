<script>
	import { AuthorizerProvider } from '@authorizerdev/authorizer-svelte';
	import '@authorizerdev/authorizer-svelte/styles/default.css';
</script>

<main class="container">
	<div class="component-warpper">
		<AuthorizerProvider
			config={{
				authorizerURL: 'https://dashboard.akademia.cc',
				redirectURL: typeof window != 'undefined' ? window.location.origin : ``,
				client_id: 'b4da3a2f-76b7-4344-92de-3fb0d441a9c0'
			}}
		>
			<slot />
		</AuthorizerProvider>
	</div>
</main>

<style>
	main {
		font-family: -apple-system, system-ui, sans-serif;
		color: #374151;
		font-size: 14px;
	}
	.container {
		display: flex;
		height: 100vh;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.component-warpper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 400px;
		margin: 10px auto;
		border: 1px solid #d1d5db;
		padding: 25px 20px;
		border-radius: 5px;
	}
</style>
