<script lang="ts">
    import { onMount } from 'svelte';
    import type { optionList, sliderMetrics } from './types';

    export let options: optionList[] | [] = [];
    export let selected: string = 't';
    let metrics: sliderMetrics;
    let scrollOffset: number = 0;
    let leftButtonDisabled: boolean = true;
    let rightButtonDisabled: boolean = false;

    function handleClick(event: Event) {
        event.preventDefault();
        let val = (event.target as HTMLDivElement).id;
        selected = val;
    }

    let container: HTMLElement;
    let bar: HTMLElement;

    function checkMetrics() {
        let newBar: any = bar?.scrollWidth || 0;
        let newContainer: any = container?.clientWidth || 0;
        let newLeft: any = bar?.offsetLeft || 0;
        let parsedLeft = parseInt(newLeft);

        metrics = {
            bar: newBar,
            container: newContainer,
            left: parsedLeft,
            getHidden() {
                return newBar + parsedLeft - newContainer;
            }
        };

        updateArrows();
    }

    function slideTimeline(direction: any) {
        checkMetrics();
        var pos = metrics.left;
        if (direction === 'right') {
            scrollOffset = -(Math.abs(pos) + Math.min(metrics.getHidden(), metrics.container));
        } else {
            scrollOffset = Math.min(0, metrics.container + pos);
        }
        bar.style.left = scrollOffset + 'px';
        setTimeout(() => {
            checkMetrics();
        }, 400);
    }

    function updateArrows() {
        if (metrics.getHidden() === 0) {
            rightButtonDisabled = true;
        } else {
            rightButtonDisabled = false;
        }

        if (metrics.left === 0) {
            leftButtonDisabled = true;
        } else {
            leftButtonDisabled = false;
        }
    }

    function toggleLeft(event: Event) {
        event.preventDefault();
        slideTimeline('left');
    }

    function toggleRight(event: Event) {
        event.preventDefault();
        slideTimeline('right');
    }

    onMount(() => {
        checkMetrics();
    });
</script>

<div class="timeline-control-bar__wrapper">
    <div class="timeline-control-bar">
        <div class="button-wrapper">
            <button on:click={toggleLeft} class="toggle-left" disabled={leftButtonDisabled}
                ><span class="material-symbols-outlined"> chevron_left </span></button
            >
        </div>
        <div class="control-section" bind:this={container}>
            <div class="bar" bind:this={bar}>
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
        <div class="button-wrapper">
            <button on:click={toggleRight} class="toggle-right" disabled={rightButtonDisabled}
                ><span class="material-symbols-outlined"> chevron_right </span></button
            >
        </div>
    </div>
</div>
