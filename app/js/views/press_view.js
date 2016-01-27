var PRESSURE_COLOR = '#f5d304';
var INITIAL_PRESSURES = [800, 800, 800, 800, 800, 800, 800, 800];
var MAX_PRESSURE = 1100;
var MIN_PRESSURE = 800;

export class PressureGraphView extends Backbone.View {

  constructor(options) {
    super(options);
    this.chart = this.initChart();
    this.listenTo(this.model, 'change', this.updateChart);
  }

  initChart() {
    return c3.generate({
                bindto: '#press-chart',
                data: {
                  columns: [
                    ['pressure', ...INITIAL_PRESSURES]
                  ],
                  type: 'area-spline',
                  colors: {
                        pressure: PRESSURE_COLOR
                  }
                },
                axis: {
                    y: {
                        label: 'pressure (hPa)',
                        max: MAX_PRESSURE,
                        min: MIN_PRESSURE
                    }
                }
              });
  }

  updateChart() {
    this.chart.flow({
        columns: [
            ['pressure', this.model.attributes.value]
        ]
    });
  }
}
