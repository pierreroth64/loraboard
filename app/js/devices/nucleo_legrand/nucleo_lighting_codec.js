import {NucleoCodec} from '../nucleo/nucleo_codec';

const FRAME_LENGTH = 8;

export class NucleoLightingCodec extends NucleoCodec {

    constructor() {
        super();
    }

    mayMatch(data) {
        return (data.length == FRAME_LENGTH);
    }

    encodeTestCmd(eui) {
        return { cmd: `{\"command\": \"mote send ${eui} port 30 data 32\"}` };
    }
}
