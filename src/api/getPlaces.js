export default async function getPlaces(query) {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
    );

    return response.json();
  } catch (error) {
    console.error("There was an error while fetching places:", error);
  }
}
