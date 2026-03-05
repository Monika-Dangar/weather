import { useState, useEffect } from 'react';
import './index.css';

// SVG Icons
const Icons = {
  Cloud: ({ className = "" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /></svg>
  ),
  Search: ({ className = "" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
  ),
  MapPin: ({ className = "" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
  ),
  Thermometer: ({ className = "" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" /></svg>
  ),
  Droplets: ({ className = "" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7 2.9 7 2.9s-2.29 6.16-2.29 8.16M7 16.3a4 4 0 0 1-4-4.05c0-1.16.57-2.26 1.71-3.19S7 2.9 7 2.9" /><path d="M14.5 19.5c2.5 0 4.5-2 4.5-4.5 0-1.3-.6-2.6-1.9-3.6-1.3-1-2.6-6.4-2.6-6.4s-1.3 5.4-2.6 6.4c-1.3 1-1.9 2.3-1.9 3.6 0 2.5 2 4.5 4.5 4.5Z" /></svg>
  ),
  Wind: ({ className = "" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" /><path d="M9.6 4.6A2 2 0 1 1 11 8H2" /><path d="M12.6 19.4A2 2 0 1 0 14 16H2" /></svg>
  ),
  Sun: ({ className = "" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
  ),
  Moon: ({ className = "" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
  ),
  WeatherSunBig: () => (
    <svg viewBox="0 0 100 100" className="weather-icon-large">
      <circle cx="50" cy="50" r="18" fill="none" stroke="#FFD700" strokeWidth="6" />
      <path d="M50 15 L50 22" stroke="#FFD700" strokeWidth="6" strokeLinecap="round" />
      <path d="M50 85 L50 78" stroke="#FFD700" strokeWidth="6" strokeLinecap="round" />
      <path d="M15 50 L22 50" stroke="#FFD700" strokeWidth="6" strokeLinecap="round" />
      <path d="M85 50 L78 50" stroke="#FFD700" strokeWidth="6" strokeLinecap="round" />
      <path d="M25 25 L30 30" stroke="#FFD700" strokeWidth="6" strokeLinecap="round" />
      <path d="M75 75 L70 70" stroke="#FFD700" strokeWidth="6" strokeLinecap="round" />
      <path d="M25 75 L30 70" stroke="#FFD700" strokeWidth="6" strokeLinecap="round" />
      <path d="M75 25 L70 30" stroke="#FFD700" strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
};

function App() {
  const [query, setQuery] = useState('San Francisco');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const fetchWeather = async (location) => {
    if (!location) return;
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/forecast?location=${encodeURIComponent(location)}`);

      if (!response.ok) {
        throw new Error('City not found or API error');
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather('San Francisco');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    fetchWeather(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchWeather(query);
    }
  };

  const renderSkeleton = () => (
    <>
      <div className="dashboard-grid">
        <div className="card main-weather-card">
          <div>
            <div className="weather-header">
              <div className="location-info" style={{ width: '50%' }}>
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-temp"></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                <div className="skeleton skeleton-icon-large"></div>
                <div className="skeleton skeleton-text" style={{ width: '80px' }}></div>
              </div>
            </div>
          </div>
          <div>
            <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
              <div className="skeleton skeleton-text" style={{ width: '50px' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '50px' }}></div>
            </div>
          </div>
        </div>

        <div className="metrics-grid">
          {[1, 2, 3, 4].map(i => (
            <div className="metric-card" key={i}>
              <div className="skeleton skeleton-metric-icon"></div>
              <div className="metric-info">
                <div className="skeleton skeleton-text" style={{ width: '50%', marginBottom: '6px' }}></div>
                <div className="skeleton skeleton-metric-value"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="forecast-section">
        <h3 className="forecast-title">5-Day Forecast</h3>
        <div className="forecast-grid">
          {[1, 2, 3, 4, 5].map(i => (
            <div className="forecast-card skeleton-forecast-card" key={i}>
              <div className="skeleton skeleton-text" style={{ width: '30px', margin: '0' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '30px', height: '30px', borderRadius: '50%', margin: '0' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '40px', height: '24px', margin: '0' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '60px', height: '12px', margin: '0' }}></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <div className="logo-icon">
            <Icons.Cloud className="text-white w-5 h-5" />
          </div>
          <span className="logo-text">Aura Weather</span>
        </div>

        <div className="header-actions">
          <div className="search-container">
            <div className="search-input-wrapper">
              <div className="search-icon"><Icons.Search /></div>
              <input
                type="text"
                className="search-input"
                placeholder="Search location..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button className="search-button" onClick={handleSearch}>Search</button>
          </div>

          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      {loading ? (
        renderSkeleton()
      ) : error ? (
        <div className="error-state">
          <h3>Oops!</h3>
          <p>{error}</p>
          <button className="search-button" onClick={() => fetchWeather('San Francisco')} style={{ marginTop: '10px' }}>Try Again</button>
        </div>
      ) : weatherData && (
        <>
          <div className="dashboard-grid">
            {/* Main Weather Card */}
            <div className="card main-weather-card">
              <div>
                <div className="weather-header">
                  <div className="location-info">
                    <span className="location-name">
                      <Icons.MapPin />
                      {weatherData.location.toUpperCase()}
                    </span>
                    <div className="temperature">
                      {Math.round(weatherData.temperature)}°
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', zIndex: 10 }}>
                    <Icons.WeatherSunBig />
                    <div className="condition-text">{weatherData.condition}</div>
                  </div>
                </div>
              </div>

              <div>
                <p className="quote">"A tapestry of golden light unfurls across the hills, while a gentle breeze whispers through the city's streets."</p>
                <div style={{ display: 'flex', gap: '20px', marginTop: '20px', fontSize: '0.9rem', fontWeight: 600 }}>
                  <span style={{ color: '#FFD700' }}>↑ {Math.round(weatherData.temperature + 4)}°</span>
                  <span style={{ color: '#00f2fe' }}>↓ {Math.round(weatherData.temperature - 3)}°</span>
                </div>
              </div>
            </div>

            {/* Side Metrics */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon" style={{ background: 'rgba(100, 108, 255, 0.1)', color: '#646cff' }}>
                  <Icons.Thermometer />
                </div>
                <div className="metric-info">
                  <span className="metric-label">Feels Like</span>
                  <span className="metric-value">{Math.round(weatherData.temperature - 2)}°</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon" style={{ background: 'rgba(0, 242, 254, 0.1)', color: '#00f2fe' }}>
                  <Icons.Droplets />
                </div>
                <div className="metric-info">
                  <span className="metric-label">Humidity</span>
                  <span className="metric-value">{weatherData.humidity}%</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon" style={{ background: 'rgba(142, 114, 255, 0.1)', color: '#8e72ff' }}>
                  <Icons.Wind />
                </div>
                <div className="metric-info">
                  <span className="metric-label">Wind Speed</span>
                  <span className="metric-value">16 km/h</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon" style={{ background: 'rgba(255, 140, 0, 0.1)', color: '#ff8c00' }}>
                  <Icons.Sun />
                </div>
                <div className="metric-info">
                  <span className="metric-label">UV Index</span>
                  <span className="metric-value">3</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5-Day Forecast */}
          <div className="forecast-section">
            <h3 className="forecast-title">5-Day Forecast</h3>
            <div className="forecast-grid">
              {[
                { day: 'Fri', temp: Math.round(weatherData.temperature + 9), condition: 'Mostly Sunny', icon: 'sun' },
                { day: 'Sat', temp: Math.round(weatherData.temperature + 11), condition: 'Scattered Clouds', icon: 'cloud' },
                { day: 'Sun', temp: Math.round(weatherData.temperature + 9), condition: 'Scattered Clouds', icon: 'cloud' },
                { day: 'Mon', temp: Math.round(weatherData.temperature + 7), condition: 'Sunny', icon: 'sun' },
                { day: 'Tue', temp: Math.round(weatherData.temperature + 7), condition: 'Sunny', icon: 'sun' }
              ].map((item, idx) => (
                <div className="forecast-card" key={idx}>
                  <div className="forecast-day">{item.day}</div>
                  {item.icon === 'sun' ?
                    <Icons.Sun className="forecast-icon" /> :
                    <Icons.Cloud className="forecast-icon cloud" />
                  }
                  <div className="forecast-temp">{item.temp}°</div>
                  <div className="forecast-condition">{item.condition}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  );
}

export default App;
