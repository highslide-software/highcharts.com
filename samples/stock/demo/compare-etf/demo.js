const PERIOD_CAP = 12.03,
    PERIOD_BUFFER = 15,
    CSPXid = '0P0000OO1Z',
    ESPOid = '0P0001HVAN';

const timeSeriesConnector =
// eslint-disable-next-line no-undef
    new HighchartsConnectors.Morningstar.TimeSeriesConnector({
        api: {
            url: 'https://demo-live-data.highcharts.com',
            access: {
                url: 'https://demo-live-data.highcharts.com/token/oauth',
                token: 'token'
            }
        },
        currencyId: 'EUR',
        startDate: '2024-01-01',
        endDate: '2025-01-01',
        series: {
            type: 'Price'
        },
        securities: [{
            id: CSPXid,
            idType: 'MSID'
        }, {
            id: ESPOid,
            idType: 'MSID'
        }]
    });
(async () => {
    await timeSeriesConnector.load();

    const {
        [CSPXid]: CSPXValues,
        [ESPOid]: ESPOValues,
        Date: date
    } = timeSeriesConnector.table.getColumns();

    const CSPXdata = [],
        ESPOdata = [];

    for (let i = 0; i < date.length; i++) {
        CSPXdata.push([date[i], CSPXValues[i]]);
        ESPOdata.push([date[i], ESPOValues[i]]);
    }

    Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 4
        },

        yAxis: {
            labels: {
                format: '{#if (gt value 0)}+{/if}{value}%'
            },
            opposite: false,
            plotLines: [{
                value: PERIOD_CAP,
                width: 2,
                color: 'rgba(6, 79, 233, 1)',
                dashStyle: 'Dash',
                label: {
                    align: 'right',
                    text: `OUTCOME PERIOD CAP: ${PERIOD_CAP}%`,
                    x: -3,
                    style: {
                        color: 'rgba(6, 79, 233, 1)',
                        fontWeight: 'bold'
                    }
                }
            }, {
                value: -PERIOD_BUFFER,
                width: 2,
                color: 'rgba(233, 6, 41, 1)',
                dashStyle: 'Dash',
                label: {
                    align: 'right',
                    verticalAlign: 'bottom',
                    text: `OUTCOME PERIOD BUFFER: ${PERIOD_BUFFER}%`,
                    x: -3,
                    y: 13,
                    style: {
                        color: 'rgba(233, 6, 41, 1)',
                        fontWeight: 'bold'
                    }
                }
            }, {
                value: 0,
                width: 2,
                dashStyle: 'ShortDot'
            }],
            plotBands: [{
                from: 0,
                to: PERIOD_CAP,
                color: 'rgba(6, 79, 233, 0.2)'
            }, {
                from: 0,
                to: -PERIOD_BUFFER,
                color: 'rgba(233, 6, 41, 0.2)'
            }]
        },

        plotOptions: {
            series: {
                compare: 'percent',
                showInNavigator: true
            }
        },

        tooltip: {
            pointFormat: '<span style="color:{series.color}">' +
                        '{series.name}</span>: <b>{point.y} EUR</b> ' +
                        '({point.change}%)<br/>',
            valueDecimals: 2,
            split: true
        },

        series: [{
            name: 'iShares Core S&P 500 UCITS ETF',
            data: CSPXdata
        }, {
            name: 'VanEck Video Gaming and eSports ETF',
            data: ESPOdata
        }]
    });
})();