import React, { useState, useEffect } from "react";
import { parseDuration, getCurrentDate, getCurrentTime, getApiData } from '../../helpers'; // Import getApiData
import "./index.css";
import NavigationBar from '../NavBar/index';
import * as bootstrap from 'bootstrap'; // Import Bootstrap

const BusInfo = ({ startLocation, endLocation, setStartLocation, setEndLocation, onSearchClick }) => {
  // State variables
  const [apiData, setApiData] = useState({});
  const [searchClicked, setSearchClicked] = useState(false);
  const [departureDate, setDepartureDate] = useState(getCurrentDate());
  const [departureTime, setDepartureTime] = useState(getCurrentTime());
  const [currentDotIndex, setCurrentDotIndex] = useState(0);

  // Fetch data from API when search is clicked and dependencies change
  useEffect(() => {
    if (searchClicked && startLocation && endLocation) {
      getApiData(startLocation, endLocation, departureDate, departureTime, setApiData, setSearchClicked); // Use getApiData
    }
  }, [searchClicked, startLocation, endLocation, departureDate, departureTime]);

  // Function to handle search button click
  const handleSearch = () => {
    setSearchClicked(true);
    onSearchClick();
  };

  const getBusesToDestination = (destination) => {
    const buses = [];
    if (apiData.routes && apiData.routes.length > 0) {
      apiData.routes.forEach((route) => {
        route.legs.forEach((leg) => {
          if (leg.end_address === destination) {
            const legBuses = [];
            let currentBus = {};
            let walkingInstructions = [];
            leg.steps.forEach((step) => {
              if (step.travel_mode === "WALKING") {
                walkingInstructions.push(step.html_instructions || "");
              }
              if (step.transit_details && step.transit_details.line && step.transit_details.line.name) {
                const bus = {
                  name: step.transit_details.line.name,
                  shortName: step.transit_details.line.short_name || "",
                  numStops: step.transit_details.num_stops || "",
                  busStand: step.transit_details.departure_stop.name || "",
                  busDuration: step.duration || "",
                  instructions: walkingInstructions.slice(),
                  arrivalStop: step.transit_details.arrival_stop.name || "",
                  transferInstructions: []
                };
                walkingInstructions = [];
                if (step.transit_details.departure_stop_steps) {
                  step.transit_details.departure_stop_steps.forEach(stopStep => {
                    bus.instructions.push(stopStep.html_instructions);
                  });
                }
                if (currentBus.name && currentBus.name !== bus.name) {
                  currentBus.transferInstructions = walkingInstructions;
                  legBuses.push({ ...currentBus, isTransfer: true });
                }
                currentBus = bus;
              }
            });
            if (currentBus.name) {
              legBuses.push(currentBus);
            }
            if (legBuses.length > 0) {
              buses.push({
                legInfo: {
                  ...leg,
                  duration: leg.duration.text,
                },
                buses: legBuses,
              });
            }
          }
        });
      });
      buses.sort((a, b) => {
        const durationA = parseDuration(a.legInfo.duration);
        const durationB = parseDuration(b.legInfo.duration);
        return durationA - durationB;
      });
    }
    return buses;
  };

  // Calculate total dots for pagination
  const totalDots = apiData.routes && apiData.routes[0] && apiData.routes[0].legs ? Math.ceil(getBusesToDestination(apiData.routes[0].legs[0].end_address).length / 3) : 0;

  // Initialize ScrollSpy when the component mounts and clean up when unmounted
  useEffect(() => {
    const spy = new bootstrap.ScrollSpy(document.body, {
      target: '#navbarNav',
      offset: 50,
    });
    
    return () => {
      spy.dispose();
    };
  }, []);

  return (
    <>
      <header>
        <NavigationBar />
        <div id="search1" className="container mt-4">
          {/* Search form */}
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="startLocation" className="form-label">Start Location:</label>
              <input
                type="text"
                className="form-control"
                id="startLocation"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                autoComplete="on"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="endLocation" className="form-label">End Location:</label>
              <input
                type="text"
                className="form-control"
                id="endLocation"
                value={endLocation}
                onChange={(e) => setEndLocation(e.target.value)}
                autoComplete="on"
              />
            </div>
          </div>
          {/* Departure date and time */}
          <div className="row mt-3">
            <div className="col-md-6">
              <label htmlFor="departureDateTime" className="form-label">Departure Date and Time:</label>
              <input
                type="datetime-local"
                className="form-control"
                id="departureDateTime"
                value={`${departureDate}T${departureTime}`}
                onChange={(e) => {
                  const dateTime = e.target.value.split('T');
                  setDepartureDate(dateTime[0]);
                  setDepartureTime(dateTime[1]);
                }}
                min={`${getCurrentDate()}T${getCurrentTime()}`}
              />
            </div>
          </div>
          {/* Search button */}
          <div className="row mt-3">
            <div className="col-md-12">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSearch}
                disabled={!startLocation || !endLocation}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Render buses if data available */}
      {apiData.routes && apiData.routes.length > 0 && (
        <div id="buses" className="container mt-4">
          <div className="row">
            {/* Render buses */}
            {getBusesToDestination(apiData.routes[0].legs[0].end_address).slice(currentDotIndex * 3, (currentDotIndex * 3) + 3).map((bus, busIndex) => (
              <div key={busIndex} className="col-md-4">
                <div className="card">
                  <div id="bus" className="card-body">
                    {/* Destination and duration */}
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {bus.buses.map((busDetail, detailIndex) => (
                        <span key={detailIndex} className="badge-container">
                          {detailIndex > 0 && <span className="transfer-arrow"></span>}
                          <span className="badge bg-info mt-2 badge-custom">{busDetail.shortName}</span>
                        </span>
                      ))}
                    </div>
                    <h5 className="card-title">{bus.legInfo.duration}</h5>
                    <p>Bus arriving at: {bus.legInfo.departure_time.text}</p>
                    <p>Time to destination: {bus.legInfo.arrival_time.text}</p>
                    <ul className="list-group list-group-flush">
                      {/* Render bus details */}
                      {bus.buses.map((busDetail, detailIndex) => (
                        <li key={detailIndex} className="list-group-item bus-details">
                          {/* Bus badge */}
                          {busDetail.shortName && (
                            <div>
                              <span className="bus-badge">
                                <span className="badge bg-info mt-2 ShortName">{busDetail.shortName}</span>
                                <span className="bus-details">
                                  {detailIndex > 0 && <span className="badge bg-secondary mt-2">Transfer</span>}
                                  <span className="badge bg-primary mt-2">{busDetail.name}</span>
                                </span>
                              </span>
                              {/* Bus stand, duration, stops */}
                              <p><strong>Board at:</strong> {busDetail.busStand}</p>
                              <p><strong>Duration:</strong> {busDetail.busDuration.text}</p>
                              <p><strong>Stops:</strong> {busDetail.numStops}</p>
                              <p><strong>Get off at:</strong> {busDetail.arrivalStop}</p>
                              {/* Display walking instructions */}
                              {busDetail.instructions && (
                                <div className="walking-instructions">
                                  {busDetail.instructions.map((instruction, idx) => (
                                    <p key={idx}>{instruction}</p>
                                  ))}
                                </div>
                              )}
                              {/* Transfer instructions */}
                              {busDetail.transferInstructions && busDetail.transferInstructions.length > 0 && (
                                <div>
                                  <p><strong>Transfer Instructions:</strong></p>
                                  {busDetail.transferInstructions.map((instruction, idx) => (
                                    <p key={idx}>{instruction}</p>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination dots */}
          {totalDots > 1 && (
            <div className="text-center mt-3">
              {[...Array(totalDots)].map((_, index) => (
                <span
                  key={index}
                  className={`dot ${index === currentDotIndex ? 'active' : ''}`}
                  onClick={() => setCurrentDotIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default BusInfo;
