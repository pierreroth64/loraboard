import {WidgetView} from './widget_view';

var MAX_SCREEN_LOGS = 100;

export class RealTimeView extends WidgetView {

  constructor(options) {
    super(options);
    this.events = {
      'click #clear-logs-btn': 'clearScreenLogs'
    };
    this.logsNumber = 0;
    this.setElement('#realtime-box');
    this.render();
    Backbone.Mediator.subscribe('data:upstream', this.logFrame, this);
  }

  render() {
    var html = `<h4>Realtime data <button id="clear-logs-btn" type="button" class="btn btn-default">
                  <span id="clear-logs-btn-icon" class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                </button></h4>
                <textarea id="realtime-window" class="form-control" rows="4"></textarea>`;
    this.$el.html(html);
    return this;
  }

  logFrame(message) {
    if (message.EUI == this.device.getEUI()) {
      this.logData(`frame #${message.fcnt} from ${this.device.getFormattedEUI()}: ${message.data}`);
    }
  }

  logData(message, separator) {
    this.logsNumber++;
    console.log(message);
    if (this.logsNumber <= MAX_SCREEN_LOGS) {
      this.appendToScreenLogs(message + (separator ? separator: ''));
    } else {
      var warning = `reached max logs number (${MAX_SCREEN_LOGS}), cleared log window!`;
      this.logsNumber = 0;
      this.clearScreenLogs();
      console.warn(warning);
      this.appendToScreenLogs(warning);
    }
  }

  appendToScreenLogs(message) {
    $('#realtime-window').append(message + '\n');
    var realTimeWin = $('#realtime-window');
    if (realTimeWin.length) {
       realTimeWin.scrollTop(realTimeWin[0].scrollHeight - realTimeWin.height());
    }
  }

  clearScreenLogs() {
    $('#realtime-window').text('');
  }
}
