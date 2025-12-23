# 🌾 किसान मौसम - Farmer Weather & Irrigation Decision App

**Making invisible weather data visible and actionable for Punjab farmers.**

A minimal, farmer-friendly web application that helps small and medium-scale organic farmers in Punjab make data-driven irrigation decisions based on real-time weather data and simple thresholds.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Decision Logic](#decision-logic)
- [Organic Farming Tips](#organic-farming-tips)
- [Troubleshooting](#troubleshooting)
- [Extending the App](#extending-the-app)
- [Technical Stack](#technical-stack)

---

## 🎯 Overview

### Problem Statement
Punjab farmers often over-irrigate, wasting precious water resources. Manual decision-making about irrigation timing lacks data support, especially for small farmers with limited resources.

### Solution
This app provides:
- **Real-time weather data** from OpenWeatherMap API
- **Simple, threshold-based irrigation decisions** (no complex ML)
- **Bilingual interface** (English & Punjabi)
- **Color-coded indicators** (Green/Orange/Red) for quick understanding
- **Organic farming tips** aligned with water conservation
- **Farmer-friendly UI** designed for low technical literacy

### Impact
- Save water through data-driven decisions
- Support organic farming practices
- Reduce irrigation costs
- Easy to extend for soil moisture sensors

---

## ✨ Features

### 1. **Weather Data Integration**
- Real-time and 5-day forecast weather data
- Temperature, humidity, rainfall probability, wind speed
- Location-based data for all Punjab districts
- GPS support for precise locations

### 2. **Intelligent Decision Logic**
```
IF rainfall_probability >= 50%
    → "Minimal watering needed" (Green ✅)
ELSE IF rainfall_probability >= 30%
    → "Moderate irrigation" (Orange ⚠️)
ELSE
    → "Regular irrigation required" (Red 🔴)
```

### 3. **Organic Farming Context**
- Mulching recommendations
- Water conservation techniques
- Natural pest management
- Soil health improvements
- Tips in both English and Punjabi

### 4. **Accessibility & Usability**
- Large, readable text (18px minimum)
- High-contrast colors for visibility
- Simple icons and color indicators
- Minimal interface with no distracting animations
- Mobile-friendly responsive design
- Punjabi language support

### 5. **Scalability**
- Clean, modular code structure
- Easy to add soil moisture sensors
- Extensible threshold system
- Support for multiple crop types
- Ready for farmer feedback integration

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for weather API
- Free OpenWeatherMap API key

### Step 1: Get OpenWeatherMap API Key

1. Visit [https://openweathermap.org/api](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to "API keys" tab
4. Copy your default API key

### Step 2: Configure the App

1. Open `config.js` in any text editor
2. Find this line:
   ```javascript
   API_KEY: 'YOUR_OPENWEATHERMAP_API_KEY_HERE',
   ```
3. Replace with your actual API key:
   ```javascript
   API_KEY: 'abc123def456ghi789',
   ```
4. Save the file

### Step 3: Run the App

**Option A: Using Python (recommended)**
```bash
cd weather-irrigation-app
python -m http.server 8000
```
Then open: http://localhost:8000

**Option B: Using Node.js (http-server)**
```bash
npm install -g http-server
cd weather-irrigation-app
http-server
```
Then open: http://localhost:8080

**Option C: Direct File Access**
- Simply open `index.html` in your browser
- Note: GPS may not work in file:// protocol due to security

### Step 4: Test with Demo Data

Without configuring the API key, test the UI:
```javascript
// Open browser console (F12)
// Type:
simulateWeatherData()
```

This loads mock data and demonstrates the full UI.

---

## ⚙️ Configuration

### config.js

#### API Configuration
```javascript
WEATHER_API: 'https://api.openweathermap.org/data/2.5/forecast'
API_KEY: 'YOUR_OPENWEATHERMAP_API_KEY_HERE'
```

#### Decision Thresholds
```javascript
RAINFALL_THRESHOLD: 50          // If >= 50%, minimal watering
MIN_TEMP_IRRIGATION: 5          // Below 5°C, reduce irrigation
MAX_TEMP_IRRIGATION: 40         // Above 40°C, increase irrigation
MIN_HUMIDITY_IRRIGATION: 30     // Below 30%, increase irrigation
```

#### Punjab Districts
All 12 major Punjab districts with GPS coordinates:
- Amritsar, Gurdaspur, Pathankot
- Bhatinda, Faridkot, Ferozepur
- Sangrur, Patiala, Ludhiana
- Mansa, Chandigarh, Mohali

#### Bilingual Text
English (`en`) and Punjabi (`pa`) versions of:
- Irrigation decision messages
- Organic farming tips
- UI labels

---

## 🧠 Decision Logic

### Primary Decision: Rainfall Probability

The app uses rainfall probability as the main decision driver:

| Rainfall Chance | Decision | Color | Action |
|---|---|---|---|
| ≥ 50% | Minimal watering | 🟢 Green | Reduce irrigation |
| 30% - 50% | Moderate irrigation | 🟠 Orange | Water lightly, monitor |
| < 30% | Regular irrigation | 🔴 Red | Full irrigation needed |

### Secondary Factors

The system also considers:
- **Temperature**: High temps increase evaporation; low temps reduce water loss
- **Humidity**: Low humidity increases irrigation urgency
- **Wind speed**: Strong winds (>25 m/s) increase evaporation

### Flowchart

```
START
  ↓
Get Weather Data (Temperature, Humidity, Rainfall %, Wind)
  ↓
[Rainfall >= 50%?]
  ├─ YES → Green Decision: Minimal watering needed
  │          └─ Explain: Rain expected, reduce irrigation
  │
  └─ NO → [Rainfall >= 30%?]
           ├─ YES → Orange Decision: Moderate irrigation
           │         └─ Explain: Possible rain, water lightly
           │
           └─ NO → Red Decision: Regular irrigation required
                    └─ Explain: No rain expected, full irrigation
  ↓
Apply Secondary Adjustments
  ├─ High Temp? → ⚠️ Increase irrigation
  ├─ Low Humidity? → ⚠️ Increase irrigation
  └─ Strong Wind? → ⚠️ Increase irrigation
  ↓
Display Decision with Color Indicator
  ↓
Show 5-Day Forecast
  ↓
Display Organic Farming Tip
  ↓
END
```

---

## 🌱 Organic Farming Tips

The app includes 8 rotating tips covering:

1. **Mulching Benefits** - Moisture retention, soil improvement
2. **Pre-Rain Strategy** - Avoiding waterlogging
3. **Best Watering Time** - Early morning or evening watering
4. **Organic Compost** - Natural soil improvement
5. **Crop Residue Use** - Stubble management
6. **Green Manuring** - Natural nitrogen fixation
7. **Wind Damage Prevention** - Managing high wind evaporation
8. **Organic Pest Control** - Healthy plants resist pests better

All tips are available in **English and Punjabi**.

---

## 🛠️ Troubleshooting

### Issue: "API Key Not Configured"
**Solution:**
1. Get free key from https://openweathermap.org/api
2. Add to config.js
3. Wait 5-10 minutes for key activation
4. Refresh browser

### Issue: "Unable to fetch weather data"
**Solutions:**
- Check internet connection
- Verify API key is valid
- Ensure API key has not exceeded free tier limits
- Try simulating data: `simulateWeatherData()`
- Check browser console (F12) for detailed errors

### Issue: GPS not working
**Solutions:**
- Ensure page is served over HTTPS or localhost
- Grant location permission to browser
- Use district dropdown instead
- GPS requires local server or HTTPS

### Issue: Text appears in wrong language
**Solution:**
Switch language manually in browser console:
```javascript
toggleLanguage('en')  // For English
toggleLanguage('pa')  // For Punjabi
toggleLanguage()      // To toggle
```

### Issue: Colors not displaying correctly
**Solutions:**
- Clear browser cache (Ctrl+Shift+Delete)
- Ensure style.css is loaded
- Try different browser
- Check browser's dark mode setting

---

## 🔧 Extending the App

### Add a New District

Edit `config.js`:
```javascript
DISTRICTS: {
    // ... existing districts
    newdistrict: { name: 'New District', lat: 30.5, lon: 75.5 }
}
```

Then add to HTML dropdown in `index.html`:
```html
<option value="newdistrict">New District</option>
```

### Add Soil Moisture Sensor Data

Modify `processWeatherData()` in `script.js`:
```javascript
// Add sensor reading
const soilMoisture = getFromSensor(); // Your sensor integration

// Adjust decision
if (soilMoisture > 60) {
    decision.status = 'green';
}
```

### Add More Organic Tips

Edit `config.js` in the `tips` array:
```javascript
{
    title: '🌾 Your Tip Title',
    content: 'Detailed explanation for farmers...'
}
```

### Add SMS Notifications

Integrate Twilio or similar service:
```javascript
// In script.js after displaying decision
if (decision.status === 'red') {
    sendSMS(farmerPhoneNumber, 'Irrigation needed today!');
}
```

### Support More Crops

Add crop-specific thresholds:
```javascript
CROPS: {
    wheat: { RAINFALL_THRESHOLD: 45, MAX_TEMP: 35 },
    rice: { RAINFALL_THRESHOLD: 60, MAX_TEMP: 38 }
}
```

### Add Weather Alerts

Use OpenWeatherMap alerts or external service:
```javascript
if (weatherData.alerts && weatherData.alerts.length > 0) {
    showAlert(weatherData.alerts[0].description);
}
```

---

## 📱 Technical Stack

### Frontend
- **HTML5** - Semantic structure
- **CSS3** - Responsive, accessible styling
- **Vanilla JavaScript** - No external dependencies

### API
- **OpenWeatherMap** - Free weather data API
  - Forecast: 5-day predictions
  - Coordinates: Lat/lon lookup
  - Units: Metric (Celsius, m/s)

### Browser APIs
- **Geolocation API** - GPS support
- **Fetch API** - HTTP requests
- **Local Storage** - Future: save preferences

### Design Philosophy
- **Minimal** - No complex animations or charts
- **Accessible** - High contrast, large text, clear language
- **Responsive** - Works on phones to tablets
- **Scalable** - Easy to extend for sensors and services

---

## 📊 File Structure

```
weather-irrigation-app/
├── index.html           # Main HTML structure
├── style.css            # Responsive styling
├── script.js            # Core logic and API integration
├── config.js            # Configuration and multilingual text
├── README.md            # This file
└── assets/
    └── icons/           # Reserved for future icon assets
```

---

## 💡 Key Principles

1. **Data-Driven Decisions** - Every decision backed by weather data
2. **Farmer-First Design** - Simple, large, clear interface
3. **Organic Focus** - Tips support sustainable farming
4. **Low Tech Required** - Works on basic smartphones
5. **Open Extensible** - Easy to add sensors and features
6. **Bilingual Support** - English + Punjabi from day one

---

## 🌍 Language Support

The app supports:
- **English (en)** - Default interface language
- **Punjabi (pa)** - ਪੰਜਾਬੀ interface

Switch languages:
```javascript
toggleLanguage('pa')  // Punjabi
toggleLanguage('en')  // English
```

Tips and decision messages automatically update.

---

## 📞 Support & Feedback

For issues or suggestions:
1. Check Troubleshooting section above
2. Review browser console errors (F12)
3. Test with `simulateWeatherData()`
4. Verify config.js has valid API key

---

## 📄 License

This project is designed for Punjab farmers and is free to use and modify.

---

## 🎓 Educational Resources

Learn more about:
- [OpenWeatherMap API Docs](https://openweathermap.org/api)
- [MDN Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)
- [Responsive Web Design](https://web.dev/responsive-web-design-basics/)
- [Organic Farming Practices](https://www.fao.org/organicag)

---

## 🌟 Future Enhancements

- [ ] Soil moisture sensor integration
- [ ] Historical data analysis
- [ ] Crop-specific recommendations
- [ ] SMS/WhatsApp notifications
- [ ] Offline mode with cached data
- [ ] Community farmer feedback
- [ ] Multi-crop field management
- [ ] Water usage statistics
- [ ] Pest & disease alerts
- [ ] Local language support (Hindi, Haryanvi)

---

**Made with 🌾 for Punjab Farmers**

*Last Updated: December 2025*
