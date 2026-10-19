(function () {
  "use strict";

  // local storage
  const STORAGE_KEY = "bloomsense_sensor_records_v1";

  // get html elements
  const sensorForm = document.getElementById("sensor-form");
  const errorBanner = document.getElementById("form-error-banner");
  const logList = document.getElementById("log-list");
  const queueCount = document.getElementById("queue-count");
  const emptyMessage = document.getElementById("empty-message");
  const clearAllButton = document.getElementById("clear-all");

  // sensor inputs
  const inputBay = document.getElementById("bay");
  const inputPh = document.getElementById("ph");
  const inputEc = document.getElementById("ec");
  const inputTemp = document.getElementById("temp");
  const inputHumidity = document.getElementById("humidity");

  // dashboard counters
  const totalCount = document.getElementById("total-count");
  const optimalCount = document.getElementById("optimal-count");
  const alertCount = document.getElementById("alert-count");

  const sensorInputs = [inputBay, inputPh, inputEc, inputTemp, inputHumidity];

  let records = loadRecords();
  render();

  // load saved records
  function loadRecords() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Failed to load sensor records", error);
      return [];
    }
  }

  // save records
  function saveRecords() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (error) {
      console.error("Failed to save sensor records", error);
      displayError("Unable to save readings to browser storage.");
    }
  }

  // sensor classification
  function evaluateStatus(ph, ec, temp, humidity) {
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

    return { level: "optimal", label: "Optimal" };
  }

  // input validation
  function validateInput(data) {
    const errors = [];

    if (!["A", "B", "C"].includes(data.bay)) {
      errors.push("Please select a valid greenhouse bay.");
    }

    if (!Number.isFinite(data.ph) || data.ph < 0 || data.ph > 14) {
      errors.push("pH must be a number between 0 and 14.");
    }

    if (!Number.isFinite(data.ec) || data.ec < 0) {
      errors.push("EC must be a number greater than or equal to 0.");
    }

    if (!Number.isFinite(data.temperature)) {
      errors.push("Temperature must be a valid number.");
    }

    if (
      !Number.isFinite(data.humidity) ||
      data.humidity < 0 ||
      data.humidity > 100
    ) {
      errors.push("Humidity must be a number between 0 and 100%.");
    }

    return errors;
  }

  // live validation
  function validateField(input) {
    const value = input.value.trim();
    const errorElement = document.getElementById(input.id + "-error");
    let message = "";

    if (input.validity.badInput) {
      message = "Please enter a valid number.";
    } else if (value === "") {
      message = "This field is required.";
    } else if (input === inputBay) {
      if (!["A", "B", "C"].includes(value)) {
        message = "Please select a valid bay.";
      }
    } else if (!Number.isFinite(Number(value))) {
      message = "Please enter a valid number.";
    } else if (input.validity.rangeUnderflow || input.validity.rangeOverflow) {
      message = "Value is outside the allowed range.";
    } else if (input.validity.stepMismatch) {
      message = "Please enter a value in increments of 0.1.";
    }

    errorElement.textContent = message;

    if (message !== "") {
      input.classList.add("input-invalid");
      input.setAttribute("aria-invalid", "true");
    } else {
      input.classList.remove("input-invalid");
      input.setAttribute("aria-invalid", "false");
    }

    return message;
  }

  sensorInputs.forEach(function (input) {
    const eventName = input === inputBay ? "change" : "input";

    input.addEventListener(eventName, function () {
      validateField(input);
    });
  });

  // form submission
  sensorForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const fieldErrors = [];

    sensorInputs.forEach(function (input) {
      const message = validateField(input);

      if (message !== "") {
        fieldErrors.push(message);
      }
    });

    if (fieldErrors.length > 0) {
      displayError("Please correct the highlighted fields.");
      return;
    }

    const formData = {
      id: crypto.randomUUID(),
      bay: inputBay.value,
      ph: Number(inputPh.value),
      ec: Number(inputEc.value),
      temperature: Number(inputTemp.value),
      humidity: Number(inputHumidity.value),
      timestamp: new Date().toLocaleString(),
    };

    const validationErrors = validateInput(formData);

    if (validationErrors.length > 0) {
      displayError(validationErrors.join(" "));
      return;
    }

    hideError();

    formData.status = evaluateStatus(
      formData.ph,
      formData.ec,
      formData.temperature,
      formData.humidity,
    );

    records.unshift(formData);
    saveRecords();

    sensorForm.reset();

    sensorInputs.forEach(function (input) {
      input.classList.remove("input-invalid");
      input.removeAttribute("aria-invalid");
      document.getElementById(input.id + "-error").textContent = "";
    });

    render();
    inputBay.focus();
  });

  // delete individual record
  logList.addEventListener("click", function (event) {
    const target = event.target;

    if (target.classList.contains("delete-record")) {
      const recordId = target.dataset.id;

      records = records.filter(function (record) {
        return record.id !== recordId;
      });

      saveRecords();
      render();
    }
  });

  // clear all records
  clearAllButton.addEventListener("click", function () {
    if (records.length === 0) {
      return;
    }

    if (confirm("Are you sure you want to delete all sensor readings?")) {
      records = [];
      saveRecords();
      render();
    }
  });

  // render sensor records
  function render() {
    queueCount.textContent = records.length;
    totalCount.textContent = records.length;

    const optimalRecords = records.filter(function (record) {
      return record.status.level === "optimal";
    });

    optimalCount.textContent = optimalRecords.length;
    alertCount.textContent = records.length - optimalRecords.length;

    if (records.length === 0) {
      emptyMessage.classList.remove("hidden");
      logList.innerHTML = "";
      return;
    }

    emptyMessage.classList.add("hidden");

    const fragment = document.createDocumentFragment();

    records.forEach(function (record) {
      const article = document.createElement("article");

      article.className = "sensor-record status-" + record.status.level;

      article.innerHTML = `
        <div class="record-header">
          <div>
            <h3>Greenhouse Bay ${escapeHtml(record.bay)}</h3>
            <p class="record-time">
              Logged at ${escapeHtml(record.timestamp)}
            </p>
          </div>

          <span class="status">
            ${escapeHtml(record.status.label)}
          </span>
        </div>

        <div class="record-readings">
          <div class="record-reading">
            <span>pH Level</span>
            <strong>${record.ph.toFixed(1)}</strong>
          </div>

          <div class="record-reading">
            <span>Electrical Conductivity</span>
            <strong>${record.ec.toFixed(1)} mS/cm</strong>
          </div>

          <div class="record-reading">
            <span>Temperature</span>
            <strong>${record.temperature.toFixed(1)} °F</strong>
          </div>

          <div class="record-reading">
            <span>Relative Humidity</span>
            <strong>${record.humidity.toFixed(1)}%</strong>
          </div>
        </div>

        <button
          type="button"
          class="delete-record"
          data-id="${escapeHtml(record.id)}">
          Delete Record
        </button>
      `;

      fragment.appendChild(article);
    });

    logList.innerHTML = "";
    logList.appendChild(fragment);
  }

  // error messages
  function displayError(message) {
    errorBanner.textContent = message;
    errorBanner.classList.remove("hidden");
  }

  function hideError() {
    errorBanner.textContent = "";
    errorBanner.classList.add("hidden");
  }

  // escape html
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
})();
