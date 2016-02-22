
const RANDOM_DEVIDE_FACTOR = 200
const DEFAULT_POSITION = {
                              latitude: 43.32128564373083,
                              longitude: -0.3142047302966944
                          };

export function getRandomPosition(aroundPos) {
    var {latitude, longitude} = aroundPos;
    latitude += Math.random() / RANDOM_DEVIDE_FACTOR;
    longitude += Math.random() / RANDOM_DEVIDE_FACTOR;
    return {latitude, longitude};
}

export function isPositionValid(position) {
    try {
        var {latitude, longitude} = position;
        checkNaN(latitude, longitude);
        checkUndefined(latitude, longitude);
        checkNotSet(latitude, longitude);
        return true;
    } catch (e) {
        return false;
    }
}

export function getDefaultPosition() {
    var defaultLatitude = localStorage.getItem('defaultLatitude');
    var defaultLongitude = localStorage.getItem('defaultLongitude');
    var defaultPosition = {latitude: defaultLatitude, longitude: defaultLongitude};
    if (isPositionValid(defaultPosition)) {
        return defaultPosition;
    } else {
        return DEFAULT_POSITION;
    }
}

function checkNotSet(latitude, longitude) {
    if ( (latitude == 0 && longitude == -360) ||
         (latitude == 0 && longitude == 0) ||
         (latitude == -360 && longitude == 0) ||
         (latitude == -360 && longitude == -360) ) {
        throw new Error('latitude or longitude are not set');
    }
}

function checkNaN(latitude, longitude) {
    if (isNaN(latitude) || isNaN(longitude)) {
        throw new Error('latitude or longitude are not a number');
    }
}

function checkUndefined(latitude, longitude) {
    if (latitude == undefined|| longitude == undefined) {
        throw new Error('latitude or longitude are undefined');
    }
}
