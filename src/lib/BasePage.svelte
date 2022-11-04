<script lang="ts">
    import MapView from './MapView.svelte';
    import MapViewDeckGL from './MapViewDeckGL.svelte';
    import MapViewTerrain from './MapViewTerrain.svelte';

    let showMap: string = 'terrain';

    function handleWebGlClick() {
        showMap = 'webgl';
    }

    function handleDeckGlClick() {
        showMap = 'deckgl';
    }

    function handleTerrainClick() {
        showMap = 'terrain';
    }
</script>

<button on:click={handleTerrainClick}>See Terrain Map</button>

<button on:click={handleWebGlClick}>See WebGL Map</button>

<button on:click={handleDeckGlClick}>See DeckGL Map</button>

{#if showMap === 'webgl'}
    <h2>WebGL Map</h2>
    <MapView />
{:else if showMap === 'deckgl'}
    <h2>DeckGL Map</h2>
    <MapViewDeckGL />
{:else if showMap === 'terrain'}
    <h2>Terrain Map</h2>
    <MapViewTerrain />
{/if}
