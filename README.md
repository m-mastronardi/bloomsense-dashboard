# BloomSense - Greenhouse Sensor Logger

## Project Overview

BloomSense is a greenhouse sensor logging dashboard created using HTML, CSS, and vanilla JavaScript. The application allows users to enter environmental measurements for different greenhouse bays and monitor their conditions.

The dashboard records pH, electrical conductivity (EC), temperature, and relative humidity. Based on the measurements entered, the application classifies the greenhouse conditions as Optimal, Warning, or Critical Hazard.

## Features

- Record sensor readings for Greenhouse Bays A, B, and C.
- Enter pH, electrical conductivity, temperature, and humidity measurements.
- Validate sensor inputs and display error messages for invalid values.
- Classify greenhouse conditions as Optimal, Warning, or Critical Hazard.
- Display recorded measurements and timestamps in the sensor log history.
- Track total records, optimal readings, and warnings/hazards.
- Delete individual sensor records or clear the entire history.
- Save records using localStorage so they remain after refreshing the page.
- Responsive dashboard layout for different screen sizes.

## Technologies Used

- **HTML5:** Page structure, forms, and input constraints.
- **CSS3:** Dashboard styling, responsive layout, and visual feedback.
- **JavaScript:** Input validation, sensor classification, DOM updates, and event handling.
- **localStorage:** Stores sensor readings in the browser.

## How to Run the Application

1. Download or clone the project repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` using Live Server or a web browser.
4. Select a greenhouse bay and enter the sensor measurements.
5. Click **Record Reading** to save the measurements.
6. View the sensor status and recorded values in the log history.

No additional libraries or installations are required.

## Input Validation

The application uses HTML input constraints and JavaScript validation to prevent invalid measurements from being recorded.

| Sensor                  | Input Requirements                |
| ----------------------- | --------------------------------- |
| Greenhouse Bay          | Must select A, B, or C            |
| pH Level                | Number between 0 and 14           |
| Electrical Conductivity | Number greater than or equal to 0 |
| Temperature             | Valid numeric value in °F         |
| Relative Humidity       | Number between 0 and 100%         |

Numeric inputs use increments of 0.1. Invalid fields display an error message and change appearance until corrected.

## Sensor Classifications

BloomSense evaluates the recorded sensor measurements and assigns one of three classifications.

- **Optimal:** All sensor measurements are within the defined optimal ranges.
- **Warning:** One or more measurements are outside the optimal range but have not reached a critical threshold.
- **Critical Hazard:** One or more measurements exceed the defined critical thresholds.

Critical conditions are checked first, followed by warning conditions. If neither applies, the reading is classified as Optimal.

## User Workflow

1. **Data Entry:** Select a greenhouse bay and enter sensor measurements.
2. **Validation:** The application checks the inputs and displays errors when necessary.
3. **Record Submission:** Click Record Reading to validate, classify, and save the measurements.
4. **Log History:** Review saved sensor readings and their environmental classifications.
5. **Record Management:** Delete individual readings or use Clear All to remove the saved history.

## JavaScript Functionality

The JavaScript code uses an Immediately Invoked Function Expression (IIFE) and strict mode.

The application includes:

- Event listeners for form submission and live input validation.
- DOM manipulation to create and update sensor cards.
- `DocumentFragment` to add sensor records to the page.
- Event delegation to handle individual record deletion.
- Arrays and objects to manage sensor data.
- `JSON.stringify()` and `JSON.parse()` for localStorage.
- Error handling when loading or saving records.

## Data Storage

Each sensor record contains:

- Unique record ID
- Greenhouse bay
- pH level
- Electrical conductivity
- Temperature
- Relative humidity
- Environmental status
- Timestamp

Records are stored in an array and saved to the browser's localStorage. This allows the log history to remain available after refreshing or reopening the application in the same browser.

## Project Files

- `index.html` - Dashboard structure and sensor form
- `styles.css` - Styling and responsive layout
- `app.js` - Application logic and sensor validation
- `README.md` - Project documentation

## Author

Maria Mastronardi

Web and Mobile Systems  
Oakland University  
Fall 2026
