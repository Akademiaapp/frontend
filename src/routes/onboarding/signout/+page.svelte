<script lang="ts">
    import { goto } from '$app/navigation';
    import { supabase } from '@/supabaseClient';
    import { onMount } from 'svelte';
    
    onMount(() => {
        supabase.auth.signOut({ scope: 'local' }).then(() => {
            goto('/onboarding/login')
        });
    })
</script>