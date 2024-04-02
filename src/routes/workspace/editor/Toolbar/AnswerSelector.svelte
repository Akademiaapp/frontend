<script lang="ts">
    import Check from "lucide-svelte/icons/check";
    import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
    import { tick } from "svelte";
    import * as Command from "$lib/components/ui/command/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { cn } from "$lib/utils.js";
	import { ChevronLeft, ChevronRight } from "lucide-svelte";
   
    const answers = [
      {
        value: "jonathan",
        label: "Jonathan"
      },
      {
        value: "next.js",
        label: "Elliott"
      },
      {
        value: "nuxt.js",
        label: "Johannes"
      },
      {
        value: "remix",
        label: "Aron"
      },
      {
        value: "astro",
        label: "Åbenrå"
      }
    ];
   
    let open = false;
    let value = "";
   
    $: selectedValue =
      answers.find((f) => f.value === value)?.label ?? "Vælg en elev...";
   
    // We want to refocus the trigger button when the user selects
    // an item from the list so users can continue navigating the
    // rest of the form with the keyboard.
    function closeAndFocusTrigger(triggerId: string) {
      open = false;
      tick().then(() => {
        document.getElementById(triggerId)?.focus();
      });
    }
</script>

<div class="flex gap-1">
    <Button variant="outline" class="w-10 h-10 p-0">
        <ChevronLeft size="24" />
    </Button>
    <Popover.Root bind:open let:ids>
        <Popover.Trigger asChild let:builder>
            <Button
            builders={[builder]}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            class="w-[145px] justify-between"
            >
            {selectedValue}
            <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </Popover.Trigger>
        <Popover.Content class="w-[200px] p-0">
            <Command.Root>
            <Command.Input placeholder="Søg efter elev..." />
            <Command.Empty>Ingen elev fundet.</Command.Empty>
            <Command.Group>
                {#each answers as answer}
                <Command.Item
                    value={answer.value}
                    onSelect={(currentValue) => {
                    value = currentValue;
                    closeAndFocusTrigger(ids.trigger);
                    }}
                >
                    <Check
                    class={cn(
                        "mr-2 h-4 w-4",
                        value !== answer.value && "text-transparent"
                    )}
                    />
                    {answer.label}
                </Command.Item>
                {/each}
            </Command.Group>
            </Command.Root>
        </Popover.Content>
    </Popover.Root>
    <Button variant="outline" class="w-10 h-10 p-0">
        <ChevronRight size="24" />
    </Button>
</div>