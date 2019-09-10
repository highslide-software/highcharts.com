/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface AbandsIndicatorOptions extends SmaIndicatorOptions,
            MultipleLinesIndicatorOptions {
            params?: AbandsIndicatorParamsOptions;
            lineWidth?: number;
            topLine?: Dictionary<CSSObject>;
            bottomLine?: Dictionary<CSSObject>;
        }

        interface AbandsIndicatorParamsOptions
            extends SmaIndicatorParamsOptions {
            factor?: number;
        }

        class AbandsIndicator
            extends SmaIndicator implements MultipleLinesIndicator {
            public options: AbandsIndicatorOptions;
            public data: Array<AbandsIndicatorPoint>;
            public linesApiNames: MultipleLinesMixin['linesApiNames'];
            public getTranslatedLinesNames: MultipleLinesMixin[
                'getTranslatedLinesNames'
            ];
            public getValues(
                series: Series,
                params: AbandsIndicatorParamsOptions
            ): (boolean|IndicatorValuesObject);
        }

        class AbandsIndicatorPoint extends SmaIndicatorPoint {
            public series: AbandsIndicator;
        }

        interface SeriesTypesDictionary {
            abands: typeof AbandsIndicator;
        }
    }
}


import '../parts/Utilities.js';
import multipleLinesMixin from '../mixins/multipe-lines.js';

var SMA = H.seriesTypes.sma,
    merge = H.merge,
    correctFloat = H.correctFloat;

/* eslint-disable valid-jsdoc */
/**
 * @private
 */
function getBaseForBand(low: number, high: number, factor: number): number {
    return ((
        (correctFloat(high - low)) /
        ((correctFloat(high + low)) / 2)
    ) * 1000) * factor;
}

/**
 * @private
 */
function getPointUB(high: number, base: number): number {
    return high * (correctFloat(1 + 2 * base));
}

/**
 * @private
 */
function getPointLB(low: number, base: number): number {
    return low * (correctFloat(1 - 2 * base));
}
/* eslint-enable valid-jsdoc */

/**
 * The ABands series type
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.abands
 *
 * @augments Highcharts.Series
 */
H.seriesType<Highcharts.AbandsIndicator>(
    'abands',
    'sma',
    /**
     * Acceleration bands (ABANDS). This series requires the `linkedTo` option
     * to be set and should be loaded after the
     * `stock/indicators/indicators.js`.
     *
     * @sample {highstock} stock/indicators/acceleration-bands
     *         Acceleration Bands
     *
     * @extends      plotOptions.sma
     * @mixes        Highcharts.MultipleLinesMixin
     * @since        7.0.0
     * @product      highstock
     * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
     *               navigatorOptions, pointInterval, pointIntervalUnit,
     *               pointPlacement, pointRange, pointStart, showInNavigator,
     *               stacking,
     * @optionparent plotOptions.abands
     */
    {
        params: {
            period: 20,
            /**
             * The algorithms factor value used to calculate bands.
             *
             * @product highstock
             */
            factor: 0.001,
            index: 3
        },
        lineWidth: 1,
        topLine: {
            styles: {
                /**
                 * Pixel width of the line.
                 */
                lineWidth: 1
            }
        },
        bottomLine: {
            styles: {
                /**
                 * Pixel width of the line.
                 */
                lineWidth: 1
            }
        },
        dataGrouping: {
            approximation: 'averages'
        }
    },
    /**
     * @lends Highcharts.Series#
     */
    merge(multipleLinesMixin, {
        pointArrayMap: ['top', 'middle', 'bottom'],
        pointValKey: 'middle',
        nameBase: 'Acceleration Bands',
        nameComponents: ['period', 'factor'],
        linesApiNames: ['topLine', 'bottomLine'],
        getValues: function (
            this: Highcharts.AbandsIndicator,
            series: Highcharts.Series,
            params: Highcharts.AbandsIndicatorParamsOptions
        ): (boolean|Highcharts.IndicatorValuesObject) {
            var period: number = (params.period as any),
                factor: number = (params.factor as any),
                index: number = (params.index as any),
                xVal: Array<number> = (series.xData as any),
                yVal: Array<number|null|undefined> = (series.yData as any),
                yValLen: number = yVal ? yVal.length : 0,
                // Upperbands
                UB: Array<number> = [],
                // Lowerbands
                LB: Array<number> = [],
                // ABANDS array structure:
                // 0-date, 1-top line, 2-middle line, 3-bottom line
                ABANDS: Array<Array<number>> = [],
                // middle line, top line and bottom line
                ML: (number|undefined),
                TL: (number|undefined),
                BL: (number|undefined),
                date: number,
                bandBase: (number|undefined),
                pointSMA: Highcharts.IndicatorValuesObject,
                ubSMA: Highcharts.IndicatorValuesObject,
                lbSMA: Highcharts.IndicatorValuesObject,
                low = 2,
                high = 1,
                xData: Array<number> = [],
                yData: Array<Array<number>> = [],
                slicedX: (Array<number>|undefined),
                slicedY: (Array<number|null|undefined>|undefined),
                i: (number|undefined);

            if (yValLen < period) {
                return false;
            }

            for (i = 0; i <= yValLen; i++) {
                // Get UB and LB values of every point. This condition
                // is necessary, because there is a need to calculate current
                // UB nad LB values simultaneously with given period SMA
                // in one for loop.
                if (i < yValLen) {
                    bandBase = getBaseForBand(
                        (yVal[i] as any)[low],
                        (yVal[i] as any)[high],
                        factor
                    );
                    UB.push(getPointUB((yVal[i] as any)[high], bandBase));
                    LB.push(getPointLB((yVal[i] as any)[low], bandBase));
                }
                if (i >= period) {
                    slicedX = xVal.slice(i - period, i);
                    slicedY = yVal.slice(i - period, i);
                    ubSMA = (SMA.prototype.getValues.call(this, ({
                        xData: slicedX,
                        yData: UB.slice(i - period, i)
                    } as any), {
                        period: period
                    }) as any);
                    lbSMA = (SMA.prototype.getValues.call(this, ({
                        xData: slicedX,
                        yData: LB.slice(i - period, i)
                    } as any), {
                        period: period
                    }) as any);
                    pointSMA = (SMA.prototype.getValues.call(this, ({
                        xData: slicedX,
                        yData: slicedY
                    } as any), {
                        period: period,
                        index: index
                    }) as any);
                    date = pointSMA.xData[0];
                    TL = ubSMA.yData[0];
                    BL = lbSMA.yData[0];
                    ML = pointSMA.yData[0];
                    ABANDS.push([date, TL, ML, BL]);
                    xData.push(date);
                    yData.push([TL, ML, BL]);
                }
            }

            return {
                values: (ABANDS as any),
                xData: xData,
                yData: (yData as any)
            };
        }
    })
);

/**
 * An Acceleration bands indicator. If the [type](#series.abands.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends      series,plotOptions.abands
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, compare, compareBase, dataParser, dataURL,
 *               joinBy, keys, navigatorOptions, pointInterval,
 *               pointIntervalUnit, pointPlacement, pointRange, pointStart,
 *               stacking, showInNavigator,
 * @apioption series.abands
 */

''; // to include the above in jsdoc
