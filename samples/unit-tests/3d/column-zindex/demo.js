QUnit.test('Column zIndex calculation #5297', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'column',
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 80,
                depth: 300,
                viewDistance: 5
            }
        },
        xAxis: {
            min: 0,
            max: 10
        },
        yAxis: {
            min: 0,
            max: 10
        },
        series: [
            {
                data: [
                    {
                        x: 5,
                        y: 5,
                        color: 'yellow'
                    }
                ]
            },
            {
                data: [
                    {
                        x: 3,
                        y: 5,
                        color: 'green'
                    }
                ]
            }
        ]
    });
    var point1 = chart.series[0].data[0],
        point2 = chart.series[1].data[0];

    assert.strictEqual(
        point2.graphic.zIndex < point1.graphic.zIndex,
        true,
        'zIndex is correct for column series'
    );
});

// Highcharts 4.1.10, Issue #4774: 3D column - disabled animation
QUnit.test(
    '3D column chart with disabled animation should properly set zIndexes for cuboids. (#4774)',
    function (assert) {
        var chart = new Highcharts.Chart({
            chart: {
                animation: false,
                renderTo: 'container',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 45
                }
            },
            series: [
                {
                    animation: false,
                    data: [
                        10, 20, 30, 40, 50, 10, 20, 10, 20, 30, 40, 50, 10, 20,
                        10, 20, 30, 40, 50, 10, 20, 10, 20, 30, 40, 50, 10, 20,
                        10, 20, 30, 40, 50, 10, 20
                    ],
                    type: 'column',
                    depth: 100
                }
            ]
        });

        assert.ok(
            chart.series[0].points[4].graphic.attr('zIndex') <
                chart.series[0].points[5].graphic.attr('zIndex'),
            'Proper zIndex'
        );
    }
);

QUnit.test(
    '3D column zIndex for big chart size and big dataSet',
    function (assert) {
        var chart = new Highcharts.Chart({
            chart: {
                type: 'column',
                renderTo: 'container',
                options3d: {
                    enabled: true,
                    alpha: 15,
                    beta: 20,
                    depth: 60,
                    frame: {
                        side: {
                            color: '#BBBBBB'
                        },
                        bottom: {
                            color: '#828282'
                        }
                    }
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    depth: 60,
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            colors: [
                '#ffea5e',
                '#ffab51',
                '#ff3030',
                '#9efc42',
                '#42fcce',
                '#8ea6ff',
                '#e08eff',
                '#ffb5ee',
                '#d8b800',
                '#f56300',
                '#bf0000',
                '#43d400',
                '#2d9a87',
                '#2b50d8',
                '#a92bd8',
                '#d867be',
                '#9c8500',
                '#833500',
                '#540000',
                '#007b00',
                '#13574b',
                '#000080',
                '#57059b',
                '#800060'
            ],
            series: [
                {
                    data: [
                        54, 34, 9, 30, 46, 57, 50, 26, 99, 62, 33, 47, 24, 44,
                        56, 71, 62, 56, 35, 80, 72, 48, 54, 46, 62, 71, 66, 52,
                        111, 129, 95, 92, 63, 171, 66, 96, 52, 62, 93, 54, 69,
                        111, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 3, 0, 0, 0, 3, 3, 2, 8, 3, 4, 0, 0, 0, 5, 8, 0,
                        5, 0, 0, 10, 1, 1, 0, 31, 18, 33, 17, 16, 6, 16, 20, 4,
                        12, 10, 1, 0, 0, 0, 0, 0, 1, 25, 3, 8, 15, 19, 30, 4, 5,
                        5, 18, 6
                    ]
                },
                {
                    data: [
                        257, 312, 85, 147, 444, 294, 586, 355, 597, 569, 509,
                        443, 455, 464, 202, 372, 409, 421, 211, 315, 364, 444,
                        414, 299, 430, 369, 325, 269, 437, 412, 492, 363, 413,
                        757, 436, 515, 392, 413, 383, 231, 326, 484, 518, 329,
                        589, 515, 369, 365, 522, 464, 456, 245, 473, 370, 531,
                        496, 648, 720, 796, 616, 602, 599, 426, 261, 525, 559,
                        611, 663, 537, 806, 786, 723, 711, 666, 623, 391, 692,
                        644, 891, 459, 715, 665, 757, 652, 925, 1040, 674, 623,
                        1023, 1208, 1203, 963, 951, 594, 1216, 864, 1019, 564,
                        706, 893, 720, 908, 699, 676, 885, 648, 707, 632, 823,
                        414, 595, 408, 565, 178
                    ]
                },
                {
                    data: [
                        254, 349, 113, 203, 496, 875, 468, 506, 748, 664, 675,
                        466, 660, 590, 238, 379, 602, 557, 157, 316, 470, 355,
                        328, 439, 565, 426, 260, 290, 505, 473, 475, 409, 362,
                        744, 432, 590, 526, 462, 406, 303, 354, 460, 684, 321,
                        768, 710, 543, 553, 618, 632, 551, 330, 672, 557, 599,
                        646, 660, 682, 888, 855, 648, 744, 515, 253, 470, 624,
                        616, 700, 619, 859, 765, 983, 760, 855, 740, 516, 947,
                        834, 997, 546, 577, 503, 864, 905, 1208, 1441, 979, 858,
                        1726, 1932, 2334, 1797, 1336, 789, 1694, 1093, 1324,
                        1021, 1026, 1297, 1025, 1321, 898, 853, 1061, 812, 916,
                        799, 1147, 618, 642, 610, 742, 244
                    ]
                },
                {
                    data: [
                        365, 496, 141, 303, 612, 710, 916, 430, 854, 871, 796,
                        629, 800, 596, 283, 333, 669, 678, 270, 371, 498, 529,
                        349, 518, 787, 591, 414, 207, 593, 543, 581, 394, 433,
                        938, 631, 623, 557, 529, 553, 254, 513, 618, 521, 395,
                        702, 546, 608, 565, 790, 594, 480, 288, 635, 496, 641,
                        799, 773, 774, 962, 822, 835, 757, 490, 309, 652, 765,
                        731, 802, 681, 1059, 1051, 985, 1026, 957, 838, 577,
                        1035, 866, 1162, 612, 724, 697, 894, 877, 1283, 1349,
                        824, 837, 1693, 2091, 1934, 1900, 1620, 843, 2043, 1474,
                        1420, 1148, 1172, 1146, 1105, 1306, 1015, 1137, 1350,
                        972, 1057, 880, 1291, 705, 817, 541, 903, 264
                    ]
                },
                {
                    data: [
                        53, 29, 4, 15, 52, 55, 61, 57, 92, 60, 60, 66, 47, 41,
                        11, 39, 52, 53, 23, 27, 52, 33, 44, 37, 70, 41, 26, 27,
                        41, 62, 61, 33, 45, 108, 47, 66, 32, 38, 36, 28, 41, 71,
                        81, 40, 48, 42, 90, 52, 100, 60, 59, 31, 73, 66, 53, 57,
                        111, 95, 93, 94, 79, 66, 62, 48, 81, 61, 88, 58, 88,
                        104, 117, 85, 76, 84, 64, 31, 62, 62, 63, 34, 48, 99,
                        65, 83, 79, 107, 83, 43, 87, 96, 206, 83, 105, 68, 136,
                        96, 82, 82, 66, 67, 85, 111, 41, 73, 83, 48, 52, 52, 75,
                        39, 55, 35, 47, 20
                    ]
                },
                {
                    data: [
                        39, 78, 12, 22, 46, 98, 87, 68, 105, 95, 84, 92, 86,
                        107, 25, 62, 92, 106, 135, 202, 214, 178, 142, 176, 208,
                        135, 95, 132, 163, 216, 134, 88, 116, 209, 171, 164,
                        105, 99, 147, 95, 139, 157, 137, 82, 158, 141, 92, 106,
                        155, 109, 103, 43, 106, 107, 159, 117, 169, 190, 207,
                        226, 166, 167, 97, 74, 117, 113, 119, 111, 169, 211,
                        278, 280, 209, 209, 179, 98, 286, 201, 328, 115, 109,
                        141, 213, 155, 203, 274, 281, 166, 310, 459, 398, 314,
                        305, 229, 381, 280, 296, 222, 251, 275, 238, 304, 203,
                        177, 166, 171, 170, 157, 225, 133, 181, 79, 154, 53
                    ]
                },
                {
                    data: [
                        0, 6, 0, 1, 3, 3, 7, 5, 2, 5, 0, 4, 5, 0, 2, 6, 4, 0, 5,
                        0, 0, 0, 0, 0, 2, 0, 1, 0, 0, 0, 1, 0, 1, 2, 1, 0, 0, 0,
                        0, 0, 1, 0, 1, 0, 1, 3, 0, 0, 5, 1, 1, 0, 1, 0, 0, 1, 4,
                        6, 8, 0, 1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 5, 0, 0, 0, 0,
                        2, 0, 0, 2, 1, 0, 0, 0, 0, 14, 1, 2, 0, 4, 14, 7, 6, 9,
                        3, 2, 0, 5, 1, 2, 0, 1, 2, 3, 1, 1, 5, 3, 1, 0, 2, 1, 3,
                        0
                    ]
                },
                {
                    data: [
                        170, 237, 85, 128, 230, 238, 353, 191, 395, 355, 283,
                        284, 281, 257, 134, 148, 243, 188, 92, 122, 162, 176,
                        144, 133, 210, 188, 92, 118, 206, 256, 169, 204, 237,
                        242, 196, 263, 233, 247, 255, 143, 186, 205, 298, 145,
                        276, 212, 273, 182, 283, 247, 199, 112, 324, 207, 246,
                        284, 293, 294, 351, 320, 281, 332, 204, 127, 222, 242,
                        297, 366, 282, 408, 470, 475, 559, 433, 432, 268, 460,
                        417, 564, 315, 499, 628, 440, 513, 795, 815, 521, 474,
                        888, 949, 1107, 1012, 655, 333, 877, 913, 799, 602, 546,
                        697, 590, 827, 599, 679, 749, 493, 584, 418, 643, 285,
                        413, 211, 457, 148
                    ]
                },
                {
                    data: [
                        134, 105, 71, 95, 208, 168, 146, 162, 184, 315, 207,
                        277, 166, 129, 113, 20, 94, 111, 84, 113, 120, 35, 42,
                        90, 73, 65, 60, 57, 63, 40, 34, 109, 53, 68, 32, 40, 55,
                        17, 20, 5, 31, 33, 52, 36, 34, 90, 42, 71, 34, 45, 89,
                        20, 88, 51, 58, 49, 80, 42, 58, 50, 31, 65, 27, 11, 33,
                        25, 39, 50, 87, 63, 31, 52, 62, 44, 23, 44, 56, 88, 84,
                        39, 34, 78, 61, 34, 75, 54, 163, 22, 172, 151, 53, 108,
                        39, 26, 95, 42, 38, 54, 43, 37, 83, 81, 52, 15, 35, 20,
                        24, 37, 63, 61, 28, 38, 41, 5
                    ]
                }
            ]
        });
        var point1 = chart.series[0].points[chart.series[0].points.length - 4],
            point2 = chart.series[5].points[chart.series[5].points.length - 2],
            point3 = chart.series[1].points[4],
            point4 = chart.series[2].points[3];

        assert.ok(
            point1.graphic.attr('zIndex') < point2.graphic.attr('zIndex'),
            'Proper zIndex for big graph on right end'
        );
        assert.ok(
            point3.graphic.attr('zIndex') > point4.graphic.attr('zIndex'),
            'Proper zIndex for big graph on left end'
        );
    }
);
