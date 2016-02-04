export class DataService  {

    constructor(name) {
        this.name = name;
        this.isStarted = false;
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
            console.log(`Error when starting ${this.name} data service: ${errorMsg}`);
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
            console.log(`Error when stopping ${this.name} data service: ${errorMsg}`);
        }
    }
    isDataFormatValid(data) {
        //FIXME: validate data. Must contain the following fields:
        // - data:  containing the payload
        // - fcnt: field counter (corresponding to the sequence number)
        // - EUI: is the device EUI (unique ID)
        return true;
    }

    onNewData(data) {
        if (this.isDataFormatValid(data)) {
            Backbone.Mediator.publish('data:newFrame', data);
        } else {
            //FIXME: actually write this "documentation" ;)
            console.log('Received data format is not valid, check documentation for your DataService.onNewData(...) implementation');
        }
    }

    onError(msg) {
        console.log(`${this.name} data service error: ${msg}`);
    }

    // methods to be implemented by concrete classes
    onStart() {
        throw new Error('onStart has to be implemented in your DataService');
    }

    onStop() {
        throw new Error('onStop has to be implemented in your DataService');
    }
}
