<script lang="ts">
    import type { optionList } from './types';

    export let options: optionList[] | [] = [];
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
                    id={opt.title}
                    class:selected={selected === opt.title}
                    on:click={handleClick}
                    on:keyup={handleClick}
                >
                    {opt.title}
                </div>
            {/each}
        {/if}
    </div>
</div>
