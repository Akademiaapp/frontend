<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { UserRoundPlus } from 'lucide-svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Separator } from '$lib/components/ui/separator';
	import { currentFile } from '@/api/apiStore';
	import { page } from '$app/stores';
	import type { Tables } from '@/supabase.types';
	import { getDocumentMembers, inviteUserToDocument } from '@/api/helpers';

	const permissions = [
		{
			value: 'view',
			label: 'Kan se'
		},
		{
			value: 'edit',
			label: 'Kan redigere'
		},
		{
			value: 'owner',
			label: 'Ejer'
		}
	];

	interface Member {
		name: string;
		username: string;
		avatar: string;
		permission: {
			value: string;
			label: string;
		};
	}

	let people: Member[] = [];

	$: $currentFile && findMembers($currentFile);

	async function findMembers(activeFile: Tables<'document' | 'assignment' | 'assignment_answer'>) {
		people = [];

		const members = getDocumentMembers(activeFile.id);

		members.forEach((member) => {
			// Only add people who aren't already in the list
			if (people.find((person) => person.username == member.username)) return;
			people.push({
				name: member.full_name,
				username: member.username,
				avatar: member.avatar_url || '',
				permission: permissions[0]
			});
		});
		people = people;
	}

	function copyLinkToClipboard() {
		var copyText = document.getElementById('copy-link') as HTMLInputElement;
		copyText.select();
		copyText.setSelectionRange(0, 99999);
		navigator.clipboard.writeText(copyText.value);
	}

	function addUserToDocument() {
		if (!$currentFile) return;
		var username = (document.getElementById('invite-email') as HTMLInputElement).value;
		inviteUserToDocument(username, $currentFile.id);
	}

	export let open = false;

	export let showTrigger = true;
</script>

<Dialog.Root bind:open>
	{#if showTrigger}
		<Dialog.Trigger
			class={'br-2 toolbar-bar flex h-full px-4 py-2' + buttonVariants({ variant: 'floating' })}
		>
			<UserRoundPlus size={17} />
			<span class="text box-border overflow-hidden font-semibold leading-normal">Inviter</span>
		</Dialog.Trigger>
	{/if}
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Del '{$currentFile?.name || ''}'</Dialog.Title>
			<Dialog.Description>
				Kun personer, du inviterer, kan få adgang til dette dokument. Du kan ændre tilladelsen for
				hver person.
			</Dialog.Description>
		</Dialog.Header>
		<div class="flex space-x-2">
			<Input
				id="copy-link"
				value="https://{$page.url.host}/workspace/editor?id={$currentFile?.id || 'failure'}"
				readonly
			/>
			<Button variant="secondary" class="shrink-0" on:click={() => copyLinkToClipboard()}
				>Kopier link</Button
			>
		</div>
		<Separator class="my-4" />
		<div class="space-y-4">
			<h4 class="text-sm font-medium">Inviter nye personer</h4>
			<div class="flex space-x-4">
				<Input placeholder="Email address" id="invite-email" />
				<Select.Root>
					<Select.Trigger class="w-[200px]  text-nowrap">
						<Select.Value placeholder="Vælg" />
					</Select.Trigger>
					<Select.Content>
						{#each permissions as permission}
							<Select.Item value={permission.value} label={permission.label}
								>{permission.label}</Select.Item
							>
						{/each}
					</Select.Content>
				</Select.Root>
				<Button variant="secondary" on:click={() => addUserToDocument()}>Inviter</Button>
			</div>
		</div>
		<div class="space-y-4">
			<h4 class="text-sm font-medium">Personer med adgang</h4>
			<div class="grid gap-6">
				{#each people as person}
					{@const name = [person.name[0], person.name[1]]}
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
									{person.username}
								</p>
							</div>
						</div>
						<Select.Root selected={person.permission}>
							<Select.Trigger class="ml-auto w-[110px]">
								<Select.Value placeholder="Select" />
							</Select.Trigger>
							<Select.Content class="w-8">
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
