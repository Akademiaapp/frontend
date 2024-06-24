<script>
	import Button from "@/components/ui/button/button.svelte";
	import { Input } from "@/components/ui/input";
	import { supabase } from "@/supabase/supabaseClient";

    let email = '';

    function handleSubmit() {
        supabase.auth.resetPasswordForEmail(email);
    }
</script>

<div
	class="container relative hidden flex-1 flex-col items-start justify-center bg-background p-0 md:grid lg:max-w-none lg:px-0"
>
	<div class="lg:p-8 h-full">
		<div class="mx-auto flex w-full flex-col justify-between space-y-6 sm:w-[350px] h-full">
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">Login</h1>
				<p class="text-sm text-muted-foreground">
					Enter your email below to reset your password.
				</p>
			</div>
            <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-3 pb-12">
                <Input type="email" id="email" bind:value={email} required placeholder="name@example.com" />
                <Button type="submit">Reset password</Button>
            </form>
            <p class="px-8 text-center text-sm text-muted-foreground">
                Don't have an account? <a href="/onboarding/signup" class="underline underline-offset-4 hover:text-primary">Sign up</a>
            </p>
		</div>
	</div>
</div>
