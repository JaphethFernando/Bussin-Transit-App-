import React, { useState } from "react";
import BusInfo from './components/BusInfo';
import './app.css';

const App = () => {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);

  const handleSearchClick = () => {
    setSearchClicked(true);
  };

  return (
    <div>
      <BusInfo
        startLocation={startLocation}
        endLocation={endLocation}
        setStartLocation={setStartLocation}
        setEndLocation={setEndLocation}
        onSearchClick={handleSearchClick} // Pass the search click handler to the Header
      />
    </div>
  );
};

export default App;
