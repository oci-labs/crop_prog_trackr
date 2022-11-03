<script lang="ts">
    import { onMount } from 'svelte';
    import { GoogleMapsOverlay as DeckOverlay } from '@deck.gl/google-maps';
    import { BitmapLayer } from '@deck.gl/layers';
    import {TileLayer, TerrainLayer} from '@deck.gl/geo-layers';

    let maps: string = 'Map';

    let container: HTMLElement;
    let map: google.maps.Map;

    const mapOptions = {
        tilt: 0,
        heading: 0,
        zoom: 5,
        mapId: "f7933bd7d534252e", // vector
        // mapId: "6811f47ece808ee3", // raster
        // center: { lat: 37.782551, lng: -122.445368 },
        center: { lat: 51.47, lng: 0.45 },
        mapTypeId: 'satellite'
        // for moving camera, these should be disabled
    };

    function initMap(): void {
        map = new google.maps.Map(container, mapOptions);

        const overlay = new DeckOverlay({
            layers: [
            
                new TerrainLayer({
                    elevationDecoder: {
                      rScaler: 1,
                      gScaler: 1,
                      bScaler: 1,
                      offset: 0
                    },
                    // Digital elevation model from https://www.usgs.gov/
                    elevationData: 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
                    texture: 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
                    // elevationData: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/terrain.png',
                    // texture: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/terrain-mask.png',
                    bounds: [-122.5233, 37.6493, -122.3566, 37.8159],
                  })

            ]
        });
        overlay.setMap(map);
    }

    onMount(() => {
        initMap();
    });
</script>

<div class="map-view__wrapper">
    <div class="map" bind:this={container} />

</div>
