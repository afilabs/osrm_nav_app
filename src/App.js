// Import necessary React hooks and components
import React, { useEffect, useState } from "react";
import { Marker } from "react-map-gl";
import _flatten from "lodash/flatten";
import _isEmpty from "lodash/isEmpty";

// Import components and assets
import Map from "./components/Map";
import Polyline from "./components/Polyline";
import AutoCompleteInput from "./components/AddressInput";

import getDirection from "./api/getDirection";

import ArrowImportExport from "./assets/images/import_export.svg";
import OriginStep from "./assets/images/origin_step.svg";
import DestinationStep from "./assets/images/destination_step.svg";
import OriginMarker from "./assets/images/origin_marker.png";
import DestinationMarker from "./assets/images/destination_marker.png";
import OSRMLogo from "./assets/images/osrm_logo.png";

// Import Mapbox CSS file and custom styles
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.scss";
import { DIRECTION_ARROWS } from "./constants";

// Define the main App component
export default function App() {
  // State variables to manage route details, addresses, map center, and polyline coordinates
  const [polylineCoodinates, setPolylineCoordinates] = useState([]);
  const [originAddress, setOriginAddress] = useState({
    placeName: "",
    latitude: "",
    longitude: "",
  });
  const [destinationAddress, setDesitinationAddress] = useState({
    placeName: "",
    latitude: "",
    longitude: "",
  });
  const [mapCenter, setMapCenter] = useState([]);
  const [route, setRoute] = useState(null);

  // Effect to fetch route details when origin or destination address changes
  useEffect(() => {
    const getDirectionFunc = async () => {
      const res = await getDirection(originAddress, destinationAddress);
      const firstRoute = res.routes[0];
      const polylineCoodinatesTmp = _flatten(
        firstRoute?.legs[0]?.steps.map((step) => step.geometry.coordinates)
      );
      setRoute(firstRoute);
      setPolylineCoordinates(polylineCoodinatesTmp);
    };

    if (!originAddress.latitude || !destinationAddress.latitude) return;

    getDirectionFunc();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originAddress.latitude, destinationAddress.latitude]);

  // Effect to set map center based on the origin address
  useEffect(() => {
    if (!originAddress.latitude || !originAddress.longitude) return;
    setMapCenter([originAddress.longitude, originAddress.latitude]);
  }, [originAddress.latitude, originAddress.longitude]);

  // Effect to set map center based on the destination address
  useEffect(() => {
    if (!destinationAddress.latitude || !destinationAddress.longitude) return;
    setMapCenter([destinationAddress.longitude, destinationAddress.latitude]);
  }, [destinationAddress.latitude, destinationAddress.longitude]);

  // Handler for manual input change in the origin address
  const handleManualOriginAddressInputChange = (event) => {
    const newOriginAddress = {
      ...originAddress,
      placeName: event.target.value,
    };
    setOriginAddress(newOriginAddress);
  };

  // Handler for manual input change in the destination address
  const handleManualDestinationAddressInputChange = (event) => {
    const newDestinationAddress = {
      ...destinationAddress,
      placeName: event.target.value,
    };
    setDesitinationAddress(newDestinationAddress);
  };

  // Render the address input boxes
  const renderAddressBox = () => (
    <>
      <div className="address-controls">
        <div className="address-control">
          <span className="origin-circle"></span>
          <AutoCompleteInput
            setAddress={setOriginAddress}
            onManualInputChange={handleManualOriginAddressInputChange}
            placeName={originAddress.placeName}
            placeholder="Origin address"
          />
        </div>
        <div className="address-control">
          <span className="destination-circle"></span>
          <AutoCompleteInput
            setAddress={setDesitinationAddress}
            onManualInputChange={handleManualDestinationAddressInputChange}
            placeName={destinationAddress.placeName}
            placeholder="Destination address"
          />
        </div>
      </div>
      <img width={24} alt="Address control icon" src={ArrowImportExport} />
    </>
  );

  // Render the detailed information about the route
  const renderDirectionDetail = () => {
    if (_isEmpty(route)) return null;
    const steps = route?.legs[0]?.steps || [];
    return (
      <>
        <div className="summary-info">
          <div className="distance">
            <p>Distance</p>
            <p>{((route?.distance || 0) / 1000)?.toFixed(2)} km</p>
          </div>
          <div className="duration">
            <p>Duration</p>
            <p>{((route?.duration || 0) / 60)?.toFixed(2)} min</p>
          </div>
        </div>
        {steps?.length && (
          <div className="step-list">
            <div className="item">
              <div className="step-name">
                <img width={24} alt="Step icon" src={OriginStep} />
                <span>{steps[0]?.name}</span>
              </div>
              <span>{steps[0]?.distance} m</span>
            </div>
            {steps?.map((step, idx) => {
              if (idx === 0 || idx === steps.length - 1) return null;
              return (
                <div
                  className="item"
                  onClick={() => setMapCenter(step.maneuver.location)}
                >
                  <div className="step-name">
                    <img
                      width={24}
                      alt="Step icon"
                      src={DIRECTION_ARROWS[step.maneuver.modifier]}
                    />
                    <span>{step.name}</span>
                  </div>
                  <span>{step.distance} m</span>
                </div>
              );
            })}
            <div className="item">
              <div className="step-name">
                <img width={24} alt="Step icon" src={DestinationStep} />
                <span>{steps[steps?.length - 1]?.name}</span>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  // Render the main application structure
  return (
    <div className="App">
      <div className="address-box">{renderAddressBox()}</div>
      <Map mapCenter={mapCenter}>
        {polylineCoodinates && <Polyline coordinates={polylineCoodinates} />}
        {originAddress.latitude && (
          <Marker
            longitude={originAddress.longitude}
            latitude={originAddress.latitude}
          >
            <img alt="Origin Marker" src={OriginMarker} style={{ width: 48 }} />
          </Marker>
        )}
        {destinationAddress.latitude && (
          <Marker
            longitude={destinationAddress.longitude}
            latitude={destinationAddress.latitude}
            siz
          >
            <img
              alt="Destination Marker"
              src={DestinationMarker}
              style={{ width: 48 }}
            />
          </Marker>
        )}
      </Map>
      <div className="direction-detail">
        <div style={{padding: 16}}>
          <img className="logo" alt="Logo" src={OSRMLogo} />
          {renderDirectionDetail()}
        </div>
      </div>
    </div>
  );
}
