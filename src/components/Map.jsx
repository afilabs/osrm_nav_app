// Import React, useEffect, and useRef from the React library
import React, { useEffect, useRef } from "react";

// Import the ReactMapGL component from the "react-map-gl" library
import ReactMapGL from "react-map-gl";

// Import the Mapbox CSS file for styling
import "mapbox-gl/dist/mapbox-gl.css";

// Import constants for default map center and zoom
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "../constants";

// Define the initial view state for the map
const initialViewState = {
  latitude: DEFAULT_MAP_CENTER[1],
  longitude: DEFAULT_MAP_CENTER[0],
  zoom: DEFAULT_MAP_ZOOM,
};

// Define the Map component
export default function Map({ children, mapCenter }) {
  // Create a ref to store the map instance
  const mapRef = useRef(null);

  // Effect to handle changes in the mapCenter prop
  useEffect(() => {
    // If mapCenter is not provided or is an empty array, return early
    if (!mapCenter?.length) return;

    // Fly to the new center using the mapRef's current value
    mapRef.current?.flyTo({ center: mapCenter });
  }, [mapCenter]);

  // Render the ReactMapGL component
  return (
    <ReactMapGL
      // Pass the mapRef to the ReactMapGL component
      ref={mapRef}

      // Set the initial view state for the map
      initialViewState={initialViewState}

      // Apply inline styles to set the height of the map
      style={{ height: "100vh" }}

      // Set the Mapbox map style URL
      // mapStyle="mapbox://styles/theprof/cl4564gdx001k14kf9jith1id"
      mapStyle="mapbox://styles/theprof/cl8nwpgtl004z15mi7tjvhoaf"

      // Pass the Mapbox access token from environment variables
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
    >
      {/* Render children components within the map */}
      {children}
    </ReactMapGL>
  );
}
