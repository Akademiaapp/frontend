<script lang="ts">
	import { userInfo } from '@/api/apiStore';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from './ui/button';
	import { LogOut, Settings, User } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import { supabase } from '@/supabaseClient';
	export let name = false;

	let interval;

	onMount(() => {
		setTimeout(() => {
			interval = setInterval(() => {
				if (!$userInfo) location.reload();
				if (!$userInfo.first_name || $userInfo.first_name == 'undefined') {
					location.reload();
				}
			}, 1000);
		}, 5000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="cage">
	<DropdownMenu.Root portal={null}>
		<DropdownMenu.Trigger asChild let:builder>
			<Button builders={[builder]} variant="link" class="p-0">
				<div class="avatar br-2 grid place-items-center bg-primary text-primary-foreground">
					{#if $userInfo}
						<h3 class="m-0 -translate-y-[0.05rem] p-0 text-base">
							{$userInfo.first_name[0]}{$userInfo.last_name[0] || ''}
						</h3>
					{/if}
				</div>
				<!-- <img class="avatar br-2" src="" alt="User avatar" referrerpolicy="no-referrer" /> -->
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-60">
			<DropdownMenu.Label>My Account</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Group>
				<DropdownMenu.Item on:click={() => goto('/settings')}>
					<Settings class="h-4 w-4" />
					<span>Settings</span>
				</DropdownMenu.Item>
				<DropdownMenu.Item on:click={() => goto('/settings/account')}>
					<User class="h-4 w-4" />
					<span>Profile</span>
				</DropdownMenu.Item>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<!-- <DropdownMenu.Item
				on:click={() => {
					window.location.href = 'https://github.com/akademiaapp/';
				}}
			>
				<Github class="h-4 w-4" />
				<span>GitHub</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item
				on:click={() => {
					window.location.href = 'https://akademia-status.arctix.dev/';
				}}
			>
				<Cloud class="h-4 w-4" />
				<span>API Status</span>
			</DropdownMenu.Item>
			<DropdownMenu.Separator /> -->
			<DropdownMenu.Item
				on:click={() => {
					supabase.auth.signOut({ scope: 'local' });
					goto('/onboarding/login');
				}}
			>
				<LogOut class="h-4 w-4" />
				<span>Log out</span>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	{#if name && $userInfo}
		<p>
			{$userInfo.first_name}
		</p>
	{/if}
</div>

<style lang="scss">
	p {
		margin: 0;
		font-weight: bold;
		color: var(--color-text-1);
	}
	.cage {
		display: flex;
		gap: 0.75rem;
		justify-self: center;
		align-items: center;
	}
	.avatar {
		width: 2rem;
		height: 2rem;
		cursor: pointer;
		overflow: hidden;
	}
</style>
