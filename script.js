/**
 * Main Application Logic
 * Weather data fetching and irrigation decision algorithm
 */

// ========== STATE MANAGEMENT ==========

let currentLanguage = 'en'; // Default to English
let currentDistrictCode = null;
let currentWeatherData = null;
let tipsIndex = 0;

// ========== DOM ELEMENTS ==========

const DOM = {
    districtSelect: document.getElementById('districtSelect'),
    useGPSBtn: document.getElementById('useGPS'),
    locationStatus: document.getElementById('locationStatus'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    errorMessage: document.getElementById('errorMessage'),
    mainContent: document.getElementById('mainContent'),
    
    // Weather display
    temperature: document.getElementById('temperature'),
    humidity: document.getElementById('humidity'),
    rainfall: document.getElementById('rainfall'),
    windSpeed: document.getElementById('windSpeed'),
    weatherDescription: document.getElementById('weatherDescription'),
    
    // Decision display
    decisionResult: document.getElementById('decisionResult'),
    decisionCard: document.getElementById('decisionCard'),
    decisionIcon: document.getElementById('decisionIcon'),
    decisionTitle: document.getElementById('decisionTitle'),
    decisionDescription: document.getElementById('decisionDescription'),
    
    // Tips
    tipText: document.getElementById('tipText'),
    nextTipBtn: document.getElementById('nextTipBtn'),
    
    // Forecast
    forecastItems: document.getElementById('forecastItems'),
    thresholdValue: document.getElementById('thresholdValue'),
};

// ========== EVENT LISTENERS ==========

DOM.districtSelect.addEventListener('change', handleDistrictChange);
DOM.useGPSBtn.addEventListener('click', handleGPSClick);
DOM.nextTipBtn.addEventListener('click', showNextTip);

// ========== MAIN FUNCTIONS ==========

/**
 * Handle district selection from dropdown
 */
function handleDistrictChange() {
    const selectedDistrict = DOM.districtSelect.value;
    
    if (selectedDistrict) {
        currentDistrictCode = selectedDistrict;
        DOM.locationStatus.textContent = `Selected: ${CONFIG.DISTRICTS[selectedDistrict].name}`;
        fetchWeatherData(selectedDistrict);
    }
}

/**
 * Handle GPS button click - request geolocation
 */
function handleGPSClick() {
    if (navigator.geolocation) {
        showLoading();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherDataByCoordinates(latitude, longitude);
            },
            (error) => {
                showError('GPS Error: ' + error.message + '. Please select district manually.');
                hideLoading();
            }
        );
    } else {
        showError('GPS not supported in your browser. Please select district manually.');
    }
}

/**
 * Fetch weather data using district code
 */
function fetchWeatherData(districtCode) {
    const district = CONFIG.DISTRICTS[districtCode];
    if (!district) {
        showError('District not found');
        return;
    }
    
    fetchWeatherDataByCoordinates(district.lat, district.lon);
}

/**
 * Fetch weather data using coordinates
 */
function fetchWeatherDataByCoordinates(lat, lon) {
    showLoading();
    clearError();
    
    const params = new URLSearchParams({
        lat: lat,
        lon: lon,
        appid: CONFIG.API_KEY,
        units: 'metric'
    });
    
    const url = `${CONFIG.WEATHER_API}?${params}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            currentWeatherData = data;
            processWeatherData(data);
            hideLoading();
            showMainContent();
        })
        .catch(error => {
            console.error('Weather fetch error:', error);
            
            // Check if API key is not configured
            if (CONFIG.API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY_HERE') {
                showError('⚠️ API Key Not Configured: Please get a free key from https://openweathermap.org/api and update config.js');
            } else {
                console.error('Full error:', error);
                showError('Unable to fetch weather data. Check browser console for details. API may need 10+ minutes to activate.');
            }
            hideLoading();
        });
}

/**
 * Process and analyze weather data
 */
function processWeatherData(data) {
    // Get current weather from first item in forecast list
    const current = data.list[0];
    
    // Extract weather values
    const temp = Math.round(current.main.temp);
    const humidity = current.main.humidity;
    const windSpeed = Math.round(current.wind.speed);
    const rainChance = Math.round((current.pop || 0) * 100); // Probability of precipitation
    const description = current.weather[0].main;
    
    // Update weather display
    DOM.temperature.textContent = `${temp}°C`;
    DOM.humidity.textContent = `${humidity}%`;
    DOM.rainfall.textContent = `${rainChance}%`;
    DOM.windSpeed.textContent = `${windSpeed} m/s`;
    DOM.weatherDescription.textContent = description;
    
    // Make irrigation decision based on weather data
    const decision = makeIrrigationDecision(rainChance, temp, humidity, windSpeed);
    
    // Display decision
    displayDecision(decision);
    
    // Display forecast
    displayForecast(data);
    
    // Show initial tip
    showNextTip();
}

/**
 * Make irrigation decision based on thresholds
 * 
 * Decision Logic:
 * - If rainfall probability >= threshold → Minimal irrigation needed (GREEN)
 * - If rainfall probability is moderate → Minimal irrigation (ORANGE)
 * - If rainfall probability < threshold → Full irrigation needed (RED)
 */
function makeIrrigationDecision(rainChance, temp, humidity, windSpeed) {
    let decision = {
        status: 'red',          // 'green', 'orange', 'red'
        statusClass: 'status-red',
        icon: '🔴',
        title: '',
        description: '',
        reasoning: []
    };
    
    // Get text from config based on current language
    const texts = CONFIG.TEXT[currentLanguage];
    
    // ========== PRIMARY DECISION: Based on rainfall probability ==========
    
    if (rainChance >= CONFIG.RAINFALL_THRESHOLD) {
        // Rain expected - minimal irrigation needed
        decision.status = 'green';
        decision.statusClass = 'status-green';
        decision.icon = '✅';
        decision.title = texts.irrigationNotNeeded.title;
        decision.description = texts.irrigationNotNeeded.description;
        decision.reasoning.push(`Rain probability ${rainChance}% exceeds threshold (${CONFIG.RAINFALL_THRESHOLD}%)`);
        
    } else if (rainChance >= CONFIG.RAINFALL_THRESHOLD - 20) {
        // Moderate rain chance - balanced approach
        decision.status = 'orange';
        decision.statusClass = 'status-orange';
        decision.icon = '⚠️';
        decision.title = '⚠️ Moderate Irrigation';
        decision.description = 'Rain may occur. Water lightly and monitor forecast.';
        decision.reasoning.push(`Rain probability ${rainChance}% is moderate`);
        
    } else {
        // No rain expected - full irrigation needed
        decision.status = 'red';
        decision.statusClass = 'status-red';
        decision.icon = '🔴';
        decision.title = texts.irrigationNeeded.title;
        decision.description = texts.irrigationNeeded.description;
        decision.reasoning.push(`Rain probability ${rainChance}% below threshold (${CONFIG.RAINFALL_THRESHOLD}%)`);
    }
    
    // ========== SECONDARY ADJUSTMENTS: Temperature and humidity ==========
    
    // High temperature: increase irrigation urgency
    if (temp >= CONFIG.MAX_TEMP_IRRIGATION) {
        decision.reasoning.push(`⚠️ High temperature (${temp}°C) increases water loss`);
    }
    
    // Low temperature: reduce irrigation urgency
    if (temp <= CONFIG.MIN_TEMP_IRRIGATION) {
        decision.reasoning.push(`ℹ️ Low temperature (${temp}°C) reduces water loss`);
    }
    
    // Low humidity: increase irrigation urgency
    if (humidity <= CONFIG.MIN_HUMIDITY_IRRIGATION) {
        decision.reasoning.push(`⚠️ Low humidity (${humidity}%) increases evaporation`);
    }
    
    // High wind: increases evaporation urgency
    if (windSpeed > 25) {
        decision.reasoning.push(`⚠️ Strong wind (${windSpeed} m/s) increases water loss`);
    }
    
    return decision;
}

/**
 * Display irrigation decision on UI
 */
function displayDecision(decision) {
    DOM.decisionIcon.textContent = decision.icon;
    DOM.decisionTitle.textContent = decision.title;
    DOM.decisionDescription.textContent = decision.description;
    
    // Update card colors based on status
    DOM.decisionResult.className = `decision-result ${decision.statusClass}`;
}

/**
 * Display 5-day forecast
 */
function displayForecast(data) {
    const forecastHTML = data.list
        .slice(0, 8)  // Get next 40 hours (8 intervals of 5 hours each)
        .filter((item, index) => index % 2 === 0)  // Show every 10 hours
        .map(item => {
            const date = new Date(item.dt * 1000);
            const dateStr = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit'
            });
            const temp = Math.round(item.main.temp);
            const rain = Math.round((item.pop || 0) * 100);
            
            return `
                <div class="forecast-item">
                    <div class="forecast-date">${dateStr}</div>
                    <div class="forecast-temp">${temp}°C</div>
                    <div class="forecast-rain">🌧️ ${rain}%</div>
                </div>
            `;
        })
        .join('');
    
    DOM.forecastItems.innerHTML = forecastHTML;
}

/**
 * Show next organic farming tip
 */
function showNextTip() {
    // Get correct tips array based on language
    const tips = CONFIG.TEXT[currentLanguage].tips;
    
    if (tips.length === 0) return;
    
    const tip = tips[tipsIndex % tips.length];
    
    // Display tip with formatting
    DOM.tipText.innerHTML = `
        <strong>${tip.title}</strong><br>
        ${tip.content}
    `;
    
    // Move to next tip
    tipsIndex = (tipsIndex + 1) % tips.length;
}

// ========== UI HELPER FUNCTIONS ==========

/**
 * Show loading spinner
 */
function showLoading() {
    DOM.loadingSpinner.classList.remove('hidden');
    DOM.mainContent.classList.add('hidden');
}

/**
 * Hide loading spinner
 */
function hideLoading() {
    DOM.loadingSpinner.classList.add('hidden');
}

/**
 * Show main content
 */
function showMainContent() {
    DOM.mainContent.classList.remove('hidden');
}

/**
 * Show error message
 */
function showError(message) {
    DOM.errorMessage.textContent = message;
    DOM.errorMessage.classList.remove('hidden');
    DOM.mainContent.classList.add('hidden');
}

/**
 * Clear error message
 */
function clearError() {
    DOM.errorMessage.classList.add('hidden');
    DOM.errorMessage.textContent = '';
}

/**
 * Toggle between English and Punjabi
 * Can be called from console or extended to UI button
 */
function toggleLanguage(lang = null) {
    if (lang === 'en' || lang === 'pa') {
        currentLanguage = lang;
    } else {
        currentLanguage = currentLanguage === 'en' ? 'pa' : 'en';
    }
    
    // Re-display decision with new language
    if (currentWeatherData) {
        processWeatherData(currentWeatherData);
    }
    
    console.log(`Language switched to: ${currentLanguage === 'en' ? 'English' : 'Punjabi'}`);
}

// ========== INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', () => {
    console.log('App initialized. Set your OpenWeatherMap API key in config.js');
    console.log('Use toggleLanguage("en") or toggleLanguage("pa") to switch languages');
    
    // Display threshold value
    DOM.thresholdValue.textContent = CONFIG.RAINFALL_THRESHOLD;
    
    // Set default location status
    DOM.locationStatus.textContent = 'Please select your district';
});

// ========== DEVELOPMENT/DEBUG HELPERS ==========

/**
 * Simulate weather data for testing (without API key)
 * Call this in console to test the UI
 */
function simulateWeatherData() {
    const mockData = {
        list: [
            {
                dt: Math.floor(Date.now() / 1000),
                main: { temp: 28, humidity: 65 },
                wind: { speed: 12 },
                pop: 0.3,  // 30% chance of rain
                weather: [{ main: 'Partly Cloudy' }]
            },
            {
                dt: Math.floor(Date.now() / 1000) + 10800,
                main: { temp: 26, humidity: 70 },
                wind: { speed: 8 },
                pop: 0.5,  // 50% chance
                weather: [{ main: 'Cloudy' }]
            },
            {
                dt: Math.floor(Date.now() / 1000) + 21600,
                main: { temp: 24, humidity: 75 },
                wind: { speed: 10 },
                pop: 0.7,  // 70% chance
                weather: [{ main: 'Rainy' }]
            },
            {
                dt: Math.floor(Date.now() / 1000) + 32400,
                main: { temp: 22, humidity: 80 },
                wind: { speed: 6 },
                pop: 0.6,  // 60% chance
                weather: [{ main: 'Rainy' }]
            },
            {
                dt: Math.floor(Date.now() / 1000) + 43200,
                main: { temp: 25, humidity: 72 },
                wind: { speed: 9 },
                pop: 0.4,  // 40% chance
                weather: [{ main: 'Mostly Cloudy' }]
            },
            {
                dt: Math.floor(Date.now() / 1000) + 54000,
                main: { temp: 29, humidity: 60 },
                wind: { speed: 11 },
                pop: 0.2,  // 20% chance
                weather: [{ main: 'Sunny' }]
            },
            {
                dt: Math.floor(Date.now() / 1000) + 64800,
                main: { temp: 30, humidity: 55 },
                wind: { speed: 14 },
                pop: 0.1,  // 10% chance
                weather: [{ main: 'Sunny' }]
            },
            {
                dt: Math.floor(Date.now() / 1000) + 75600,
                main: { temp: 28, humidity: 62 },
                wind: { speed: 13 },
                pop: 0.15,  // 15% chance
                weather: [{ main: 'Partly Cloudy' }]
            }
        ]
    };
    
    currentWeatherData = mockData;
    processWeatherData(mockData);
    showMainContent();
    DOM.locationStatus.textContent = 'Test Data - Ludhiana (Simulated)';
}
