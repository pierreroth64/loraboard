
var TEMPERATURE_COLOR = '#c40079';
var INITIAL_TEMPERATURES = [0, 0, 0, 0, 0, 0, 0, 0];
var MAX_TEMPERATURE = 50;
var MIN_TEMPERATURE = 0;

export class TemperatureGraphView extends Backbone.View {

  constructor(options) {
    super(options);
    this.chart = this.initChart();
    this.listenTo(this.model, 'change', this.updateChart);
  }

  initChart() {
    return c3.generate({
                bindto: '#temp-chart',
                data: {
                  columns: [
                    ['temperature', ...INITIAL_TEMPERATURES]
                  ],
                  type: 'area-spline',
                  colors: {
                        temperature: TEMPERATURE_COLOR
                  }
                },
                axis: {
                    y: {
                        label: 'temperature (°C)',
                        max: MAX_TEMPERATURE,
                        min: MIN_TEMPERATURE
                    }
                }
              });
  }

  updateChart() {
    this.chart.flow({
        columns: [
            ['temperature', this.model.attributes.value]
        ]
    });
  }
}
