import * as devTypes from '../device_types';
import {NucleoDevice} from '../nucleo/nucleo_device';
import {NucleoLightingCodec} from './nucleo_lighting_codec';

export class NucleoLightingDevice extends NucleoDevice {

    constructor(eui) {
        super(eui);
        this.setCodec(new NucleoLightingCodec());
        this.setType(devTypes.DEV_TYPE_NUCLEO_LIGHTING);
        this.setName(`Lighting device ${eui}`);
    }

    getCapabilities()  {
        return [ {
                    action: 'test',
                    actionLabel: 'Test!'
                  } ];
    }

    test(data) {
        return this.codec.encodeTestCmd(this.eui);
    }

    getPosition() {
        return {latitude: 45.823302, longitude: 1.277762};
    }
}
