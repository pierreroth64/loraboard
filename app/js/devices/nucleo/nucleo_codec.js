import {BaseCodec} from '../base_codec';

export class NucleoCodec extends BaseCodec {

    constructor() {
        super();
    }

    decode(frame) {
        throw new Error('NucleoCodec:decode not implented');
    }

    mayMatch(data) {
        //FIXME: find creteria on payload to make this codec match/unmatch
        return false;
    }
}
