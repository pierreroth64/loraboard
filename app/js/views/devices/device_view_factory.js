import * as devTypes from '../../devices/device_types';
import {ErrorView} from '../error_view';
import {LoRaMoteDeviceView} from './loramote_device_view';
import {NucleoDeviceView} from './nucleo_device_view';
import {NucleoLightingDeviceView} from './nucleo_lighting_device_view';

export class DeviceViewFactory {

  constructor() {}

  createDeviceView(eui, dev, options) {
    if (dev) {
        var type = dev.getType();
        options.device = dev;
        switch(type) {
            case devTypes.DEV_TYPE_LORAMOTE:
                return new LoRaMoteDeviceView(options);
            break;
            case devTypes.DEV_TYPE_NUCLEO_LIGHTING:
                return new NucleoLightingDeviceView(options);
            break;
            case devTypes.DEV_TYPE_NUCLEO:
                return new NucleoDeviceView(options);
            break;
            default:
                return new ErrorView(`unknown device type ${type} for device with eui ${eui}`);
            break;
        }
    } else {
        return new ErrorView(`device with eui ${eui} not found`);
    }
  }

}
