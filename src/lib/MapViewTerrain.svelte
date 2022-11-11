<script lang="ts">
    import TimelineControlBar from './TimelineControlBar.svelte';
    import type { optionList } from './types';
    import list from './list.json';
    import DeckGlMap from './DeckGLMap.svelte';
    import cropGradient from './../assets/crop-gradient.png';
    import crosshairImg from './../assets/crosshair.png';
    import crosshairImg2 from './../assets/crosshair-2.png';

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
        <img src={crosshairImg2} alt="Crosshair" />
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
        <br />
        <div class="description__wrapper">
            <h3>Crop Progress Tracker</h3>
            <p>
                This demo displays <a
                    href="https://www.nass.usda.gov/Research_and_Science/Crop_Progress_Gridded_Layers/index.php"
                    >USDA's Crop Progress and Condition layers dataset</a
                > for corn crops from Mar 29th, 2021 through November 22nd, 2021. 
            
                The Crop Progress
                layer is a unique crop progress index showing growth stages from planting through
                harvest. The data is interpolated to a 9km grid from county-level farmer surveys.
            </p>
            <p>
                Feel free to explore corn crop progress in 3D as it moves through the weeks of the year. Click and Drag the map to pan, Shift + Click and Drag to tilt the map, and scroll to zoom. 
               </p> <p>
                Press the "stop" button on the time slider to stop the animation and manually click on weeks to view. 
                </p>
                <p>
                As you explore the map, elevation will be displayed in the upper-right corner, giving more environmental context to your area of interest. 
            </p>
        </div>
    </div>
    <TimelineControlBar bind:options={optionList} bind:selected />
</div>
