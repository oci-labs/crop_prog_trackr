<script lang="ts">
    import { onMount } from 'svelte';
    import { GoogleMapsOverlay as DeckOverlay } from '@deck.gl/google-maps';
    import { TerrainLayer } from '@deck.gl/geo-layers';
    import type { optionList } from './types';
    import crosshairImg from './../assets/crosshair.png';

    export let elevation: number;
    export let selectedObj: optionList;
    export let mapCenter: any;
    export let selected: string;

    let container: HTMLElement;
    let map: google.maps.Map;
    const overlay = new DeckOverlay({
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

    let latlong = { lat: 38.53, lng: -98.53 };

    const mapOptions = {
        zoom: 5,
        mapId: 'f7933bd7d534252e', // vector
        center: latlong,
        mapTypeId: 'terrain',
        disableDefaultUI: true
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

        function debouncer(marker: any) {
            console.log('Debounce');
            clearTimeout(interval);
            interval = setTimeout(() => {
                console.log('Interval');
                console.log(marker);
                google.maps.event.trigger(marker, 'click');
                mapCenter = map.getCenter();
            }, 1000);
        }

        function centerReticle() {
            crosshairMarker.setPosition(map.getCenter());
            debouncer(crosshairMarker);
        }

        google.maps.event.addListener(map, 'bounds_changed', centerReticle);

        map.addListener('click', (event: any) => {
            console.log(event.latLng);
            console.log(elevator);
            displayLocationElevation(event.latLng, elevator);
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
