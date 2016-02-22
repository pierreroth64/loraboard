import * as devTypes from '../device_types';
import {NucleoDevice} from '../nucleo/nucleo_device';
import {NucleoLightingCodec} from './nucleo_lighting_codec';

const DEFAULT_RTSP_IP_ADDRESS = '10.0.218.76';
const DEFAULT_RTSP_PORT = '8554';
const DEFAULT_RTSP_URI = '/lora';

const DEMO_EUI = '01-00-00-00-00-00-00-01';

export class NucleoLightingDevice extends NucleoDevice {

    constructor(eui) {
        super(eui);
        this.setCodec(new NucleoLightingCodec());
        this.setType(devTypes.DEV_TYPE_NUCLEO_LIGHTING);
        this.setName(`Lighting device ${this.getFormattedEUI(eui)}`);
        this.setExtras({rtsp: this.buildRSTPStream()});
    }

    buildRSTPStream() {
        return `rtsp:\/\/${this.buildRTSPIPAddress()}:${this.buildRTSPPort()}${this.buildRTSPURI()}`;
    }

    buildRTSPIPAddress() {
        return (localStorage.getItem('ipAddressForRTSP') || DEFAULT_RTSP_IP_ADDRESS);
    }

    buildRTSPPort() {
        return (localStorage.getItem('portForRTSP') || DEFAULT_RTSP_PORT);
    }

    buildRTSPURI() {
        return (localStorage.getItem('uriForRTSP') || DEFAULT_RTSP_URI);
    }

    getCapabilities()  {
        return [ {
                    action: 'test',
                    actionLabel: 'Test!'
                  } ];
    }

    test(data) {
        return this.codec.encodeTestCmd(this.getFormattedEUI());
    }

    getPosition() {
        // Device with this EUI has a static position
        if (this.getFormattedEUI() == DEMO_EUI) {
            return {latitude: 45.823302, longitude: 1.277762};
        } else {
            return super.getPosition();
        }
    }
}
