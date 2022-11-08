<script lang="ts">
    export let options: Array<string> | [] = [];
    export let selected: string = 't';

    function handleClick(event: Event) {
        event.preventDefault();
        let val = (event.target as HTMLDivElement).id;
        selected = val;
    }
</script>

<div class="timeline-control-bar__wrapper">
    <div class="timeline-control-bar">
        {#if options.length > 0}
            {#each options as opt}
                <div
                    class="option"
                    id={opt}
                    class:selected={selected === opt}
                    on:click={handleClick}
                    on:keyup={handleClick}
                >
                    {opt}
                </div>
            {/each}
        {/if}
    </div>
</div>
