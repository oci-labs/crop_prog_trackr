<script lang="ts">
    import { onMount } from 'svelte';
    import { GoogleMapsOverlay as DeckOverlay } from '@deck.gl/google-maps';
    import { GeoJsonLayer, ArcLayer } from '@deck.gl/layers';

    let maps: string = 'Map';

    let container: HTMLElement;
    let map: google.maps.Map;
    let heatmap: any;

    // source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
    const AIR_PORTS =
        'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson';

    // Create a WebGL Overlay View instance.
    // const webglOverlayView = new google.maps.WebGLOverlayView();

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

        heatmap = new google.maps.visualization.HeatmapLayer({
            data: getPoints(),
            map: map
        });

        const overlay = new DeckOverlay({
            layers: [
                new GeoJsonLayer({
                    id: 'airports',
                    data: AIR_PORTS,
                    // Styles
                    filled: true,
                    pointRadiusMinPixels: 2,
                    pointRadiusScale: 2000,
                    getPointRadius: (f: any) => 11 - f.properties.scalerank,
                    getFillColor: [200, 0, 80, 180],
                    // Interactive props
                    pickable: true,
                    autoHighlight: true,
                    onClick: (info: any) =>
                        // eslint-disable-next-line
                        info.object &&
                        alert(`${info.object.properties.name} (${info.object.properties.abbrev})`)
                }),
                new ArcLayer({
                    id: 'arcs',
                    data: AIR_PORTS,
                    dataTransform: (d: any) =>
                        d.features.filter((f: any) => f.properties.scalerank < 4),
                    // Styles
                    getSourcePosition: (f: any) => [-0.4531566, 51.4709959], // London
                    getTargetPosition: (f: any) => f.geometry.coordinates,
                    getSourceColor: [0, 128, 200],
                    getTargetColor: [200, 0, 80],
                    getWidth: 1
                })
            ]
        });
        overlay.setMap(map);
    }

    function getPoints() {
        return [
            new google.maps.LatLng(37.782551, -122.445368),
            new google.maps.LatLng(37.782745, -122.444586),
            new google.maps.LatLng(37.782842, -122.443688),
            new google.maps.LatLng(37.782919, -122.442815),
            new google.maps.LatLng(37.782992, -122.442112),
            new google.maps.LatLng(37.7831, -122.441461),
            new google.maps.LatLng(37.783206, -122.440829),
            new google.maps.LatLng(37.783273, -122.440324),
            new google.maps.LatLng(37.783316, -122.440023),
            new google.maps.LatLng(37.783357, -122.439794),
            new google.maps.LatLng(37.783371, -122.439687),
            new google.maps.LatLng(37.783368, -122.439666),
            new google.maps.LatLng(37.783383, -122.439594),
            new google.maps.LatLng(37.783508, -122.439525)
        ];
    }

    function toggleHeatmap(): void {
        heatmap.setMap(heatmap.getMap() ? null : map);
    }

    function changeGradient(): void {
        const gradient = [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgba(63, 0, 91, 1)',
            'rgba(127, 0, 63, 1)',
            'rgba(191, 0, 31, 1)',
            'rgba(255, 0, 0, 1)'
        ];

        heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
    }

    function changeRadius(): void {
        heatmap.set('radius', heatmap.get('radius') ? null : 20);
    }

    function changeOpacity(): void {
        heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
    }

    onMount(() => {
        initMap();
    });
</script>

<div class="map-view__wrapper">
    <div class="map" bind:this={container} />

    <div class="button-section__wrapper">
        <button id="toggle-heatmap" on:click={toggleHeatmap}>Toggle Heatmap</button>
        <button id="change-gradient" on:click={changeGradient}>Change gradient</button>
        <button id="change-radius" on:click={changeRadius}>Change radius</button>
        <button id="change-opacity" on:click={changeOpacity}>Change opacity</button>
    </div>
</div>
