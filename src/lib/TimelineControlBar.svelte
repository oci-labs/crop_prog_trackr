<script lang="ts">
    import { onMount } from 'svelte';
    import { onDestroy } from 'svelte';
    import type { optionList, sliderMetrics } from './types';

    export let options: optionList[] | [] = [];
    export let selected: string = 't';

    let metrics: sliderMetrics;
    let scrollOffset: number = 0;
    let offsetLeft: string = '0px';
    let leftButtonDisabled: boolean = true;
    let rightButtonDisabled: boolean = false;
    let animationOn: boolean = true;
    let animationLength: number = 1000;
    let totalLength: number = options.length;
    let intervalArr: any = [];

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
        offsetLeft = scrollOffset + 'px';
        setTimeout(() => {
            checkMetrics();
        }, 400);
    }

    function handleClick(index: number, title: string) {
        selected = title;
        centerElement(index);
    }

    function centerElement(index: number) {
        checkMetrics();
        let clickedButtonIndex = index + 1; // index of the button that was clicked
        let currentSpotOnTimeline = clickedButtonIndex * 92; // calculate the current placement
        let containerSize = metrics.container; // total size of viewport
        let leftOffsetInView = containerSize / 2;
        let offsetLeftScrollNeeded = leftOffsetInView - currentSpotOnTimeline + 46;
        scrollOffset = offsetLeftScrollNeeded;
        if (index < 3) {
            offsetLeft = '0px';
        } else {
            offsetLeft = scrollOffset + 'px';
        }
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

    function toggleAnimation(event: Event) {
        event.preventDefault();
        console.log(animationOn);
        if (!animationOn) {
            animationLength = 1000;
        }
        animationOn = !animationOn;
    }

    function animateTimeline(opt: optionList, i: number) {
        if (i + 1 === totalLength) {
            selected = opt.title;
            centerElement(0);
            setTimeout(() => {
                animationOn = false;
            }, 100);
        } else {
            selected = opt.title;
            centerElement(i);
        }
    }

    function intervalInit() {
        options.map((opt, i) => {
            intervalArr.push(
                setInterval(
                    () => animateTimeline(opt, i),
                    animationLength === 0 ? 1 : (i + 1) * animationLength
                )
            );
        });
    }

    function stopAnimation() {
        animationLength = 0;
        intervalArr.map((a: any) => {
            clearInterval(a);
            intervalArr = [];
        });
        selected = options[0].title;
        centerElement(0);
    }

    onMount(() => {
        checkMetrics();
    });

    $: animationOn && intervalInit();
    $: !animationOn && stopAnimation();
</script>

<div class="timeline-control-bar__wrapper">
    <div class="timeline-control-bar">
        <div class="button-wrapper leading">
            <button on:click={toggleAnimation} class="animation-button"
                ><span class="material-symbols-outlined"
                    >{animationOn ? 'stop' : 'play_arrow'}
                </span></button
            >
        </div>
        <div class="button-wrapper">
            <button on:click={toggleLeft} class="toggle-left" disabled={leftButtonDisabled}
                ><span class="material-symbols-outlined"> chevron_left </span></button
            >
        </div>
        <div class="control-section" bind:this={container}>
            <div class="bar" bind:this={bar} style={`left: ${offsetLeft}`}>
                {#if options.length > 0}
                    {#each options as opt, i}
                        <div
                            class="option"
                            id={opt.title}
                            class:selected={selected === opt.title}
                            on:click={() => handleClick(i, opt.title)}
                            on:keyup={() => handleClick(i, opt.title)}
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
