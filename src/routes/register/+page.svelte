<script>
    import { goto } from "$app/navigation";
    import { keycloakState } from "../../authStore";

    // Check if the user is logged in
    if ($keycloakState.authenticated === true) {
        goto("/workspace/home");
    }
</script>
