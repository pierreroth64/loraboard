# LoRa dashboard demo

Single page web application displaying live data from a LoRaMote thanks to [Semtech](http://www.semtech.com/) starter kit.

## Overview

![Alt text](https://raw.githubusercontent.com/pierreroth/loraboard/master/doc-images/setup_loramote.png?token=AJyXh20kytIqx58ImZ4y1ftYnTyQZMRGks5Wp3BFwA%3D%3D)

Using the starter kit and some web based services, this web app displays data coming from your LoRaMote.

## Setup

### LoRaMote (end point)

Follow the Semtech user guide to setup the LoRaMote device.

### LoRa gateway

You must stop the current packet forwarder and change its configuration files.

* In local.conf, change the gateway ID
* In global.conf, change the gateway ID, point to lorio service and be sure that the port values are correct:
```
   "gateway_ID": "B827EBFFFF6F8A98",
   /* change with default server address/ports, or overwrite in local_conf.json */
   "server_address": "mq.loriot.io",
   "serv_port_up": 1780,
   "serv_port_down": 1780,
```
You can then restart the packet forwarder and check its initial output which displays the current settings (gateway ID, server and port)

### Loriot and PubNub services

Once the gateway is configured, you should be able to setup your [lorio.io](http://www.loriot.io) sample app and see the LoRa frames conming in.

The last thing to do is to create a [PubNub](http://www.pubnub.com) channel to publish to. You can then configure the lorio app to publish data to PubNub (PubNub is one of the possible outputs).

Here you are: your LoRaMote device is pushing its data to the PubNub service! You just have to subscribe to the correct channel to receive this data.

### Web application

This web app subscribes to the previously configured PubNub service and decodes and displays live data.

It was developed using a template generated by the [yeoman web-app generator](https://github.com/yeoman/generator-gulp-webapp). Follow the steps and it should be ok.

Just run the following command to serve the single page app and open your browser to http://localhost:9000:
```
gulp serve
```

## Developers

Please note that this a simple JS script without any architecture effort or framework usage. It's provided as-is and you may want to achieve some decoupling with some awesome libraries such as http://backbonejs.org/. There are no tests at all (which is _bad_!)
