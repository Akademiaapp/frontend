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
	import { activeFile } from '../../../store';
	import type { FileInfo } from '@/api/apiStore';

	const api = getContext('api') as ApiHandler;

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

	interface Member {
		name: string;
		email: string;
		avatar: string;
		permission: {
			value: string;
			label: string;
		};
	}

	interface User {
		id: string;
		email: string;
		preferred_username: string;
		email_verified: boolean;
		signup_methods: string;
		given_name?: string | null;
		family_name?: string | null;
		middle_name?: string | null;
		nickname?: string | null;
		picture?: string | null;
		gender?: string | null;
		birthdate?: string | null;
		phone_number?: string | null;
		phone_number_verified?: boolean | null;
		roles?: string[];
		created_at: number;
		updated_at: number;
		is_multi_factor_auth_enabled?: boolean;
		app_data?: Record<string, any>;
		permission: string;
	}

	let people: Member[] = [];

	$: $activeFile && findMembers($activeFile);

	function findMembers(activeFile: FileInfo) {
		people = [];
		api.getMembers(activeFile?.id || '').then((response) => {
			response.json().then((members: User[]) => {
				console.log(members);
				members.forEach((member) => {
					// Only add people who arent already in the list
					if (people.find((person) => person.email == member.email)) return;
					people.push({
						name:
							member.given_name ||
							member.preferred_username ||
							member.nickname ||
							member.family_name ||
							member.middle_name ||
							member.email.split('@')[0],
						email: member.email,
						avatar: member.picture || '',
						permission: permissions[0]
					});
				});
				console.log(people);
			});
		});
	}
	function copyLinkToClipboard() {
		var copyText = document.getElementById('copy-link') as HTMLInputElement;
		copyText.select();
		copyText.setSelectionRange(0, 99999);
		navigator.clipboard.writeText(copyText.value);
	}

	function addUserToDocument() {
		if (!$activeFile) return;
		var email = (document.getElementById('invite-email') as HTMLInputElement).value;
		console.log(email);
		api.addUserToDocument($activeFile?.id, email).then((response) => {
			console.log(response);
		});
	}
</script>

<Dialog.Root>
	<Dialog.Trigger
		class={'br-2 toolbar-bar flex h-full px-4 py-2' + buttonVariants({ variant: 'floating' })}
	>
		<UserRoundPlus size={17} />
		<span class="text box-border overflow-hidden font-semibold leading-normal">Inviter</span>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Share '{$activeFile?.name || ''}'</Dialog.Title>
			<Dialog.Description>
				Only people you invite can access this document. You can change the permission of each
				person.
			</Dialog.Description>
		</Dialog.Header>
		<div class="flex space-x-2">
			<Input
				id="copy-link"
				value="https://app.akademia.cc/workspace/editor?id={$activeFile?.id || 'failure'}"
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
