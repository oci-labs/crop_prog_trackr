import { GoogleMapsOverlay as DeckOverlay } from '@deck.gl/google-maps';
import { TerrainLayer } from '@deck.gl/geo-layers';
import type { optionList } from './types';

export function displayLocationElevation(
    location: google.maps.LatLng,
    elevator: google.maps.ElevationService
) {
    let elevation;
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
    if (elevation) {
        return elevation;
    } else {
        return null;
    }
}

export function changeOverlay(map: google.maps.Map, selectedObj: optionList | null) {
    console.log('change overlay');
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

    overlay.setMap(map);

    return map;
}
