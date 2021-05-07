// 1
QUnit.test('#13664 - annotation measure on yAxis', function (assert) {
    var chart = Highcharts.chart('container', {
        yAxis: [
            {
                height: '50%'
            },
            {
                top: '50%',
                height: '50%'
            }
        ],
        annotations: [
            {
                type: 'measure',
                typeOptions: {
                    selectType: 'x',
                    yAxis: 1,
                    xAxis: 0,
                    point: {
                        x: 5,
                        y: 10
                    },
                    background: {
                        width: 300 + 'px',
                        height: 150 + 'px'
                    }
                }
            }
        ],

        series: [{
            data: [1, 2, 3, 2, 3, 4, 5, 6, 7, 8, 3, 2, 4, 4, 4, 4, 3]
        }, {
            yAxis: 1,
            data: [6, 7, 8, 3, 2, 4, 4, 4, 4, 3, 3, 2, 4, 4, 4, 4, 3]
        }]
    });

    assert.ok(
        chart.annotations[0].shapesGroup.getBBox().y === chart.yAxis[1].top,
        'Annotation measure should be visible on vary yaxis (#13664).'
    );

    assert.close(
        chart.annotations[0].shapesGroup.getBBox().y,
        chart.annotations[0].labels[0].graphic.anchorY,
        0.5,
        "Annotation's label's Y position should be close to the Y position of the annotation."
    );

    assert.close(
        chart.annotations[0].shapesGroup.getBBox().x,
        chart.annotations[0].labels[0].graphic.anchorX,
        0.5,
        "Annotation's label's X position should be close to the X position of the annotation."
    );

    chart.update({
        chart: {
            spacingTop: 100
        },
        title: {
            text: ''
        }
    });

    assert.close(
        chart.annotations[0].shapesGroup.getBBox().y,
        chart.annotations[0].labels[0].graphic.anchorY,
        0.5,
        "Annotation's label's Y position should be close to the Y position of the annotation after updates."
    );

    assert.close(
        chart.annotations[0].shapesGroup.getBBox().x,
        chart.annotations[0].labels[0].graphic.anchorX,
        0.5,
        "Annotation's label's X position should be close to the X position of the annotation after updates."
    );
});
