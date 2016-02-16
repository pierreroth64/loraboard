function addPadding(string, padChar, finalSize) {
    while (string.length < finalSize) {
        string = padChar + string;
    }
    return string;
}

export function formatEUI(eui) {
    var formatted = '';
    eui = new BigNumber(eui);
    eui = addPadding(eui.toString(16), '0', 16);

    for (let c in eui) {
        formatted += eui[c];
        if (c % 2) {
            formatted += '-';
        }
    }
    return formatted.substring(0, formatted.length-1);
}

export function getBuildTarget() {
    return localStorage.getItem('buildTarget');
}

export function isLegrandBuild() {
    return (getBuildTarget() == 'legrand');
}

export function isBuildTargetSet() {
    return (getBuildTarget() != undefined);
}

