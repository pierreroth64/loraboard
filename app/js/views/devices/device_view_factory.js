import * as devTypes from '../../devices/device_types';
import { ErrorView } from '../error_view';
import { LoRaMoteDeviceView } from './loramote_device_view';
import { NucleoDeviceView } from './nucleo_device_view';
import { NucleoLightingDeviceView } from './nucleo_lighting_device_view';

export class DeviceViewFactory {

  createDeviceView(eui, dev, options) {
    if (dev) {
      const type = dev.getType();
      const devOptions = Object.assign({}, options, { device: dev });
      // options.device = dev;
      switch (type) {
        case devTypes.DEV_TYPE_LORAMOTE:
          return new LoRaMoteDeviceView(devOptions);
        case devTypes.DEV_TYPE_NUCLEO_LIGHTING:
          return new NucleoLightingDeviceView(devOptions);
        case devTypes.DEV_TYPE_NUCLEO:
          return new NucleoDeviceView(devOptions);
        default:
          return new ErrorView(`unknown device type ${type} for device with eui ${eui}`);
      }
    } else {
      return new ErrorView(`device with eui ${eui} not found`);
    }
  }
}
