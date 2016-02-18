export class DataService  {

    constructor(name) {
        this.name = name;
        this.isStarted = false;
        Backbone.Mediator.subscribe('data:downstream', this.sendData, this);
    }

    start() {
        try {
            if (!this.isStarted) {
                console.log(`Starting ${this.name} data service...`);
                this.onStart();
                this.isStarted = true;
               console.log(`Started ${this.name} data service.`);
            } else {
                console.log(`${this.name} data service already started`);
            }
        } catch (e) {
            var errorMsg = JSON.stringify(e);
            console.error(`Error when starting ${this.name} data service: ${errorMsg}`);
        }
    }

    stop() {
        try {
            if (this.isStarted) {
                console.log(`Stopping ${this.name} data service...`);
                this.onStop();
                this.isStarted = false;
                console.log(`Stopped ${this.name} data service.`);
            } else {
                console.log(`${this.name} data service already stopped`);
            }
        } catch (e) {
            var errorMsg = JSON.stringify(e);
            console.error(`Error when stopping ${this.name} data service: ${errorMsg}`);
        }
    }

    isDataFormatValid(data) {
        try {
            data = JSON.parse(data);
            if (data.data == undefined || data.EUI == undefined || data.fcnt == undefined) {
                throw new Error('JSON data does not contain expected fields: data, EUI and fcnt');
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    onReceivedData(data) {
        if (this.isDataFormatValid(data)) {
            Backbone.Mediator.publish('data:upstream', data);
        } else {
            //FIXME: actually write this "documentation" ;)
            console.error('Received data format is not valid, check documentation for your DataService.onNewData(...) implementation');
        }
    }

    sendData(data) {
        this.onSendData(data);
    }

    onError(msg) {
        console.error(`${this.name} data service error: ${msg}`);
    }

    // methods to be implemented by concrete classes
    onStart() {
        throw new Error('onStart has to be implemented in your DataService');
    }

    onStop() {
        throw new Error('onStop has to be implemented in your DataService');
    }

    onSendData(data) {
        throw new Error('onSendData has to be implemented in your DataService');
    }
}
