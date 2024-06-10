import React from "react";
import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";

const MapComponent = ({ apiData, isLoading, error }) => {
    const decodePolyline = (encoded) => {
      let index = 0,
        len = encoded.length,
        lat = 0,
        lng = 0,
        points = [];
  
      while (index < len) {
        let b,
          shift = 0,
          result = 0;
        do {
          b = encoded.charAt(index++).charCodeAt(0) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
        } while (b >= 0x20);
        let dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
        lat += dlat;
        shift = 0;
        result = 0;
        do {
          b = encoded.charAt(index++).charCodeAt(0) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
        } while (b >= 0x20);
        let dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
        lng += dlng;
  
        points.push({ lat: lat / 1e5, lng: lng / 1e5 });
      }
      return points;
    };

    const getPolylineOptions = (travelMode) => {
      switch (travelMode) {
        case 'WALKING':
          return {
            geodesic: true,
            strokeColor: '#2196F3', // Blue color for walking
            strokeOpacity: 1.0,
            strokeWeight: 2,
          };
        case 'TRANSIT':
          return {
            geodesic: true,
            strokeColor: '#FF0000', // Red color for transit
            strokeOpacity: 1.0,
            strokeWeight: 2,
          };
        default:
          return {
            geodesic: true,
            strokeColor: '#000000', // Black color for other modes
            strokeOpacity: 1.0,
            strokeWeight: 2,
          };
      }
    };
  
    return (
      <LoadScript googleMapsApiKey="YOURAIzaSyCUdcZO9tU7RfKe12ZwMQVnAgwP1vOTD5k_API_KEY">
        <GoogleMap
          id="map"
          mapContainerStyle={{ width: '100%', height: '400px' }}
          zoom={14}
          center={{
            lat: apiData.routes?.[0]?.legs?.[0]?.start_location?.lat || 0,
            lng: apiData.routes?.[0]?.legs?.[0]?.start_location?.lng || 0,
          }}
        >
          {isLoading && <div>Loading map data...</div>}
          {error && <div>Error fetching data: {error.message}</div>}
  
          {apiData.routes &&
            apiData.routes[0] &&
            apiData.routes[0].legs &&
            apiData.routes[0].legs[0] && (
              <>
                <Marker
                  position={{
                    lat: apiData.routes[0].legs[0].start_location.lat,
                    lng: apiData.routes[0].legs[0].start_location.lng,
                  }}
                  title="Start Location"
                />
                <Marker
                  position={{
                    lat: apiData.routes[0].legs[0].end_location.lat,
                    lng: apiData.routes[0].legs[0].end_location.lng,
                  }}
                  title="End Location"
                />
              </>
            )}
  
          {apiData.routes &&
            apiData.routes[0] &&
            apiData.routes[0].legs &&
            apiData.routes[0].legs.map((leg) =>
              leg.steps.map((step) =>
                step.polyline && step.polyline.points ? (
                  <Polyline
                    key={step.polyline.points}
                    path={decodePolyline(step.polyline.points)}
                    options={getPolylineOptions(step.travel_mode)}
                  />
                ) : null
              )
            )}
        </GoogleMap>
      </LoadScript>
    );
  };
  
  export default MapComponent;