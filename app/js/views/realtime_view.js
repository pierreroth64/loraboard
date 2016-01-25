
var MAX_SCREEN_LOGS = 100;

export class RealTimeView extends Backbone.View {

  constructor(options) {
    super(options);
    this.logsNumber = 0;
    this.setElement('#realtime-window');
    Backbone.Mediator.subscribe('data:newFrame', this.logFrame, this);
  }

  logFrame(raw, decoded) {
    var message = JSON.parse(raw);
    var data = `LoRa frame #${message.fcnt}: ${message.data} from: ${message.EUI}\nDecoded as: ${decoded}`;
    this.logData(data);
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
      console.log(warning);
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
