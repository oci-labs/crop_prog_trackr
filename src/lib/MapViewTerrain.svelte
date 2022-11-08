<script lang="ts">
    import { onMount } from 'svelte';
    import { GoogleMapsOverlay as DeckOverlay } from '@deck.gl/google-maps';
    import { BitmapLayer } from '@deck.gl/layers';
    import { TileLayer, TerrainLayer } from '@deck.gl/geo-layers';
    import crosshairImg from './../assets/crosshair.png';

    let maps: string = 'Map';

    let container: HTMLElement;
    let map: google.maps.Map;

    let latlong = { lat: 38.53, lng: -98.53 };

    let mapCenter: any;

    let elevation: number;

    const mapOptions = {
        // tilt: 0,
        // heading: 0,
        zoom: 5,
        // mapId: 'f7933bd7d534252e', // vector
        mapId: '6811f47ece808ee3', // raster
        // center: { lat: 37.782551, lng: -122.445368 },
        center: latlong,
        mapTypeId: 'terrain'
        // for moving camera, these should be disabled
    };

    function initMap(): void {
        map = new google.maps.Map(container, mapOptions);
        function panTo(latLng: any, map: any) {
            map.panTo(latLng);
        }

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
                    elevationData:
                        'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
                    texture:
                        'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
                    // elevationData: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/terrain.png',
                    // texture: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/terrain-mask.png',
                    bounds: [-122.5233, 37.6493, -122.3566, 37.8159]
                })
            ]
        });
        const elevator = new google.maps.ElevationService();
        // const infowindow = new google.maps.InfoWindow({});

        // infowindow.open(map);

        // overlay.setMap(map);

        var imgShape = {
            coords: [32, 32, 32, 32], // 1px
            type: 'rect' // rectangle
        };

        var icon = {
            url: crosshairImg, // url
            scaledSize: new google.maps.Size(50, 50), // size
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

        // google.maps.event.trigger(marker, 'click');

        // Add a listener for the click event. Display the elevation for the LatLng of
        // the click inside the infowindow.
        map.addListener('click', (event: any) => {
            console.log(event.latLng);
            console.log(elevator);
            displayLocationElevation(event.latLng, elevator);
            panTo(event.latLng, map);
        });
    }

    function displayLocationElevation(
        location: google.maps.LatLng,
        elevator: google.maps.ElevationService
    ) {
        console.log(location);
        // Initiate the location request
        elevator
            .getElevationForLocations({
                locations: [location]
            })
            .then(({ results }) => {
                // infowindow.setPosition(location);

                // Retrieve the first result
                if (results[0]) {
                    // Open the infowindow indicating the elevation at the clicked position.
                    // infowindow.setContent(
                    //     'The elevation at this point <br>is ' + results[0].elevation + ' meters.'
                    // );
                    elevation = results[0].elevation;
                    console.log(results[0].elevation);
                } else {
                    // infowindow.setContent('No results found');
                }
            })
            .catch((e) => console.log('Elevation service failed due to: ' + e));
    }

    onMount(() => {
        initMap();
    });
</script>

<div class="map-view__wrapper">
    <div class="map" bind:this={container} />
    <div class="right-display-pane__wrapper">{elevation ? `Elevation: ${elevation}` : 'Click for elevation.'} <br />Lat/Long: {mapCenter ? mapCenter : ''}</div>
</div>
