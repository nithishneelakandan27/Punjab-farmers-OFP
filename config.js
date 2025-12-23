/**
 * Configuration File
 * Contains API settings, thresholds, district coordinates, and bilingual text
 */

const CONFIG = {
    // ========== API CONFIGURATION ==========
    WEATHER_API: 'https://api.openweathermap.org/data/2.5/forecast',
    API_KEY: 'bf6488dad66aa5df8c4fdf169f4e34ff', // Get free key from https://openweathermap.org/api
    
    // ========== DECISION THRESHOLDS ==========
    // Rainfall probability threshold (in %)
    // If actual rainfall probability >= threshold → irrigation NOT needed
    // If actual rainfall probability < threshold → irrigation IS needed
    RAINFALL_THRESHOLD: 50,
    
    // Temperature thresholds (in Celsius)
    MIN_TEMP_IRRIGATION: 5,  // Below this, reduce irrigation
    MAX_TEMP_IRRIGATION: 40, // Above this, increase irrigation
    
    // Humidity threshold (in %)
    MIN_HUMIDITY_IRRIGATION: 30, // Below this, increase irrigation
    
    // ========== PUNJAB DISTRICT COORDINATES ==========
    DISTRICTS: {
        amritsar: { name: 'Amritsar', lat: 31.6340, lon: 74.8711 },
        gurdaspur: { name: 'Gurdaspur', lat: 32.1790, lon: 75.9064 },
        pathankot: { name: 'Pathankot', lat: 32.2573, lon: 75.6343 },
        bhatinda: { name: 'Bhatinda', lat: 29.1893, lon: 74.9463 },
        faridkot: { name: 'Faridkot', lat: 30.7159, lon: 74.7823 },
        ferozepur: { name: 'Ferozepur', lat: 30.9544, lon: 74.5535 },
        sangrur: { name: 'Sangrur', lat: 30.2668, lon: 75.8383 },
        patiala: { name: 'Patiala', lat: 30.3398, lon: 76.3869 },
        ludhiana: { name: 'Ludhiana', lat: 30.9010, lon: 75.8573 },
        mansa: { name: 'Mansa', lat: 29.5834, lon: 75.4034 },
        chandigarh: { name: 'Chandigarh', lat: 30.7333, lon: 76.8277 },
        mohali: { name: 'Mohali', lat: 30.6436, lon: 76.8122 }
    },

    // ========== BILINGUAL TEXT ==========
    TEXT: {
        en: {
            // Decision messages
            irrigationNotNeeded: {
                title: '✅ Minimal Watering',
                description: 'Rain is likely. Reduce irrigation to save water and support organic farming.'
            },
            irrigationNeeded: {
                title: '🔴 Regular Irrigation Needed',
                description: 'No rain expected. Provide regular irrigation while implementing water conservation.'
            },
            
            // Organic Tips
            tips: [
                {
                    title: '💧 Mulching Benefits',
                    content: 'Add 5-10 cm of organic mulch (straw, leaves) around plants. Retains soil moisture, reduces watering by 30-50%, and improves soil fertility.'
                },
                {
                    title: '🌧️ Pre-Rain Strategy',
                    content: 'Before forecast rain, reduce irrigation. Avoid waterlogging by stopping 2-3 days before rainfall. Your crops need oxygen too!'
                },
                {
                    title: '🕐 Best Watering Time',
                    content: 'Water early morning (4-6 AM) or evening (6-8 PM) to reduce evaporation and save 20-40% water. Avoid midday watering.'
                },
                {
                    title: '♻️ Organic Compost',
                    content: 'Mix 1-2 kg compost per square meter. Improves water-holding capacity naturally and reduces synthetic irrigation needs.'
                },
                {
                    title: '🍃 Crop Residue Use',
                    content: 'Don\'t burn stubble! Use as mulch or compost. Builds soil structure and water retention over time.'
                },
                {
                    title: '🌱 Green Manuring',
                    content: 'Plant legumes like clover between seasons. Fixes nitrogen naturally and improves soil water-holding capacity.'
                },
                {
                    title: '💨 Wind Damage Prevention',
                    content: 'High wind speeds (>25 km/h) increase evaporation. Plant windbreaks or use organic mulch protection during windy seasons.'
                },
                {
                    title: '🐛 Organic Pest Control',
                    content: 'Healthy, well-watered plants resist pests better. Balanced irrigation reduces stress-related infestations naturally.'
                }
            ]
        },
        pa: {
            // Punjabi - Decision messages
            irrigationNotNeeded: {
                title: '✅ ਘੱਟ ਸਿੰਚਾਈ',
                description: 'ਮੀਂਹ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਹੈ। ਪਾਣੀ ਬਚਾਉਣ ਅਤੇ ਜੈਵਿਕ ਖੇਤੀ ਦੇ ਲਈ ਸਿੰਚਾਈ ਘਟਾਓ।'
            },
            irrigationNeeded: {
                title: '🔴 ਨਿਯਮਿਤ ਸਿੰਚਾਈ ਲਾਜ਼ਮੀ',
                description: 'ਮੀਂਹ ਦੀ ਅਪੇਖਿਆ ਨਹੀਂ ਹੈ। ਪਾਣੀ ਬਚਾਓ ਦੇ ਤਰੀਕਿਆਂ ਨੂੰ ਲਾਗੂ ਕਰਦੇ ਹੋਏ ਨਿਯਮਿਤ ਸਿੰਚਾਈ ਦਿਓ।'
            },
            
            // Punjabi Tips
            tips: [
                {
                    title: '💧 ਪਾਲਕ ਦੇ ਫਾਇਦੇ',
                    content: 'ਪੌਦਿਆਂ ਦੁਆਲੇ 5-10 ਸੈਂਟੀਮੀਟਰ ਜੈਵਿਕ ਪਾਲਕ (ਤੂੜ, ਪੱਤੇ) ਪਾਓ। ਭੂਮੀ ਦੀ ਨਮੀ ਬਰਕਰਾਰ ਰੱਖਦਾ ਹੈ ਅਤੇ ਸਿੰਚਾਈ 30-50% ਘਟਾਓ।'
                },
                {
                    title: '🌧️ ਮੀਂਹ ਤੋਂ ਪਹਿਲੇ ਤਰੀਕਾ',
                    content: 'ਮੀਂਹ ਆਉਣ ਤੋਂ ਪਹਿਲੇ ਸਿੰਚਾਈ ਘਟਾਓ। 2-3 ਦਿਨ ਪਹਿਲੇ ਸਿੰਚਾਈ ਬੰਦ ਕਰ ਦਿਓ ਤਾਂ ਕਿ ਪੌਦਿਆਂ ਨੂੰ ਹਵਾ ਮਿਲੇ।'
                },
                {
                    title: '🕐 ਸਲਾਹ ਭਿੰਨ ਸਮਾ',
                    content: 'ਸਵੇਰੇ (4-6 ਵਜੇ) ਜਾਂ ਸ਼ਾਮ (6-8 ਵਜੇ) ਨੂੰ ਸਿੰਚਾਈ ਕਰੋ। ਭਾਫ਼ ਜਾਣ ਵਾਲਾ ਪਾਣੀ ਘਟਾਓ ਅਤੇ 20-40% ਬਚਾਓ।'
                },
                {
                    title: '♻️ ਜੈਵਿਕ ਖਾਦ',
                    content: 'ਪ੍ਰਤੀ ਵਰਗ ਮੀਟਰ 1-2 ਕਿਲੋ ਖਾਦ ਮਿਲਾਓ। ਭੂਮੀ ਦੀ ਨਮੀ ਸਮਰੱਥਾ ਕੁਦਰਤੀ ਤਰੀਕੇ ਨਾਲ ਵਧਾਉਂਦਾ ਹੈ।'
                }
            ]
        }
    }
};
