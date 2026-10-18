(function () {
  "use strict";

  // Name for our browser's local storage
  const STORAGE_KEY = "bloomsense_sensor_records_v1";

  // Grab HTML elements using the document API
  const sensorForm = document.getElementById("sensor-form");
  const errorBanner = document.getElementById("form-error-banner");
  const logList = document.getElementById("log-list");
  const queueCount = document.getElementById("queue-count");
  const emptyMessage = document.getElementById("empty-message");
  const clearAllButton = document.getElementById("clear-all");

  // Grab sensor input fields
  const inputBay = document.getElementById("bay");
  const inputPh = document.getElementById("ph");
  const inputEc = document.getElementById("ec");
  const inputTemp = document.getElementById("temp");
  const inputHumidity = document.getElementById("humidity");

  // Grab dashboard counters
  const totalCount = document.getElementById("total-count");
  const optimalCount = document.getElementById("optimal-count");
  const alertCount = document.getElementById("alert-count");

  // Initialize the records array
  let records = loadRecords();

  // Display previously saved records
  render();

  // READ: Load previously saved sensor records
  function loadRecords() {
    try {
      // Retrieve data from the browser's local storage
      const stored = localStorage.getItem(STORAGE_KEY);

      // Convert stored JSON back into an array
      return stored ? JSON.parse(stored) : [];

    } catch (error) {
      console.error("Failed to load sensor records", error);
      return [];
    }
  }

  // WRITE: Save sensor records to local storage
  function saveRecords() {
    try {
      // Convert the records array into JSON and save it
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));

    } catch (error) {
      console.error("Failed to save sensor records", error);
    }
  }