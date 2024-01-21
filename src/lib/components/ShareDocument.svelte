<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
	import { UserRoundPlus } from "lucide-svelte";
  import { buttonVariants } from "$lib/components/ui/button";
</script>

<Dialog.Root>
  <Dialog.Trigger class={"br-2 absolute flex right-0 h-full toolbar-bar py-2 px-4"+buttonVariants({ variant: "floating" })}>
    <UserRoundPlus size={17} />
    <span class="font-semibold text leading-normal overflow-hidden box-border">Inviter</span>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
      <Dialog.Description>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </Dialog.Description>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>