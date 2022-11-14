<script lang="ts">
    import { onMount } from 'svelte';
    import { GoogleMapsOverlay as DeckOverlay } from '@deck.gl/google-maps';
    import { TerrainLayer } from '@deck.gl/geo-layers';
    import { GeoJsonLayer } from '@deck.gl/layers';
    import type { optionList } from './types';
    import usa from './usa.geo.json';

    export let elevation: number;
    export let selectedObj: optionList;
    export let selected: string;
    export let lat: number | undefined;
    export let long: number | undefined;
    export let stateBoundaries: boolean = false;

    $: stateBoundaries = stateBoundaries;

    let container: HTMLElement;
    let map: google.maps.Map;

    const layer = new GeoJsonLayer({
        id: 'GeoJsonLayer',
        data: usa,
        stroked: true,
        getStrokeColor: [0, 0, 0, 255],
        lineWidthMinPixels: 0,
        lineBillboard: false,
        filled: false,
        getFillColor: [0, 0, 0, 0],
        pickable: true,
        getPolygonOffset: () => [0, -10000000]
    });

    const layerWithBounds = new GeoJsonLayer({
        id: 'GeoJsonLayer',
        data: usa,
        stroked: true,
        getStrokeColor: [0, 0, 0, 255],
        lineWidthMinPixels: 1,
        lineBillboard: false,
        filled: false,
        getFillColor: [0, 0, 0, 0],
        pickable: true,
        getPolygonOffset: () => [0, -10000000]
    });

    const overlay = new DeckOverlay({
        layers: [
            layer,
            new TerrainLayer({
                elevationDecoder: {
                    rScaler: 1200,
                    gScaler: 800,
                    bScaler: 900,
                    offset: -1000
                },
                elevationData: selectedObj?.elevationDataUrl,
                texture: selectedObj?.textureUrl,
                bounds: [-122.5233, 37.6493, -122.3566, 37.8159]
            })
        ]
    });
    const overlayWithStateBoundaries = new DeckOverlay({
        layers: [
            layerWithBounds,
            new TerrainLayer({
                elevationDecoder: {
                    rScaler: 1200,
                    gScaler: 800,
                    bScaler: 900,
                    offset: -1000
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
        tilt: 40,
        zoom: 5,
        mapId: 'f7933bd7d534252e', // vector
        center: latlong,
        restriction: {
            latLngBounds: NORTH_AMERICA_BOUNDS,
            strictBounds: true
        },
        mapTypeId: 'satellite',
        mapTypeControl: false,
        fullscreenControl: false,
        heading: 12
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

        if (stateBoundaries) {
            overlayWithStateBoundaries.setMap(map);
        } else {
            overlay.setMap(map);
        }

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
            debouncer();
        }

        google.maps.event.addListener(map, 'bounds_changed', centerReticle);

        map.addListener('click', (event: any) => {
            panTo(event.latLng, map);
        });

        const buttons: [string, string, number, google.maps.ControlPosition][] = [
            ['Tilt Up', 'tilt', -20, google.maps.ControlPosition.LEFT_CENTER],
            ['Rotate Left', 'rotate', 20, google.maps.ControlPosition.LEFT_CENTER],
            ['Rotate Right', 'rotate', -20, google.maps.ControlPosition.LEFT_CENTER],
            ['Tilt Down', 'tilt', 20, google.maps.ControlPosition.LEFT_CENTER]
        ];

        buttons.forEach(([text, mode, amount, position]) => {
            const controlDiv = document.createElement('div');
            const controlUI = document.createElement('button');

            if (text === 'Tilt Down') {
                controlUI.classList.add('ui-button-bottom');
            } else if (text === 'Tilt Up') {
                controlUI.classList.add('ui-button-top');
            } else if (text === 'Rotate Left') {
                controlUI.classList.add('ui-button-left');
            } else if (text === 'Rotate Right') {
                controlUI.classList.add('ui-button-right');
            }
            controlUI.innerText = `${text}`;
            controlUI.addEventListener('click', () => {
                adjustMap(mode, amount);
            });
            controlDiv.appendChild(controlUI);
            map.controls[position].push(controlDiv);
        });

        const adjustMap = function (mode: string, amount: number) {
            switch (mode) {
                case 'tilt':
                    map.setTilt(map.getTilt()! + amount);
                    break;
                case 'rotate':
                    map.setHeading(map.getHeading()! + amount);
                    break;
                default:
                    break;
            }
        };
    }

    function changeOverlay() {
        console.log(stateBoundaries);
        if (stateBoundaries) {
            overlay.setProps({
                layers: [
                    layerWithBounds,
                    new TerrainLayer({
                        elevationDecoder: {
                            rScaler: 1200,
                            gScaler: 800,
                            bScaler: 900,
                            offset: -1000
                        },
                        elevationData: selectedObj?.elevationDataUrl,
                        texture: selectedObj?.textureUrl,
                        bounds: [-122.5233, 37.6493, -122.3566, 37.8159]
                    })
                ]
            });
        } else {
            overlay.setProps({
                layers: [
                    layer,
                    new TerrainLayer({
                        elevationDecoder: {
                            rScaler: 1200,
                            gScaler: 800,
                            bScaler: 900,
                            offset: -1000
                        },
                        elevationData: selectedObj?.elevationDataUrl,
                        texture: selectedObj?.textureUrl,
                        bounds: [-122.5233, 37.6493, -122.3566, 37.8159]
                    })
                ]
            });
        }
    }

    onMount(() => {
        initMap();
    });

    $: selected, changeOverlay();
    $: stateBoundaries, changeOverlay();
</script>

<div class="map" bind:this={container} />
