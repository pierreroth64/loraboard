import {BrightnessGraphView} from '../brightness_view';

const BRIGTHNESS_DARK_COLOR = '#000000';
const BRIGTHNESS_BRIGHT_COLOR = '#d67b19';
const BRIGTHNESS_LIMIT = 210;

export class LightingBrightnessGraphView extends BrightnessGraphView {

  constructor(options) {
    super(options);
  }

  buildColorFromBrightness(brightness) {
    return (brightness < BRIGTHNESS_LIMIT) ? BRIGTHNESS_DARK_COLOR: BRIGTHNESS_BRIGHT_COLOR;
  }

  initChart() {
    var brightnessRaw = this.model.attributes.value;
    return c3.generate({
                bindto: '#' + this.id,
                data: {
                    columns: [
                        ['brightness', 100]
                    ],
                    type: 'donut',
                    colors: {
                        brightness: this.buildColorFromBrightness(brightnessRaw),
                    }
                },
                legend: {
                  show: false
                }
              });
  }

  updateChart() {
    var brightnessRaw = this.model.attributes.value;
    this.chart.data.colors({
        brightness: d3.rgb(this.buildColorFromBrightness(brightnessRaw))
    });
  }
}


