# Chandigarh Sector 17 — 3D Browser Game

A single-player, browser-based 3D exploration game set in a stylized, playable reconstruction of Chandigarh's Sector 17 plaza. Walk around the city centre, explore its landmarks and underpass, interact with shops, and drive licensed 3D vehicle models. The project uses mapped OpenStreetMap roads and building footprints with hand-built game scenery.

This is a game-scale reconstruction, not a 1:1 surveyed model or photogrammetry scan. Some landmarks, shop fronts, people, and traffic are authored or procedural representations.

## Run locally

Requirements: Node.js 20.19+ or 22.12+ and npm.

```sh
npm install
npm run dev
```

Vite prints the local URL (usually `http://localhost:5173`). For a production build and local preview:

```sh
npm run build
npm run preview
```

`npm run lint` runs Oxlint.

## Controls

| Input | Action |
| --- | --- |
| W / A / S / D or arrow keys | Walk; steer and accelerate while driving |
| Shift | Sprint |
| Space | Jump |
| E | Interact with nearby landmarks, shops, and stalls |
| F | Enter or leave the selected nearby vehicle |
| V | Cycle vehicle camera views |
| H | Honk while driving |
| Mouse drag / pointer lock | Look around |
| Click the minimap | Set a walking waypoint |
| Day / Sunset / Night controls | Change lighting and night-time scene details |
| Punjabi Radio | Start a six-song playlist; the next official YouTube video queues automatically |
| Esc | Pause or resume |
| Touchscreen | On-screen movement pad and action buttons; drag the scene to turn |

Additional interface buttons open character customization, shopping, and photo/postcard features. Their availability can depend on being near the relevant location.

## Current gameplay

- Walkable plaza with keyboard movement, jumping, camera follow, and waypoint navigation.
- Building-footprint collision from mapped OSM geometry, broad-phase collision for authored scene meshes, and moving collision bounds for pedestrians and traffic. Movement slides along clear wall edges.
- Selectable driveable garage using credited 3D models for Hyundai Creta, Suzuki Swift (2022), Toyota Fortuner, Jeep Wrangler, BMW X5 M Competition, Lamborghini Urus, and Ferrari F8 Tributo. Vehicle dimensions, handling, lighting, and collision bounds are fitted to each model. Mahindra Thar, Scorpio-N, Maruti Suzuki WagonR, and Hyundai Venue remain unavailable until authentic, redistributable models are sourced; the garage does not substitute generic car shapes for them.
- Moving road traffic and scooters.
- Day, sunset, and night scene modes; Sector 17 landmarks, shopfronts, plaza pedestrians, lighting, fountain, and an underground passage reconstruction.
- Character customization, simple interactions, procedural audio, and postcard capture.
- Score Club entry and exit markers: step onto the pink circle outside or inside to move between the street and club floor.
- Punjabi Radio playlist featuring Diljit Dosanjh, Yo Yo Honey Singh, Sunanda Sharma, Sidhu Moose Wala, Masoom Sharma, and Shubh. Tracks stream from their YouTube video embeds; audio is not bundled with the game.

## Technology and project layout

- React 19, TypeScript, Vite 8
- Three.js with React Three Fiber and Drei
- Zustand for local game state
- `src/App.tsx`: game scene, controls, player, and traffic
- `src/components/`: environment, characters, collision, UI, and interaction systems
- `src/components/VehicleModel.tsx` and `vehicleCatalog.ts`: selectable garage vehicle models and driving specs
- `public/sector17-osm.json`: local road and building-footprint data
- `public/models/`: character and vehicle GLB models

## Map data and assets

The map data is derived from OpenStreetMap contributors and is available under the [Open Database License (ODbL)](https://www.openstreetmap.org/copyright). The local map is centered near Sector 17 City Centre (approximately 30.74105° N, 76.77902° E). Preserve the attribution and ODbL notice when redistributing derived map data.

The 3D models are included in `public/models/`. Vehicle model sources and required CC BY 4.0 credits are listed in [`public/models/vehicles/CREDITS.md`](public/models/vehicles/CREDITS.md). The source files are redistributed from the `pedrosoandre/carros` collection; that collection simplified, pruned, and meshopt-compressed its Sketchfab models for web delivery. This game normalizes their orientation and scale at runtime. This project does not claim affiliation with vehicle manufacturers or real businesses shown as shop references.
