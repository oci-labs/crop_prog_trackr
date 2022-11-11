<script lang="ts">
    import TimelineControlBar from './TimelineControlBar.svelte';
    import type { optionList } from './types';
    import list from './list.json';
    import DeckGlMap from './DeckGLMap.svelte';
    import cropGradient from './../assets/crop-gradient.png';
    import crosshairImg from './../assets/crosshair.png';

    let optionList: optionList[] = list;
    let selected: string = optionList[0].title;
    let selectedObj: optionList;
    let lat: number | undefined;
    let long: number | undefined;
    $: selected, setSelectedObject();

    function setSelectedObject() {
        let newObj = optionList.find((opt) => opt.title === selected);
        if (newObj) {
            selectedObj = newObj;
        }
    }

    let elevation: number;
</script>

<div class="map-view__wrapper">
    <DeckGlMap bind:elevation bind:selected bind:selectedObj bind:lat bind:long />
    <div class="crosshair-image__wrapper">
        <img src={crosshairImg} alt="Crosshair" />
    </div>
    <div class="back-button">
        <a href="/" alt="back" class="link-button">Back</a>
    </div>
    <div class="right-display-pane__wrapper">
        <span>Elevation: {elevation ? elevation.toFixed(0) : '0'} meters</span>
        <span>Lat/Long: {lat && long ? `(${lat.toFixed(2)}, ${long.toFixed(2)})` : '(0, 0)'}</span>
        <br />
        <div class="crop-gradient__wrapper">
            <img class="crop-gradient" src={cropGradient} alt="Crop Gradient" />
            <div class="crop-gradient__help-text">
                <span>Planting</span><span>Harvest</span>
            </div>
        </div>
    </div>
    <TimelineControlBar bind:options={optionList} bind:selected />
</div>
