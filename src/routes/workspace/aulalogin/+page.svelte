<script>
    let username = '';
    let password = '';

    function handleSubmit() {
        // Save username and password in local storage
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('password', password);
        
        // Perform any other necessary actions
        // ...
    }
</script>

<main>
    <form on:submit={handleSubmit}>
        <label for="username">Username:</label>
        <input type="text" id="username" bind:value={username} />

        <label for="password">Password:</label>
        <input type="password" id="password" bind:value={password} />

        <button type="submit">Submit</button>
    </form>
</main>

<style>
    /* Add your custom styles here */
</style>