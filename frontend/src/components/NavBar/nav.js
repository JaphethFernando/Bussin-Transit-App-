import React, { useEffect } from "react";
import * as bootstrap from 'bootstrap';
import "./nav.css";

const NavigationBar = () => {
  useEffect(() => {
    const spy = new bootstrap.ScrollSpy(document.body, {
      target: '#navbarNav',
      offset: 100,
    });
    
    return () => {
      spy.dispose();
    };
  }, []);

  const handleSearchClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
  };

  return (
    <nav id="navbarNav" className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container">
        <a className="navbar-brand" href="#">Bussin</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link active" href="#search" onClick={handleSearchClick}>Search</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#route">Route</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#bus">Bus</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#map">Map</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
