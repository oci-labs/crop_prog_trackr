<script lang="ts">
    import { onMount } from 'svelte';
    import { changeOverlay, displayLocationElevation } from './mapFunctions';
    import type { optionList } from './types';
    import crosshairImg from './../assets/crosshair.png';

    export let elevation: number;
    export let selectedObj: optionList;
    export let mapCenter: any;

    let container: HTMLElement;
    let map: google.maps.Map;

    let latlong = { lat: 38.53, lng: -98.53 };

    const mapOptions = {
        zoom: 5,
        mapId: 'f7933bd7d534252e', // vector
        center: latlong,
        mapTypeId: 'terrain',
        disableDefaultUI: true
    };

    function initMap(): void {
        map = new google.maps.Map(container, mapOptions);

        const elevator = new google.maps.ElevationService();

        function panTo(latLng: any, map: any) {
            map.panTo(latLng);
        }

        changeOverlay(map, selectedObj);

        var imgShape = {
            coords: [32, 32, 32, 32], // 1px
            type: 'rect' // rectangle
        };

        var icon = {
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

        const debouncer = (marker: any) => {
            console.log('Debounce');
            clearTimeout(interval);
            interval = setTimeout(() => {
                console.log('Interval');
                console.log(marker);
                google.maps.event.trigger(marker, 'click');
                mapCenter = map.getCenter();
            }, 1000);
        };

        function centerReticle() {
            crosshairMarker.setPosition(map.getCenter());
            debouncer(crosshairMarker);
        }

        google.maps.event.addListener(map, 'bounds_changed', centerReticle);

        map.addListener('click', (event: any) => {
            console.log(event.latLng);
            console.log(elevator);
            let newElevation = displayLocationElevation(event.latLng, elevator);
            if (newElevation) {
                elevation = newElevation;
            }
            panTo(event.latLng, map);
        });
    }

    onMount(() => {
        initMap();
    });
</script>

<div class="map" bind:this={container} />

