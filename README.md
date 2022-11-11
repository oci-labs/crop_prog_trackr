# Crop Progress Tracker
Repository for OCI's submission into the 2022 Google Maps Platform Hackathon: [Deployed instance](https://nodal-alcove-367916.uc.r.appspot.com/)

The vision here is to satisfy the **Data Visualization** requirement category of the Google Maps API Hackathon by creating a unique and domain-centered data visualization experience while satisfying all other submission requirements. The unique data visualization concept being displayed is a **4D crop progress imagery** (3 spatial dimensions and 1 temporal dimension) across the United States. **Users are able to interactively explore weekly, 3D crop progress data as it changes across the United States for a full year.**

## Description:

This demo displays [USDA Crop Progress and Condition Layers](https://www.nass.usda.gov/Research_and_Science/Crop_Progress_Gridded_Layers/index.php) dataset for corn crops from Mar 29th, 2021 through November 22nd, 2021. The Crop Progress layer is a unique crop progress index showing growth stages from planting through harvest. The data is interpolated to a 9km grid from county-level farmer surveys.

Feel free to explore corn crop progress in 3D as it moves through the weeks of the year. Click and Drag the map to pan, Shift + Click and Drag to tilt the map, and scroll to zoom.

Press the "stop" button on the time slider to stop the animation and manually click on weeks to view.

As you explore the map, elevation will be displayed in the upper-right corner, giving more environmental context to your area of interest.

### Design:
  - An interactive map on a single page website. 
    - Interactive map displays [USDA Crop Progress image data](https://www.nass.usda.gov/Research_and_Science/Crop_Progress_Gridded_Layers/index.php) for individual crops.
    - A time slider allows users to cycle through weeks of imagery or cycle automatically. 
    - First Google Maps API usage is:
      - Imagery is displayed using Deck.GL's Terrain Layers as a 3D terrain-style mesh.
       - Overlays exist on top of default Google Satellite Imagery Layer.
    - 2nd Google Maps API usage is:
      - Elevation ticker in the corner as users pan around map (Elevation API).

### Other Resources:
- Hackathon Overview: https://googlemapsplatform.devpost.com/
- Hackathon Rules: https://googlemapsplatform.devpost.com/rules

## Run the project locally

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of the app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
