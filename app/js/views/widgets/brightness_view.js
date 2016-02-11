var BRIGTHNESS_COLOR = '#321d04';

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
                        ['brightness', 100]
                    ],
                    type: 'donut',
                    colors: {
                        brightness: BRIGTHNESS_COLOR,
                    }
                }
              });
  }

  updateChart() {
    var brightnessRaw = this.model.attributes.value;
    this.chart.data.colors({
        brightness: d3.rgb(BRIGTHNESS_COLOR).brighter(brightnessRaw / 50)
    });
  }

}


