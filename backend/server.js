import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ================= CACHE =================

const weatherCache = {};
const CACHE_TTL = 60 * 1000; // 1 minute

// ================= API CALLS =================

// 🌍 OpenWeatherMap
async function getFromAPI1(location) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${process.env.OPENWEATHER_KEY}`;
    const res = await axios.get(url);
    return res.data;
}

// 🌤️ WeatherAPI.com
async function getFromAPI2(location) {
    const url = `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHERAPI_KEY}&q=${location}`;
    const res = await axios.get(url);
    return res.data;
}

// ================= NORMALIZERS =================

function normalizeAPI1(data) {
    return {
        temperature: data.main.temp,
        unit: "C",
        condition: data.weather[0].description,
        humidity: data.main.humidity,
    };
}

function normalizeAPI2(data) {
    return {
        temperature: data.current.temp_c,
        unit: "C",
        condition: data.current.condition.text,
        humidity: data.current.humidity,
    };
}

// ================= ENDPOINT =================

app.get("/forecast", async (req, res) => {
    const location = req.query.location;

    if (!location) {
        return res.status(400).json({ error: "Location required" });
    }

    const now = Date.now();

    // Try OpenWeatherMap
    try {
        const api1Data = await getFromAPI1(location);

        const normalized = normalizeAPI1(api1Data);

        // Cache successful response
        weatherCache[location] = {
            data: normalized,
            timestamp: now,
        };

        return res.json({
            location,
            ...normalized,
            source: "OpenWeatherMap",
        });

    } catch (err) {
        console.log("API1 OpenWeatherMap failed:", err.message);
    }

    // Try WeatherAPI.com
    try {
        const api2Data = await getFromAPI2(location);

        const normalized = normalizeAPI2(api2Data);

        // Cache successful response
        weatherCache[location] = {
            data: normalized,
            timestamp: now,
        };

        return res.json({
            location,
            ...normalized,
            source: "WeatherAPI",
        });

    } catch (err) {
        console.log("API2 WeatherAPI failed:", err.message);
    }

    // Check cache first (Valid for 1 minute)
    const cached = weatherCache[location];

    if (cached && (now - cached.timestamp) < CACHE_TTL) {
        return res.json({
            location,
            ...cached.data,
            source: "CACHE",
        });
    }

    // Remove expired cache
    if (cached) delete weatherCache[location];

    // Both APIs failed and no valid cache
    return res.status(503).json({
        error:
            "Both weather APIs failed and no recent cached data available",
    });
});

// ================= SERVER =================

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});