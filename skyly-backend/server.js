const express = require('express');

const app = express();

app.get('/api/weather', async (req, res) => {
  const { latitude, longitude, temperature_unit } = req.query;

  const lat = Number(latitude);
  const lon = Number(longitude);

  if (
    typeof latitude !== 'string' ||
    typeof longitude !== 'string' ||
    latitude.trim() === '' ||
    longitude.trim() === '' ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    Math.abs(lat) > 90 ||
    Math.abs(lon) > 180
  ) {
    return res.status(400).json({ error: 'Invalid coordinates.' });
  }

  if (
    temperature_unit !== undefined &&
    temperature_unit !== 'celsius' &&
    temperature_unit !== 'fahrenheit'
  ) {
    return res.status(400).json({ error: 'Invalid temperature unit.' });
  }

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    temperature_unit: temperature_unit ?? 'celsius',
    current:
      'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day',
    hourly: 'temperature_2m,weather_code,precipitation_probability',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset',
    wind_speed_unit: 'kmh',
    timezone: 'auto',
    forecast_days: '6',
  });

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params}`,
      { signal: AbortSignal.timeout(10000) }
    );

    if (!response.ok) {
      const status = response.status === 429 ? 429 : 502;
      return res.status(status).json({ error: 'Weather service unavailable.' });
    }

    const weather = await response.json();
    return res.json(weather);
  } catch {
    return res.status(502).json({ error: 'Could not retrieve weather.' });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Skyly backend running on port 3000');
});