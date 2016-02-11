import {BrightnessGraphView} from '../brightness_view';

var BRIGTHNESS_DARK_COLOR = '#000000';
var BRIGTHNESS_BRIGHT_COLOR = '#d67b19';

export class LightingBrightnessGraphView extends BrightnessGraphView {

  constructor(options) {
    super(options);
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
    var color = (brightnessRaw < 210) ? BRIGTHNESS_DARK_COLOR: BRIGTHNESS_BRIGHT_COLOR;
    this.chart.data.colors({
        brightness: d3.rgb(color)
    });
  }
}


