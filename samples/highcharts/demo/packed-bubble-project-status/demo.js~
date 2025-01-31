Highcharts.chart('container', {
    chart: {
        type: 'packedbubble',
        height: '100%'
    },
    title: {
        text: 'Team Dashboard'
    },
    subtitle: {
        text: 'Currently planned work for team'
    },
    tooltip: {
        useHTML: true,
        pointFormat: '<b>{point.name}:</b> {point.value}'
    },
    plotOptions: {
        packedbubble: {
            minSize: '15%',
            maxSize: '50%',
            layoutAlgorithm: {
                maxSpeed: 2,
                initialPositionRadius: 1,
                splitSeries: true,
                parentNodeLimit: true,
                dragBetweenSeries: true,
                friction: -0.9,
                parentNodeOptions: {
                    maxSpeed: 1,
                    bubblePadding: 20,
                    initialPositionRadius: 120
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.shortName}',
                parentNodeFormat: '{point.series.name}',
                style: {
                    fontSize: '0.9em'
                }
            }
        }
    },
    series: [{
        name: 'Backlog',
        color: 'rgba(0, 40, 130, 0.8)',
        data: [{
            name: 'Test web page performance',
            shortName: 'Test page',
            value: 5
        }, {
            name: 'Bike trip',
            shortName: 'trip',
            value: 1
        },
        {
            name: 'Code-review meeting',
            shortName: 'CR',
            value: 4
        },
        {
            name: 'Allow user to change nickname',
            shortName: 'Nickname',
            value: 2
        }]
    }, {
        name: 'To Do',
        color: 'rgba(200, 100, 100, 0.8)',
        data: [{
            name: 'Create newsletter template',
            shortName: 'Newsletter',
            value: 2
        }, {
            name: 'Produce financial raport for Q2',
            shortName: 'Report',
            value: 10
        }, {
            name: 'Meeting with sales team',
            shortName: 'Meeting',
            value: 10
        }]
    }, {
        name: 'In Progress',
        color: 'rgba(0,100,100, 0.8)',
        data: [{
            name: 'Develop an android App',
            shortName: 'Development',
            value: 9
        }, {
            name: 'Document the API',
            shortName: 'API',
            value: 7
        }]
    }, {
        name: 'To Verify',
        color: 'rgba(200, 100, 200, 0.8)',
        data: [{
            name: 'Develop an IOS App',
            shortName: 'Development',
            value: 9
        }, {
            name: 'Change default login page',
            shortName: 'webpage',
            value: 5
        }]
    }, {
        name: 'Done',
        color: 'rgba(70,220,50,0.8)',
        data: [{
            name: 'Strategy meeting with Management',
            shortName: 'Meeting',
            value: 5
        }, {
            name: 'Kanban Packed Bubble migration',
            shortName: 'Migration',
            value: 3
        }]
    }]
});
