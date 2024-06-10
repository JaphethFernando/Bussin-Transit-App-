import React, { useEffect, useState } from "react";
import * as bootstrap from 'bootstrap';
import "./index.css";

const NavigationBar = () => {
  const [activeSection, setActiveSection] = useState(""); // State to track active section

  useEffect(() => {
    // Initialize ScrollSpy when the component mounts
    const spy = new bootstrap.ScrollSpy(document.body, {
      target: '#navbarNav',
      offset: 100,
    });
    
    // Clean up ScrollSpy when the component unmounts
    return () => {
      spy.dispose();
    };
  }, []);

  // Function to handle scroll event
  const handleScroll = () => {
    const sections = document.querySelectorAll("section"); // Assuming your sections have 'section' tag
    let scrollPosition = window.scrollY;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollPosition >= top && scrollPosition < top + height) {
        setActiveSection(section.id); // Set active section based on scroll position
      }
    });
  };

  // Listen for scroll events
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
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
            <li className={`nav-item ${activeSection === "search" ? "active" : ""}`}>
              <a className="nav-link" href="#search1" onClick={handleSearchClick}>Search</a>
            </li>
            <li className={`nav-item ${activeSection === "bus" ? "active" : ""}`}>
              <a className="nav-link" href="#buses">Bus</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
