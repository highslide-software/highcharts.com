Highcharts.getJSON(
    'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/us-population-density.json',
    function (data) {
        // Make it joinable
        data.forEach(function (p) {
            p.hasc = 'US.' + p.code.toUpperCase();
        });

        // Instanciate the map
        Highcharts.mapChart('container', {
            chart: {
                borderWidth: 1
            },

            title: {
                text: 'Data label format to show value'
            },

            legend: {
                title: {
                    text: 'US population density per km²'
                }
            },

            mapNavigation: {
                enabled: true
            },

            colorAxis: {
                min: 1,
                type: 'logarithmic',
                minColor: '#EEEEFF',
                maxColor: '#000022',
                stops: [
                    [0, '#EFEFFF'],
                    [0.67, '#4444FF'],
                    [1, '#000022']
                ]
            },

            series: [
                {
                    data: data,
                    mapData: Highcharts.maps['countries/us/us-all'],
                    joinBy: 'hasc',
                    dataLabels: {
                        enabled: true,
                        format: '{point.value:.1f}'
                    },
                    name: 'Population density',
                    tooltip: {
                        pointFormat: '{point.code}: {point.value}/km²'
                    }
                }
            ]
        });
    }
);
