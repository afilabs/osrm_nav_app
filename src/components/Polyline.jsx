// Import the Layer and Source components from the "react-map-gl" library
import { Layer, Source } from "react-map-gl";

// Define the Polyline component
export default function Polyline({ coordinates, lineColor = "#4781E9" }) {
  // Define the GeoJSON data for the polyline
  const sourceData = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates,
    },
  };

  // Define the properties for the Line layer
  const layerProps = {
    type: "line",

    // Layout properties for the Line layer
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },

    // Paint properties for the Line layer
    paint: {
      "line-color": lineColor,
      "line-width": 3,
    },
  };

  // Render the Source component with the GeoJSON data
  // and the Layer component with the specified properties
  return (
    <Source type="geojson" data={sourceData}>
      <Layer {...layerProps} />
    </Source>
  );
}
