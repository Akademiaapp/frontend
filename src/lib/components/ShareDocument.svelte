<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { UserRoundPlus } from 'lucide-svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Separator } from '$lib/components/ui/separator';
	import { getContext, onMount } from 'svelte';
	import type ApiHandler from '@/api';

	const api = getContext('api') as ApiHandler;

	export let activeFile: string;
	export let activeFilename: string;

	const permissions = [
		{
			value: 'view',
			label: 'Can view'
		},
		{
			value: 'edit',
			label: 'Can edit'
		}
	];

	let people = [
		{
			name: 'Sofia Davis',
			email: 'p@example.com',
			avatar: '/avatars/01.png',
			permission: permissions[0]
		}
	];

	const fullDocument = api.getDocument(activeFile).then((fullDocument) => {
		fullDocument.json().then((json) => {
			console.log('Fulldocument JSON', json);
		});
	});

	function copyLinkToClipboard() {
		var copyText = document.getElementById('copy-link') as HTMLInputElement;
		copyText.select();
		copyText.setSelectionRange(0, 99999);
		navigator.clipboard.writeText(copyText.value);
	}

	function addUserToDocument() {
		var email = (document.getElementById('invite-email') as HTMLInputElement).value;
		console.log(email);
		api.addUserToDocument(activeFile, email).then((response) => {
			console.log(response);
		});
	}
</script>

<Dialog.Root>
	<Dialog.Trigger
		class={'br-2 toolbar-bar absolute right-0 flex h-full px-4 py-2' +
			buttonVariants({ variant: 'floating' })}
	>
		<UserRoundPlus size={17} />
		<span class="text box-border overflow-hidden font-semibold leading-normal">Inviter</span>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Share '{activeFilename}'</Dialog.Title>
			<Dialog.Description>
				Only people you invite can access this document. You can change the permission of each
				person.
			</Dialog.Description>
		</Dialog.Header>
		<div class="flex space-x-2">
			<Input
				id="copy-link"
				value="https://app.akademia.cc/workspace/editor?id={activeFile}"
				readonly
			/>
			<Button variant="secondary" class="shrink-0" on:click={() => copyLinkToClipboard()}
				>Copy Link</Button
			>
		</div>
		<Separator class="my-4" />
		<div class="space-y-4">
			<h4 class="text-sm font-medium">Invite new people</h4>
			<div class="flex space-x-4">
				<Input placeholder="Email address" id="invite-email" />
				<Select.Root>
					<Select.Trigger class="w-[200px]">
						<Select.Value placeholder="Select" />
					</Select.Trigger>
					<Select.Content>
						{#each permissions as permission}
							<Select.Item value={permission.value} label={permission.label}
								>{permission.label}</Select.Item
							>
						{/each}
					</Select.Content>
				</Select.Root>
				<Button variant="secondary" on:click={() => addUserToDocument()}>Invite</Button>
			</div>
		</div>
		<div class="space-y-4">
			<h4 class="text-sm font-medium">People with access</h4>
			<div class="grid gap-6">
				{#each people as person}
					{@const name = person.name.split(' ')}
					<div class="flex items-center justify-between space-x-4">
						<div class="flex items-center space-x-4">
							<Avatar.Root>
								<Avatar.Image src={person.avatar} />
								<Avatar.Fallback>{name[0][0] + name[1][0]}</Avatar.Fallback>
							</Avatar.Root>
							<div>
								<p class="text-sm font-medium leading-none">
									{person.name}
								</p>
								<p class="text-sm text-muted-foreground">
									{person.email}
								</p>
							</div>
						</div>
						<Select.Root selected={person.permission}>
							<Select.Trigger class="ml-auto w-[110px]">
								<Select.Value placeholder="Select" />
							</Select.Trigger>
							<Select.Content>
								{#each permissions as permission}
									<Select.Item value={permission.value} label={permission.label}
										>{permission.label}</Select.Item
									>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
				{/each}
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
