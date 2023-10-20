QUnit.test('Treemap opacity on levels (#4700)', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [
                {
                    type: 'treemap',
                    allowDrillToNode: true,
                    dataLabels: {
                        enabled: false
                    },
                    levelIsConstant: false,
                    levels: [
                        {
                            level: 1,
                            dataLabels: {
                                enabled: true
                            },
                            borderWidth: 3
                        }
                    ],
                    data: [
                        {
                            id: 'A',
                            name: 'Apples',
                            color: '#EC2500'
                        },
                        {
                            id: 'B',
                            name: 'Bananas',
                            color: '#ECE100'
                        },
                        {
                            id: 'O',
                            name: 'Oranges',
                            color: '#EC9800'
                        },
                        {
                            name: 'Anne',
                            parent: 'A',
                            color: 'blue',
                            value: 5
                        },
                        {
                            name: 'Rick',
                            parent: 'A',
                            value: 3
                        },
                        {
                            name: 'Peter',
                            parent: 'A',
                            value: 4
                        },
                        {
                            name: 'Anne',
                            parent: 'B',
                            value: 4
                        },
                        {
                            name: 'Rick',
                            parent: 'B',
                            value: 10
                        },
                        {
                            name: 'Peter',
                            parent: 'B',
                            value: 1
                        },
                        {
                            name: 'Anne',
                            parent: 'O',
                            value: 1
                        },
                        {
                            name: 'Rick',
                            parent: 'O',
                            value: 3
                        },
                        {
                            name: 'Peter',
                            parent: 'O',
                            value: 3
                        },
                        {
                            name: 'Susanne',
                            parent: 'Kiwi',
                            value: 2,
                            color: '#9EDE00'
                        }
                    ]
                }
            ]
        }),
        series = chart.series[0],
        point = series.points[0],
        pointAttribs = function (point) {
            return Highcharts.Series.types.treemap.prototype.pointAttribs.call(
                series,
                point
            );
        },
        getOpacity = function (color) {
            return color.indexOf('rgba') > -1 ?
                +color.replace('rgba(', '').replace(')', '').split(',')[3] :
                1;
        },
        userOptions = {
            opacity: 1,
            states: {
                hover: {
                    opacity: 0.5
                }
            }
        };
    assert.strictEqual(
        getOpacity(pointAttribs(point).fill),
        0.15,
        'Default opacity is expected to be 0.25'
    );

    point.setState('hover');
    assert.strictEqual(
        getOpacity(pointAttribs(point).fill),
        0.75,
        'Default hover opacity is expected to be 0.75'
    );

    // Check if opacity set by user is applied.
    series.update(userOptions);
    point = series.points[0];

    point.setState('normal');
    assert.strictEqual(
        getOpacity(pointAttribs(point).fill),
        1,
        'userOption opacity is expected to be 1'
    );

    point.setState('hover');
    assert.strictEqual(
        getOpacity(pointAttribs(point).fill),
        0.5,
        'userOption hover opacity is expected to be 0.5'
    );

    // Check if leafNode has opacity
    point = series.points[12]; // Susanne
    assert.strictEqual(
        getOpacity(pointAttribs(point).fill),
        1,
        'Leaf node opacity is expected to be undefined'
    );

    point.setState('hover');
    assert.strictEqual(
        getOpacity(pointAttribs(point).fill),
        1,
        'Leaf node hover opacity is expected to be undefined'
    );
});
