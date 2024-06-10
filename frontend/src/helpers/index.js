// helpers/index.js
import axios from 'axios';

// Function to parse duration string into total seconds and total minutes
export const parseDuration = (duration) => {
  const parts = duration.split(" ");
  let totalSeconds = 0;
  let totalMinutes = 0;
  parts.forEach((part) => {
    if (part.includes("h")) {
      totalSeconds += parseInt(part.replace('h', '')) * 3600;
      totalMinutes += parseInt(part.replace('h', '')) * 60;
    } else if (part.includes("min")) {
      totalSeconds += parseInt(part.replace('min', '')) * 60;
      totalMinutes += parseInt(part.replace('min', ''));
    }
  });
  return { totalSeconds, totalMinutes };
};

// Function to get the current date in the format "YYYY-MM-DD"
export const getCurrentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Function to get the current time in the format "HH:MM"
export const getCurrentTime = () => {
  const currentTime = new Date();
  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Function to fetch data from the API
export const getApiData = async (start, end, date, time, setApiData, setSearchClicked) => {
  try {
    const response = await axios.get(`http://127.0.0.1:5000/get-directions?start=${start}&end=${end}&date=${date}&time=${time}`);
    setApiData(response.data);
  } catch (err) {
    console.error("Error fetching data:", err);
  } finally {
    setSearchClicked(false);
  }
};