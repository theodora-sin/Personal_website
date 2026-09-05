import { useState, useEffect } from 'react';

function Weather() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState('Your Location');

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`
          );
          const data = await res.json();
          setWeather(data.current);
        } catch (err) {
          setError('Could not fetch weather data');
          return;
        }

        try {
          const geoRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const geoData = await geoRes.json();
          if (geoData.city) {
            setLocationName(geoData.city);
          } else if (geoData.locality) {
            setLocationName(geoData.locality);
          }
        } catch (err) {
          // keep "Your Location" fallback
        }
      },
      () => setError('Location permission denied')
    );
  }, []);

  const weatherEmoji = (code) => {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '❄️';
    if (code <= 82) return '🌦️';
    if (code <= 99) return '⛈️';
    return '🌡️';
  };

  return (
    <div className="weather-body">
      {error && !weather && <p className="weather-error">{error}</p>}
      {!error && !weather && <p className="weather-loading">Getting your location…</p>}
      {weather && (
        <div className="weather-display">
          <div className="weather-icon">{weatherEmoji(weather.weather_code)}</div>
          <div className="weather-temp">{Math.round(weather.temperature_2m)}°C</div>
          <div className="weather-location">{locationName}</div>
          <div className="weather-wind">Wind: {weather.wind_speed_10m} km/h</div>
        </div>
      )}
    </div>
  );
}

export default Weather;