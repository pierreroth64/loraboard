import {GraphView} from './graph_view';

var TEMPERATURE_COLOR = '#c40079';
var INITIAL_TEMPERATURES = [0, 0, 0, 0, 0, 0, 0, 0];
var MAX_TEMPERATURE = 50;
var MIN_TEMPERATURE = 0;

export class TemperatureGraphView extends GraphView {

  constructor(options, ...extras) {
    super(options, ...extras);
    this.initializeGraph();
  }

  initChart() {
    return c3.generate({
                bindto: `#${this.id}`,
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

  updateChartData() {
    this.chart.flow({
        columns: [
            ['temperature', this.model.attributes.value]
        ]
    });
  }
}
