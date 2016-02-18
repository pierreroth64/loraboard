export function getBuildTarget() {
    return localStorage.getItem('buildTarget');
}

export function isLegrandBuild() {
    return (getBuildTarget() == 'legrand');
}

export function isBuildTargetSet() {
    return (getBuildTarget() != undefined);
}

