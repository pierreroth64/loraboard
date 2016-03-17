
const RANDOM_DEVIDE_FACTOR = 200;
const DEFAULT_POSITION = {
  latitude: 43.32128564373083,
  longitude: -0.3142047302966944,
};

export function getRandomPosition(aroundPos) {
  let { latitude, longitude } = aroundPos;
  latitude += Math.random() / RANDOM_DEVIDE_FACTOR;
  longitude += Math.random() / RANDOM_DEVIDE_FACTOR;
  return { latitude, longitude };
}

function checkNotSet(latitude, longitude) {
  if ((latitude === 0 && longitude === -360) ||
      (latitude === 0 && longitude === 0) ||
      (latitude === -360 && longitude === 0) ||
      (latitude === -360 && longitude === -360)) {
    throw new Error('latitude or longitude are not set');
  }
}

function checkNaN(latitude, longitude) {
  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error('latitude or longitude are not a number');
  }
}

function checkUndefined(latitude, longitude) {
  if (latitude === undefined || longitude === undefined) {
    throw new Error('latitude or longitude are undefined');
  }
}

function checkNull(latitude, longitude) {
  if (latitude === null || longitude === null) {
    throw new Error('latitude or longitude are null');
  }
}

export function isPositionValid(position) {
  try {
    const { latitude, longitude } = position;
    checkNaN(latitude, longitude);
    checkUndefined(latitude, longitude);
    checkNotSet(latitude, longitude);
    checkNull(latitude, longitude);
    return true;
  } catch (e) {
    return false;
  }
}

export function getDefaultPosition() {
  const defaultLatitude = localStorage.getItem('defaultLatitude');
  const defaultLongitude = localStorage.getItem('defaultLongitude');
  const defaultPosition = { latitude: defaultLatitude, longitude: defaultLongitude };
  if (isPositionValid(defaultPosition)) {
    return defaultPosition;
  }
  return DEFAULT_POSITION;
}

