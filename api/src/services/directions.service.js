const axios = require('axios');
const env   = require('../config/env');

const DIRECTIONS_URL = 'https://maps.googleapis.com/maps/api/directions/json';

const limpiarHTML = (str) =>
  str.replace(/<b>/g,'').replace(/<\/b>/g,'')
     .replace(/<div[^>]*>/g,' ').replace(/<\/div>/g,'')
     .replace(/<br\s*\/?>/g,' ').trim();

const getWalkingDirections = async (lato, lono, latd, lond) => {
  if (!env.google.placesKey)
    throw Object.assign(new Error('API Key de Google no configurada'), { status: 500 });

  const { data } = await axios.get(DIRECTIONS_URL, {
    params: {
      origin:      `${lato},${lono}`,
      destination: `${latd},${lond}`,
      mode:        'walking',
      language:    'es',
      key:         env.google.placesKey
    },
    timeout: 10000
  });

  if (data.status !== 'OK')
    throw Object.assign(
      new Error(`Google Directions error: ${data.status}`), { status: 400 }
    );

  const route = data.routes[0];
  const leg   = route.legs[0];

  const steps = leg.steps.map((step, idx) => ({
    id:              idx,
    instruction:     limpiarHTML(step.html_instructions),
    distancetext:    step.distance.text,
    distancemeters:  step.distance.value,
    durationtext:    step.duration.text,
    durationseconds: step.duration.value,
    maneuver:        step.maneuver || 'straight',
    startlocation:   { lat: step.start_location.lat, lon: step.start_location.lng },
    endlocation:     { lat: step.end_location.lat,   lon: step.end_location.lng }
  }));

  return {
    distance:     { meters: leg.distance.value, text: leg.distance.text },
    duration:     { seconds: leg.duration.value, text: leg.duration.text },
    startaddress: leg.start_address || '',
    endaddress:   leg.end_address   || '',
    steps,
    polyline:     route.overview_polyline.points,
    totalsteps:   steps.length
  };
};

module.exports = { getWalkingDirections };
