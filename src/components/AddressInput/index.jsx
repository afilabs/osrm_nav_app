// Import React and useState hook from React library
import React, { useState } from "react";

// Import the getPlaces function from the specified path
import getPlaces from "../../api/getPlaces";

// Import the styles for the component
import "./AddressInput.scss";

// Define the AddressInput component
export default function AddressInput({
  onManualInputChange,
  setAddress,
  placeName,
  ...others
}) {
  // State to manage suggestions for the input field
  const [suggestions, setSuggestions] = useState([]);

  // Asynchronous function to query places based on user input
  const queryPlaces = async (query) => {
    // Call the getPlaces API function with the provided query
    const res = await getPlaces(query);

    // Set the suggestions state with the features from the API response
    setSuggestions(res.features);
  };

  // Event handler for manual input change in the text input
  const handleChange = (event) => {
    // Call the onManualInputChange callback with the event and "placeName"
    onManualInputChange(event, "placeName");

    // Query places based on the current input value
    queryPlaces(event.target.value);
  };

  // Event handler for selecting a suggestion from the list
  const handleSelectSuggestion = ({ place_name, center }) => {
    // Create an address object from the selected suggestion
    const address = {
      placeName: place_name,
      longitude: center[0],
      latitude: center[1],
    };

    // Set the address state with the selected address
    setAddress(address);

    // Clear the suggestions list
    setSuggestions([]);
  };

  // Render the AddressInput component
  return (
    <div className="address-input-container">
      {/* Input field for the address with provided props */}
      <input
        type="text"
        value={placeName}
        onChange={handleChange}
        {...others}
      />

      {/* List to display address suggestions */}
      <ul className="address-suggestions">
        {/* Map through suggestions and render each as a list item */}
        {suggestions?.map((suggestion, index) => (
          <li key={index} onClick={() => handleSelectSuggestion(suggestion)}>
            {/* Display the place name from the suggestion */}
            {suggestion.place_name}
          </li>
        ))}
      </ul>
    </div>
  );
}
