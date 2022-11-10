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
