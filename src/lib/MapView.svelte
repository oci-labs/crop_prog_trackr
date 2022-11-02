<script lang="ts">
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
    import { ThreeJSOverlayView } from '@googlemaps/three';

    let maps: string = 'Map';

    let container: HTMLElement;
    let map: google.maps.Map;
    let heatmap: any;

    // Create a WebGL Overlay View instance.
    // const webglOverlayView = new google.maps.WebGLOverlayView();

    const mapOptions = {
        tilt: 0,
        heading: 0,
        zoom: 17,
        mapId: "f7933bd7d534252e", // vector
        // mapId: "6811f47ece808ee3", // raster
        center: { lat: 37.782551, lng: -122.445368 },
        // center: { lat: 35.6594945, lng: 139.6999859 },
        mapTypeId: 'satellite',
        // for moving camera, these should be disabled
        disableDefaultUI: true,
        gestureHandling: 'none',
        keyboardShortcuts: false
    };

    function initMap(): void {
        map = new google.maps.Map(container, mapOptions);

        heatmap = new google.maps.visualization.HeatmapLayer({
            data: getPoints(),
            map: map
        });
        // Add the overlay to the map.
        // webglOverlayView.setMap(map);

        // Set up the Three.js scene.
        scene = new THREE.Scene();
        // camera = new THREE.PerspectiveCamera();
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.75); // Soft white light.
        scene.add(ambientLight);

        // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);

        // directionalLight.position.set(0, 10, 50);
        // scene.add(directionalLight);

        // Load the 3D model with GLTF Loader from Three.js.
        const loader = new GLTFLoader();
        const url = 'https://raw.githubusercontent.com/googlemaps/js-samples/main/assets/pin.gltf';
        loader.load(url, (gltf: any) => {
            gltf.scene.scale.set(10, 10, 10);
            gltf.scene.rotation.x = Math.PI / 2;
            scene.add(gltf.scene);

            let { tilt, heading, zoom } = mapOptions;

            const animate = () => {
                if (tilt < 67.5) {
                    tilt += 0.5;
                } else if (heading <= 360) {
                    heading += 0.2;
                    zoom -= 0.0005;
                } else {
                    // exit animation loop
                    return;
                }

                map.moveCamera({ tilt, heading, zoom });

                requestAnimationFrame(animate);
            };

            requestAnimationFrame(animate);
        });

        new ThreeJSOverlayView({
            map,
            scene,
            anchor: { ...mapOptions.center, altitude: 100 },
            THREE
        });
    }

    let scene: any;
    let renderer: any;
    let camera: any;
    let loader: any;

    // webglOverlayView.onAdd = () => {
    //     // Set up the Three.js scene.
    //     scene = new THREE.Scene();
    //     camera = new THREE.PerspectiveCamera();
    //     const ambientLight = new THREE.AmbientLight(0xffffff, 0.75); // Soft white light.
    //     scene.add(ambientLight);

    //     // Load the 3D model with GLTF Loader from Three.js.
    //     loader = new GLTFLoader();
    //     const url = 'https://raw.githubusercontent.com/googlemaps/js-samples/main/assets/pin.gltf';
    //     loader.load(url, (gltf: any) => {
    //         gltf.scene.scale.set(10, 10, 10);
    //         gltf.scene.rotation.x = Math.PI / 2;
    //         scene.add(gltf.scene);

    //         let { tilt, heading, zoom } = mapOptions;

    //         const animate = () => {
    //             if (tilt < 67.5) {
    //                 tilt += 0.5;
    //             } else if (heading <= 360) {
    //                 heading += 0.2;
    //                 zoom -= 0.0005;
    //             } else {
    //                 // exit animation loop
    //                 return;
    //             }

    //             map.moveCamera({ tilt, heading, zoom });

    //             requestAnimationFrame(animate);
    //         };

    //         requestAnimationFrame(animate);
    //     });
    // };

    // webglOverlayView.onContextRestored = ({ gl }) => {
    //     // Create the Three.js renderer, using the
    //     // maps's WebGL rendering context.
    //     renderer = new THREE.WebGLRenderer({
    //         canvas: gl.canvas,
    //         context: gl,
    //         ...gl.getContextAttributes()
    //     });
    //     renderer.autoClear = false;
    // };

    // webglOverlayView.onDraw = ({ gl, transformer }) => {
    //     // Update camera matrix to ensure the model is georeferenced correctly on the map.
    //     const matrix = transformer.fromLatLngAltitude({
    //         lat: mapOptions.center.lat,
    //         lng: mapOptions.center.lng,
    //         altitude: 120
    //     });
    //     camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);

    //     // Request a redraw and render the scene.
    //     webglOverlayView.requestRedraw();
    //     renderer.render(scene, camera);

    //     // Always reset the GL state.
    //     renderer.resetState();
    // };

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
