[![Build Status](https://travis-ci.org/pierreroth/loraboard.svg?branch=master)](https://travis-ci.org/pierreroth/loraboard)

# LoRa dashboard demo

Single page web application displaying live data from a LoRaMote thanks to [Semtech](http://www.semtech.com/) starter kit.

## Overview

![Lora setup](https://raw.githubusercontent.com/pierreroth/loraboard/master/doc-images/setup_loramote.png)

Using the starter kit and some web based services, this web app displays data coming from your LoRaMote.

## Setup

### LoRaMote (end point)

Follow the Semtech user guide to setup the LoRaMote device.

### LoRa gateway

You must stop the current packet forwarder and change its configuration files.

* In local.conf, change the gateway ID
* In global.conf, change the gateway ID, point to loriot service and be sure that the port values are correct:
```
   "gateway_ID": "B827EBFFFF6F8A98",
   /* change with default server address/ports, or overwrite in local_conf.json */
   "server_address": "mq.loriot.io",
   "serv_port_up": 1780,
   "serv_port_down": 1780,
```
You can then restart the packet forwarder and check its initial output which displays the current settings (gateway ID, server and port)

### Loriot and PubNub services

Once the gateway is configured, you should be able to setup your [loriot.io](http://www.loriot.io) sample app and see the LoRa frames conming in.

The last thing to do is to create a [PubNub](http://www.pubnub.com) channel to publish to. You can then configure the loriot app to publish data to PubNub (PubNub is one of the possible outputs).

Here you are: your LoRaMote device is pushing its data to the PubNub service! You just have to subscribe to the correct channel to receive this data.

### Web application

This web app subscribes to the previously configured PubNub service and decodes and displays live data.

You'll have to change the *PubNub channel and subscribe key* point to your pubnub account. Just open, the popup window to enter your PubNub credentials (click on Details and then Setup icon)

Install the dependencies:

```
bower install
npm install
```
... and run the following command to serve the single page app and open your browser to http://localhost:9000:

```
npm start
```

To deploy, copy paste the entire directory in your webserver virtualhost basedir. Work in Progress: use a builder such as brunch.io to pack everything and make production build easier.

## Developers

To run the tests:

```
npm test
```

As we are not web development experts, any comment/help/PR is appreciated and we'll be happy to add your name to the CONTRIBUTORS file ;)

