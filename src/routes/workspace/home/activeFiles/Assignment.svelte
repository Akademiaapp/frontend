<script lang="ts">
    export let name: string;
    export let date: string;
</script>

<div class="contaiener">
    <div class="text">
        <p class="name">{name}</p>
        <p class="date">{date}</p>
    </div>
    <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10.3349" cy="10.9299" r="9.08329" stroke="#2CDE00" pathLength="100" stroke-width="2.50515"/>
    </svg>
        
</div>

<style lang="scss">
    svg {
        height: 100%;
        circle {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            

            stroke-linecap: round;

            transition: all 1s;
        }

    }
</style>

