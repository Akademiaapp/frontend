<script lang="ts">
	import { userInfo } from "@/api/apiStore";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { Button } from "./ui/button";
	import { CirclePlus, Cloud, CreditCard, Github, Keyboard, LifeBuoy, LogOut, Mail, MessageSquare, Plus, Settings, User, UserPlus, Users } from "lucide-svelte";
	import { keycloakState } from "../../authStore";
	import { goto } from "$app/navigation";
	export let name = false;
</script>

<div class="cage">
	<DropdownMenu.Root portal={null}>
		<DropdownMenu.Trigger asChild let:builder>
		    <Button builders={[builder]} variant="link" class="p-0">
				<img
				class="avatar br-2"
				src="https://gravatar.com/avatar/9d9ca268a5cc1b4399c88aaee589922a"
				alt="User avatar"
				referrerpolicy="no-referrer"
				/>
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-80">
			<DropdownMenu.Label>My Account</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Group>
			  <DropdownMenu.Item>
				<User class="mr-2 h-4 w-4" />
				<span>Profile</span>
			  </DropdownMenu.Item>
			  <DropdownMenu.Item>
				<CreditCard class="mr-2 h-4 w-4" />
				<span>Billing</span>
			  </DropdownMenu.Item>
			  <DropdownMenu.Item on:click={() => goto('/settings')}>
				<Settings class="mr-2 h-4 w-4" />
				<span>Settings</span>
			  </DropdownMenu.Item>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.Group>
			  <DropdownMenu.Item>
				<Users class="mr-2 h-4 w-4" />
				<span>Team</span>
			  </DropdownMenu.Item>
			  <DropdownMenu.Sub>
				<DropdownMenu.SubTrigger>
				  <UserPlus class="mr-2 h-4 w-4" />
				  <span>Invite users</span>
				</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent>
				  <DropdownMenu.Item>
					<Mail class="mr-2 h-4 w-4" />
					<span>Email</span>
				  </DropdownMenu.Item>
				  <DropdownMenu.Item>
					<MessageSquare class="mr-2 h-4 w-4" />
					<span>Message</span>
				  </DropdownMenu.Item>
				  <DropdownMenu.Item>
					<CirclePlus class="mr-2 h-4 w-4" />
					<span>More...</span>
				  </DropdownMenu.Item>
				</DropdownMenu.SubContent>
			  </DropdownMenu.Sub>
			  <DropdownMenu.Item>
				<Plus class="mr-2 h-4 w-4" />
				<span>New Team</span>
			  </DropdownMenu.Item>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>
			  <Github class="mr-2 h-4 w-4" />
			  <span>GitHub</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
			  <LifeBuoy class="mr-2 h-4 w-4" />
			  <span>Support</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
			  <Cloud class="mr-2 h-4 w-4" />
			  <span>API</span>
			</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item on:click={() => {$keycloakState.logout()}}>
			  <LogOut class="mr-2 h-4 w-4" />
			  <span>Log out</span>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	{#if name}
		<p>
			{$userInfo.name}
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
