<script lang="ts">
    import { onMount } from 'svelte';
    import { GoogleMapsOverlay as DeckOverlay } from '@deck.gl/google-maps';
    import { TerrainLayer } from '@deck.gl/geo-layers';
    import type { optionList } from './types';
    import crosshairImg from './../assets/crosshair.png';

    export let elevation: number;
    export let selectedObj: optionList;
    export let selected: string;
    export let lat: number | undefined;
    export let long: number | undefined;

    let container: HTMLElement;
    let map: google.maps.Map;

    const overlay = new DeckOverlay({
        layers: [
            new TerrainLayer({
                elevationDecoder: {
                    rScaler: 1500,
                    gScaler: 0,
                    bScaler: 0,
                    offset: 0
                },
                elevationData: selectedObj?.elevationDataUrl,
                texture: selectedObj?.textureUrl,
                bounds: [-122.5233, 37.6493, -122.3566, 37.8159]
            })
        ]
    });

    let latlong = { lat: 38.53, lng: -98.53 };

    const NORTH_AMERICA_BOUNDS = {
        north: 59.05,
        south: 10,
        west: -155,
        east: -30
    };

    const mapOptions = {
        tilt: 100,
        zoom: 5,
        mapId: 'f7933bd7d534252e', // vector
        center: latlong,
        restriction: {
            latLngBounds: NORTH_AMERICA_BOUNDS,
            strictBounds: true
        },
        mapTypeId: 'terrain',
        mapTypeControl: false,
        fullscreenControl: false
    };

    function displayLocationElevation(
        location: google.maps.LatLng,
        elevator: google.maps.ElevationService
    ) {
        elevator
            .getElevationForLocations({
                locations: [location]
            })
            .then(({ results }) => {
                if (results[0]) {
                    elevation = results[0].elevation;
                    lat = map.getCenter()?.lat();
                    long = map.getCenter()?.lng();
                }
            })
            .catch((e) => console.log('Elevation service failed due to: ' + e));
    }

    function initMap(): void {
        map = new google.maps.Map(container, mapOptions);

        const elevator = new google.maps.ElevationService();

        function panTo(latLng: any, map: any) {
            map.panTo(latLng);
        }

        overlay.setMap(map);

        let imgShape = {
            coords: [32, 32, 32, 32], // 1px
            type: 'rect' // rectangle
        };

        let icon = {
            url: crosshairImg, // url
            scaledSize: new google.maps.Size(70, 70), // size
            anchor: new google.maps.Point(25, 25)
        };

        let crosshairMarker = new google.maps.Marker({
            position: latlong,
            map: map,
            icon: icon,
            shape: imgShape,
            optimized: false,
            zIndex: 5
        });

        let interval: NodeJS.Timeout;

        function debouncer() {
            clearTimeout(interval);
            interval = setTimeout(() => {
                let newLat = map.getCenter()?.lat();
                let newLong = map.getCenter()?.lng();

                if (newLat && newLong) {
                    let event = {
                        latLng: new google.maps.LatLng(newLat, newLong)
                    };
                    displayLocationElevation(event.latLng, elevator);
                }
            }, 500);
        }

        function centerReticle() {
            crosshairMarker.setPosition(map.getCenter());
            debouncer();
        }

        google.maps.event.addListener(map, 'bounds_changed', centerReticle);

        map.addListener('click', (event: any) => {
            panTo(event.latLng, map);
        });
    }

    function changeOverlay() {
        overlay.setProps({
            layers: [
                new TerrainLayer({
                    elevationDecoder: {
                        rScaler: 1,
                        gScaler: 1,
                        bScaler: 1,
                        offset: 0
                    },
                    elevationData: selectedObj?.elevationDataUrl,
                    texture: selectedObj?.textureUrl,
                    bounds: [-122.5233, 37.6493, -122.3566, 37.8159]
                })
            ]
        });
    }

    onMount(() => {
        initMap();
    });

    $: selected, changeOverlay();
</script>

<div class="map" bind:this={container} />
