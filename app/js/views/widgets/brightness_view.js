var BRIGTHNESS_COLOR = '#000000';
var BRIGTHNESS_REMAINING_COLOR = '#15AEE8';

export class BrightnessGraphView extends Backbone.View {

  constructor(options) {
    super(options);
    this.chart = this.initChart();
    this.listenTo(this.model, 'change', this.updateChart);
  }

  initChart() {
    return c3.generate({
                bindto: '#' + this.id,
                data: {
                    columns: [
                        ['brightness', 100],
                        ['remaining', 0]
                    ],
                    type: 'donut',
                    colors: {
                        brightness: BRIGTHNESS_COLOR,
                        remaining: BRIGTHNESS_REMAINING_COLOR
                    }
                }
              });
  }

  updateChart() {
    var brightnessRaw = this.model.attributes.value;
    var brightness = brightnessRaw * 100 / 255;
    this.chart.load({
        columns: [
            ['brightness', brightness],
            ['remaining', 100 - brightness]
        ]
    });
    this.chart.data.colors({
        brightness: d3.rgb(brightnessRaw, brightnessRaw, brightnessRaw)
    });
  }

}


