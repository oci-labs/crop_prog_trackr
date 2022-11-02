<script lang="ts">
    import MapView from "./MapView.svelte";
    import MapViewDeckGL from "./MapViewDeckGL.svelte";

    let showWebGL: boolean = true;

    function handleWebGlClick() {
        showWebGL = true;
    }

    function handleDeckGlClick() {
        showWebGL = false;
    }
</script>

<button on:click={handleWebGlClick}>See WebGL Map</button>

<button on:click={handleDeckGlClick}>See DeckGL Map</button>

{#if showWebGL}
<h2>WebGL Map</h2>
<MapView />
{:else}
<h2>DeckGL Map</h2>
<MapViewDeckGL />
{/if}