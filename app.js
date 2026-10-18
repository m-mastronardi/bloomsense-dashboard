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

  // Determine the status of greenhouse conditions
  function evaluateStatus(ph, ec, temp, humidity) {
    // Check for critical conditions first
    if (
      ph < 4.5 ||
      ph > 7.5 ||
      ec < 0.5 ||
      ec > 3.5 ||
      temp < 55 ||
      temp > 90 ||
      humidity < 30 ||
      humidity > 85
    ) {
      return { level: "critical", label: "Critical Hazard" };
    }

    // Check for warning conditions
    if (
      ph < 5.5 ||
      ph > 6.5 ||
      ec < 1.0 ||
      ec > 2.5 ||
      temp < 65 ||
      temp > 80 ||
      humidity < 50 ||
      humidity > 70
    ) {
      return { level: "warning", label: "Warning" };
    }

    // Otherwise, conditions are optimal
    return { level: "optimal", label: "Optimal" };
  }

  /* ========================================
     INPUT VALIDATION
  ======================================== */

  // Check sensor readings for invalid values
  function validateInput(data) {
    const errors = [];

    // Greenhouse Bay must be selected
    if (!["A", "B", "C"].includes(data.bay)) {
      errors.push("Please select a valid greenhouse bay.");
    }

    // pH must be between 0 and 14
    if (!Number.isFinite(data.ph) || data.ph < 0 || data.ph > 14) {
      errors.push("pH must be a number between 0 and 14.");
    }

    // Electrical Conductivity cannot be negative
    if (!Number.isFinite(data.ec) || data.ec < 0) {
      errors.push("EC must be a number greater than or equal to 0.");
    }

    // Temperature must be a valid number
    if (!Number.isFinite(data.temperature)) {
      errors.push("Temperature must be a valid number.");
    }

    // Humidity must be between 0 and 100
    if (
      !Number.isFinite(data.humidity) ||
      data.humidity < 0 ||
      data.humidity > 100
    ) {
      errors.push("Humidity must be a number between 0 and 100%.");
    }

    return errors;
  }

  /* ========================================
     FORM SUBMISSION
  ======================================== */

  // Run this code when the user submits the sensor form
  sensorForm.addEventListener("submit", function (event) {
    // Prevent the page from refreshing
    event.preventDefault();

    // Collect the user's sensor readings
    const formData = {
      id: crypto.randomUUID(),
      bay: inputBay.value,
      ph: Number(inputPh.value),
      ec: Number(inputEc.value),
      temperature: Number(inputTemp.value),
      humidity: Number(inputHumidity.value),
      timestamp: new Date().toLocaleString(),
    };

    // Check that all fields have been filled out
    if (
      inputBay.value === "" ||
      inputPh.value.trim() === "" ||
      inputEc.value.trim() === "" ||
      inputTemp.value.trim() === "" ||
      inputHumidity.value.trim() === ""
    ) {
      displayError("Please complete all sensor fields.");
      return;
    }

    // Check that sensor values are valid
    const validationErrors = validateInput(formData);

    if (validationErrors.length > 0) {
      displayError(validationErrors.join(" "));
      return;
    }

    // Hide previous error messages
    hideError();

    // Classify the greenhouse conditions
    formData.status = evaluateStatus(
      formData.ph,
      formData.ec,
      formData.temperature,
      formData.humidity,
    );

    // Add the newest reading to the beginning of the array
    records.unshift(formData);

    // Save the updated records to local storage
    saveRecords();

    // Reset the form
    sensorForm.reset();

    // Update the dashboard
    render();

    // Move the cursor back to the first input
    inputBay.focus();
  });
})();
