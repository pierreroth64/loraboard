var MAX_SAMPLES = 50;

export class GraphView extends Backbone.View {

    constructor(options, name='NotNamed graph', maxSamples=MAX_SAMPLES) {
    super(options);
    this.graphName = name;
    this.maxSamples = maxSamples;
    this.sampleNb = 0;
    this.chart = this.initChart();
  }

  initializeGraph() {
    this.listenTo(this.model, 'change', this.updateChart);
  }

  initChart() {
    throw new Error('your must implement the initChart() method in your inherited class!');
  }

  updateChart() {
    this.sampleNb++;
    this.updateChartData();
    this.mayResetChart();
  }

  updateChartData() {
    console.log(`updateChartData() has to be overriden in your ${this.graphName} class`);
  }

  _resetChart() {
      console.log(`${this.graphName} reached max number of points (${this.maxSamples}), reseting it!`);
      this.chart = this.initChart();
  }

  mayResetChart() {
    if (this.sampleNb > this.maxSamples) {
      this._resetChart();
      this.sampleNb = 0;
    }
  }
}
