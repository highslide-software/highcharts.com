/* *
 *
 *  Sample application using a MQTT connector (custom connector)
 *
 * */

// Highcharts common options
Highcharts.setOptions({
    chart: {
        type: 'spline',
        animation: true
    },
    legend: {
        enabled: false
    },
    xAxis: {
        type: 'datetime',
        labels: {
            format: '{value:%H:%M}'
        }
    },
    yAxis: {
        title: {
            text: 'Power (MW)'
        }
    },
    tooltip: {
        useHTML: true,
        formatter: function () {
            const date = Highcharts.dateFormat('%A, %b %e, %H:%M', this.x);
            return `<b>${date} (UTC)</b><hr>Generated power: ${this.y} MW<br/>`;
        }
    }
});

const dataGridOptions = {
    cellHeight: 38,
    editable: false,
    columns: {
        time: {
            headerFormat: 'Time (UTC)',
            cellFormatter: function () {
                const date = new Date(this.value);
                return Highcharts.dateFormat('%H:%M', date);
            }
        },
        power: {
            headerFormat: 'Power (MW)'
        }
    }
};

// MQTT connection configuration
const mqttConfig = {
    host: 'mqtt.sognekraft.no',
    port: 8083,
    user: 'highsoft',
    password: 'Qs0URPjxnWlcuYBmFWNK'
};

// Connector configuration
const connConfig = {
    columnNames: [
        'time',
        'power'
    ],
    beforeParse: data => {
        // Application specific data parsing, extracts power production data
        const modifiedData = [];
        if (data.aggs) {
            const ts = new Date(data.tst_iso).valueOf();
            // Generated power in MW
            modifiedData.push([ts, data.aggs[0].P_gen]);
        }
        return modifiedData;
    },
    connectEvent: (isConnected, host, port, user) => {
        // eslint-disable-next-line max-len
        logAppend(`Client ${isConnected ? 'connected' : 'disconnected'}: host: ${host}, port: ${port}, user: ${user}`);
    },
    subscribeEvent: (isSubscribed, topic) => {
        logAppend(
            `Client ${isSubscribed ? 'subscribed' : 'unsubscribed'}: ${topic}`
        );
    },
    packetEvent: (topic, packet) => {
        logAppend(`Packet received: ${topic} - ${packet}`);
    },
    errorEvent: error => {
        logAppend(`<span style="color:red">${error}</span>`);
    }
};


// Create the dashboard
function createDashboard() {
    return Dashboards.board('container', {
        dataPool: {
            connectors: [{
                type: 'MQTT',
                id: 'mqtt-data-1',
                options: {
                    ...mqttConfig,
                    topic: 'prod/DEMO_Highsoft/kraftverk_1/overview',
                    ...connConfig
                }
            }, {
                type: 'MQTT',
                id: 'mqtt-data-2',
                options: {
                    ...mqttConfig,
                    topic: 'prod/DEMO_Highsoft/kraftverk_2/overview',
                    ...connConfig
                }
            }]
        },
        components: [{
            renderTo: 'column-chart-1',
            type: 'Highcharts',
            connector: {
                id: 'mqtt-data-1',
                columnAssignment: [{
                    seriesId: 'power',
                    data: ['time', 'power']
                }]
            },
            sync: {
                highlight: true
            },
            chartOptions: {
                title: {
                    text: 'Power Station 1'
                }
            }
        }, {
            renderTo: 'data-grid-1',
            type: 'DataGrid',
            connector: {
                id: 'mqtt-data-1'
            },
            sync: {
                highlight: true
            },
            dataGridOptions: dataGridOptions
        }, {
            renderTo: 'column-chart-2',
            type: 'Highcharts',
            connector: {
                id: 'mqtt-data-2',
                columnAssignment: [{
                    seriesId: 'power',
                    data: ['time', 'power']
                }]
            },
            sync: {
                highlight: true
            },
            chartOptions: {
                title: {
                    text: 'Power Station 2'
                }
            }
        }, {
            renderTo: 'data-grid-2',
            type: 'DataGrid',
            connector: {
                id: 'mqtt-data-2'
            },
            sync: {
                highlight: true
            },
            dataGridOptions: dataGridOptions
        }, {
            renderTo: 'html-log',
            type: 'HTML',
            title: 'MQTT Event Log',
            html: '<pre id="log-content"></pre>'
        }],
        gui: {
            layouts: [{
                rows: [{
                    // For power station 1
                    cells: [{
                        id: 'column-chart-1'
                    }, {
                        id: 'data-grid-1'
                    }]
                }, {
                    // For power station 2
                    cells: [{
                        id: 'column-chart-2'
                    }, {
                        id: 'data-grid-2'
                    }]
                }, {
                    // Log/info area
                    cells: [{
                        id: 'html-log'
                    }]
                }]
            }]
        }
    }, true);
}


/* *
 *
 *  Event log
 *
 * */
let logContent;

window.onload = () => {
    logContent = document.getElementById('log-content');
    logClear();
    logAppend('Application started');
};

function logAppend(message) {
    // Append message with timestamp
    const time = new Date().toLocaleTimeString();
    logContent.innerHTML += `${time}: ${message}\n`;

    // Scroll to bottom
    logContent.scrollTop = logContent.scrollHeight;
}

function logClear() {
    logContent.innerHTML = '';
}


/* *
 *
 *  MQTT connector class - custom connector
 *
 * */

let MQTTClient;
try {
    // eslint-disable-next-line no-undef
    MQTTClient = Paho.MQTT.Client;
} catch (e) {
    console.error('Paho MQTT library not found:', e);
}

/* eslint-disable no-underscore-dangle */
const modules = Dashboards._modules;

const DataConnector = modules['Data/Connectors/DataConnector.js'];
const JSONConverter = modules['Data/Converters/JSONConverter.js'];
const U = modules['Core/Utilities.js'];
const { merge } = U;

// Connector instances, indexed by clientId
const instanceTable = {};


/* *
 *
 *  Class
 *
 * */

class MQTTConnector extends DataConnector {
    /**
     * Constructs an instance of MQTTConnector
     *
     * @param options
     * Options for the connector and converter.
     */
    constructor(options) {
        const mergedOptions = merge(
            MQTTConnector.defaultOptions,
            options
        );
        super(mergedOptions);
        mergedOptions.firstRowAsNames = false;

        this.converter = new JSONConverter(mergedOptions);
        this.options = mergedOptions;

        // Connection status
        this.connected = false;
        this.packetCount = 0;

        // Generate a unique client ID
        const clientId = 'clientId-' + Math.floor(Math.random() * 10000);
        this.clientId = clientId;

        // Store connector instance (for use in callbacks from MQTT client)
        instanceTable[clientId] = this;
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Sets up the MQTT connection and subscribes to the topic.
     *
     */
    async load() {
        const connector = this,
            {
                host, port
            } = connector.options;

        // Start MQTT client
        this.mqtt = new MQTTClient(host, port, this.clientId);
        this.mqtt.onConnectionLost = this.onConnectionLost;
        this.mqtt.onMessageArrived = this.onMessageArrived;

        await this.connect();

        return connector;
    }

    /**
     * Connects to an MQTT broker.
     *
     */
    async connect() {
        if (this.connected) {
            throw Error('Already connected');
        }
        const { user, password, timeout, useSSL, cleanSession } = this.options;

        // Connect to broker
        this.mqtt.connect({
            useSSL: useSSL,
            timeout: timeout,
            cleanSession: cleanSession,
            onSuccess: () => this.onConnect(),
            onFailure: resp => this.onFailure(resp),
            userName: user,
            password: password
        });
    }

    /**
     * Disconnects from an MQTT broker.
     *
     */
    async disconnect() {
        if (this.connected) {
            this.mqtt.disconnect();
        }
    }

    /**
     * Subscribe to an MQTT topic.
     *
     */
    async subscribe() {
        if (this.connected) {
            const { topic, qOs, subscribeEvent } = this.options;
            this.mqtt.subscribe(topic, { qos: qOs });

            if (subscribeEvent) {
                subscribeEvent(true, topic);
            }
            return;
        }
        throw Error('Not connected: subscription not possible');
    }

    /**
     * Unsubscribe from an MQTT topic.
     *
     */
    unsubscribe() {
        if (this.connected) {
            const { topic, subscribeEvent } = this.options.topic;
            this.mqtt.unsubscribe(topic);

            if (subscribeEvent) {
                subscribeEvent(false, topic);
            }
        }
    }

    /**
     * Handle established connection
     *
     */
    onConnect() {
        this.connected = true;
        const { host, port, user, connectEvent } = this.options;

        if (connectEvent) {
            connectEvent(true, host, port, user);
        }

        // Subscribe to the topic
        this.subscribe();
    }

    /**
     * Handle incoming messages
     *
     */
    onMessageArrived(mqttPacket) {
        // Executes in Paho.MQTT.Client context
        const connector = instanceTable[this.clientId],
            converter = connector.converter,
            connTable = connector.table;

        connector.packetCount++;

        // Execute custom packet handler
        const packetEvent = connector.options.packetEvent;
        if (packetEvent) {
            packetEvent(mqttPacket.destinationName, mqttPacket.payloadString);
        }

        // Parse the message
        const data = JSON.parse(mqttPacket.payloadString);
        converter.parse({ data });
        const convTable = converter.getTable();

        // Append the incoming data to the current table
        if (connTable.getRowCount() === 0) {
            // First message, initialize columns for data storage
            connTable.setColumns(convTable.getColumns());
        } else {
            // Subsequent message, append row
            connTable.setRows(convTable.getRows());
        }

        // TBD: Invoke data modifier (if any)
    }

    /**
     * Handle lost connection
     *
     */
    onConnectionLost(response) {
        // Executes in Paho.MQTT.Client context
        const connector = instanceTable[this.clientId];
        connector.connected = false;
        connector.packetCount = 0;

        const { connectEvent, errorEvent } = connector.options;

        // Execute custom connection handler
        if (connectEvent) {
            connectEvent(false);
        }

        if (response.errorCode !== 0) {
            // Execute custom error handler
            if (errorEvent) {
                errorEvent(response.errorMessage);
            }
            console.error('onConnectionLost:', response.errorMessage);
        }
    }

    /**
     * Handle failure
     *
     */
    onFailure(response) {
        this.connected = false;
        this.packetCount = 0;

        // Execute custom error handler
        if (this.options.errorEvent) {
            this.options.errorEvent(response.errorMessage);
        }
        console.error('onFailure:', response);
    }
}

/**
 *
 *  Static Properties
 *
 */
MQTTConnector.defaultOptions = {
    host: 'test.mosquitto.org',
    port: 1883,
    user: '',
    password: '',
    timeout: 10,
    qOs: 0,  // Quality of Service
    topic: 'mqtt',
    useSSL: true,
    cleanSession: true
};

// Register the connector
MQTTConnector.registerType('MQTT', MQTTConnector);

/**
 *
 *  Launch the application
 *
 */
createDashboard();
