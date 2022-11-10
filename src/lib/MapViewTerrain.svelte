<script lang="ts">
    import TimelineControlBar from './TimelineControlBar.svelte';
    import type { optionList } from './types';
    import list from './list.json';
    import DeckGlMap from './DeckGLMap.svelte';

    let optionList: optionList[] = list;
    let selected: string = optionList[0].title;
    let selectedObj: optionList;
    $: selected, setSelectedObject();

    function setSelectedObject() {
        let newObj = optionList.find((opt) => opt.title === selected);
        if (newObj) {
            selectedObj = newObj;
        }
    }

    let mapCenter: any;
    let elevation: number;
</script>

<div class="map-view__wrapper">
    {#key selected}
        <DeckGlMap bind:elevation bind:selectedObj bind:mapCenter />
    {/key}
    <div class="back-button">
        <a href="/" alt="back" class="link-button">Back</a>
    </div>
    <div class="right-display-pane__wrapper">
        {elevation ? `Elevation: ${elevation}` : 'Click for elevation.'} <br />Lat/Long: {mapCenter
            ? mapCenter
            : ''}
    </div>
    <TimelineControlBar bind:options={optionList} bind:selected />
</div>
