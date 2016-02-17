import {BrightnessGraphView} from '../brightness_view';

const BRIGTHNESS_DARK_COLOR = '#000000';
const BRIGTHNESS_BRIGHT_COLOR = '#d67b19';
const DEFAULT_BRIGTHNESS_LIMIT = 210;

export class LightingBrightnessGraphView extends BrightnessGraphView {

  constructor(options) {
    super(options);
    this.brightnessThreshold = this.buildBrightnessThreshold();
  }

  buildBrightnessThreshold() {
    var threshold = localStorage.getItem('brightnessThreshold');
    try {
      threshold = parseInt(threshold, 10);
      if (isNaN(threshold)) {
        throw new Error('threshold is not a number');
      }
      return threshold;
    } catch (e) {
      return DEFAULT_BRIGTHNESS_LIMIT;
    }
  }

  buildColorFromBrightness(brightness) {
    return (brightness < this.brightnessThreshold) ? BRIGTHNESS_DARK_COLOR: BRIGTHNESS_BRIGHT_COLOR;
  }

  initChart() {
    return c3.generate({
                bindto: '#' + this.id,
                data: {
                    columns: [
                        ['brightness', 100]
                    ],
                    type: 'donut',
                    colors: {
                        brightness: BRIGTHNESS_DARK_COLOR,
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


