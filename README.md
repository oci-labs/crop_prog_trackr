# crop_prog_trackr
Repo for OCI's submission into the 2022 Google Maps Platform Hackathon: https://googlemapsplatform.devpost.com/ 

The vision here is to satisfy the **Data Visualization** requirement category of the Google Maps API Hackathon by creating a unique and domain-centered data visualization experience while satisfying all other submission requirements. The unique data visualization concept being displayed will be **4D crop progress imagery** (3 spatial dimensions and 1 temporal dimension) across the United States. **Users will be able to interactively explore weekly, 3D crop progress data as it waves across the United States for a full year.**

<img width="592" alt="Screen Shot 2022-11-02 at 12 39 41 PM" src="https://user-images.githubusercontent.com/110310810/199574575-244f1e39-3c0f-40df-b5de-0c9cb395da80.png">


### Design:
  - Stand up an interactive map on a single page website. 
    - Interactive map will display [USDA Crop Progress image data](https://www.nass.usda.gov/Research_and_Science/Crop_Progress_Gridded_Layers/index.php) for individual crops.
    - A time slider will allow users to cycle through weeks of imagery or cycle automatically. 
    - Imagery will be displayed as a 3D terrain-style mesh.
    - Overlays will exist ontop of default Google Satellite Imagery Layer.
    - 2nd Google Maps API usage will be one of:
      - Display of agricultural point data as a heatmap layer (Heatmap API).
      - Elevation ticker in the corner as users pan around map (Elevation API).
      - Search bar to input address and zoom map to location (Geocoding API).

 ### Architecture TO DOs:
 
 - [ ] Stand up single-page website
    - [ ] Figure out deployment method 
    - [ ] Figure out how to authenticate with GCS and hide secrets
    - [ ] Does it match the [submission rules](https://googlemapsplatform.devpost.com/rules) for sharing and licensing?
 - [ ] Figure out how to interface data with Google Maps API
    - [ ] Create Image Tiles to interface with Deck.gl [`TileLayer`](https://deck.gl/docs/api-reference/geo-layers/tile-layer) and [`TerrainLayer`](https://deck.gl/docs/api-reference/geo-layers/tile-layer) and [`TerrainLayer`](https://deck.gl/docs/api-reference/geo-layers/tile-layer) and [`TerrainLayer`](https://deck.gl/docs/api-reference/geo-layers/terrain-layer) objects.
    - [ ] Make specific image bands queryable or single-band images.
    - [ ] Connect Deck.gl `TileLayer` with `TerrainLayer` object
    - [ ] Produce final WGLOverlay integration - likely with Deck.GL `TerrainLayer` object (for data on map display)
 - [ ] Implement UI Time slider mechanism, and querying scheme for image data
 - [ ] Implement Elevation Api ticker
 - [ ] Generate UX design and suggestions
 - [ ] Implement UX design
 - [ ] Create Demo Video, package and submit project 


### Other Resources:
- Hackathon Overview: https://googlemapsplatform.devpost.com/
- Hackathon Rules: https://googlemapsplatform.devpost.com/rules
- OCI Hackathon Google Doc: https://docs.google.com/document/d/1VpaHGUrgVUR0viveo1n3elCNj0duv7VvkmUjHkp-sH4/edit
- Concept demo: https://deckgl-demo-dot-gmp-next-showcase-2020.appspot.com/
- List of Google APIs: https://developers.google.com/maps 
- Custom map Styling: https://developers.google.com/maps/documentation/cloud-customization/overview
- Web.gl and Deck.GL GMP Overview: https://cloud.google.com/blog/products/maps-platform/webgl-powered-maps-features-now-generally-available?_gl=1*1k9rlfm*_ga*MTc4ODk2OTI0Ni4xNjYwMTQ1MTAz*_ga_NRWSTWS78N*MTY2NzIzMjI2NC4zLjEuMTY2NzIzMjI5NS4wLjAuMA..
- Using Deck.GL with GMP: https://deck.gl/docs/developer-guide/base-maps/using-with-google-maps
- More conceptiual demos surrounding Deck.GL: https://vis.gl/blog/
- Visualizing geospatial data with pydeck and Earth Engine: https://medium.com/google-earth/visualizing-geospatial-data-with-pydeck-and-earth-engine-8f77ce1fc8bb
- Deck.GL: https://deck.gl/



# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
