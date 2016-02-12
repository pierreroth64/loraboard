
const RANDOM_DEVIDE_FACTOR = 10

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

function checkNotSet(latitude, longitude) {
    if (latitude == 0 && longitude == -360) {
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
