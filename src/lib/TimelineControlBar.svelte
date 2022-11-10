<script lang="ts">
    import type { optionList } from './types';

    export let options: optionList[] | [] = [];
    export let selected: string = 't';

    function handleClick(event: Event) {
        event.preventDefault();
        let val = (event.target as HTMLDivElement).id;
        selected = val;
    }

    function toggleLeft() {
        console.log("Toggle left");
    }

    function toggleRight() {
        console.log("Toggle right");
    }
</script>

<div class="timeline-control-bar__wrapper">
    <div class="timeline-control-bar">
        <div class="button-wrapper">
            <button on:click={toggleLeft} class="toggle-left"><span class="material-symbols-outlined">
                chevron_left
                </span></button>
        </div>
        <div class="control-section">
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
        <div class="button-wrapper">
            <button on:click={toggleRight} class="toggle-right"><span class="material-symbols-outlined">
                chevron_right
                </span></button>
        </div>
    </div>
</div>
