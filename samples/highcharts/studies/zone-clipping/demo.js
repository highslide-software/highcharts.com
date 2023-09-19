Highcharts.chart('container', {
    chart: {
        width: 400
    },
    title: {
        text: 'Zoned graph with adaptive clips',
        align: 'left'
    },
    legend: {
        enabled: false
    },
    yAxis: {
        title: null
    },
    plotOptions: {
        series: {
            marker: {
                enabled: false
            }
        }
    },
    series: [{
        data1: [1, 1, -1, 1, 1],
        data2: [1000, 1000, -1, -1, 0, 0, 1, 1, -1],
        data: [1, -1, -1, -2, 0, 1, -1, -0.022, -0.01, 1, 2, 1],
        data4: new Array(10).fill(0).map(() => Math.random() - 0.5),
        type: 'area',
        lineWidth: 10,
        color: 'lightgreen',
        negativeColor: 'red'
        // dashStyle: 'Dash'
    }],

    // Area with zone
    series1: [{
        data: [1, 2, 0.5, 3, 1, 0.1, 3, 1],
        type: 'area',
        lineWidth: 5,
        color: 'lightgreen',
        zones: [{
            value: 1,
            color: 'red'
        }]
        // dashStyle: 'Dash'
    }],

    // Multiple zones
    series2: [{
        data: [1, 2, 0.5, 3, 1, 0.1, 3, 1],
        lineWidth: 5,
        color: 'lightgreen',
        zones: [{
            value: 1,
            color: 'red'
        }, {
            value: 2,
            color: 'blue'
        }]
        // dashStyle: 'Dash'
    }]
});

setTimeout(() => {
    // chart.series[0].addPoint(-5, true, true, { duration: 1234 });
}, 1234);