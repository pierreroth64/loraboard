import {BaseCodec} from '../base_codec';

const FRAME_LENGTH = 10;
export class NucleoCodec extends BaseCodec {

    constructor() {
        super();
    }

    decode(frame) {
        throw new Error('NucleoCodec:decode not implented');
    }

    mayMatch(data) {
        return (data.length == FRAME_LENGTH);
    }
}
