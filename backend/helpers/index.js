//helpers > index.js
const axios = require('axios');

// Directions API call
async function getDirections(origin, destination, date, time) {
  // Get API key from environment variables (.env file)
  const key = process.env.API;
  // Format date and time for API request
  const dateTime = new Date(`${date}T${time}`);
  const utcDateTime = new Date(dateTime.toUTCString()); // Convert to UTC time zone
  const unixTimestamp = Math.floor(utcDateTime.getTime() / 1000); // Convert milliseconds to seconds
  // Construct API URL with departure time parameter
  const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=transit&alternatives=true&departure_time=${unixTimestamp}&key=${key}`;

  try {
    const response = await axios.get(apiUrl);
    // Return directions data
    return response.data;
  } catch (error) {
    console.log("Error:", error);
    throw error; // Re-throw the error to handle it in the caller function
  }
}

// Export function
module.exports = {
  getDirections,
};
