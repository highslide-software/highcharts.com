/* *
 *
 *  (c) 2010-2023 Highsoft AS
 *  Authors:
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type GeoHeatmapSeriesOptions from './GeoHeatmapSeriesOptions';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
// import GeoHeatmapPoint from './GeoHeatmapPoint.js';
import HeatmapSeries from '../Heatmap/HeatmapSeries.js';
import U from '../../Core/Utilities.js';
import '../Heatmap/HeatmapSeries.js';

// const {
//     seriesTypes: {
//         heatmap: HeatmapSeries
//     }
// } = SeriesRegistry;

const {
    extend,
    merge
} = U;

/* *
 *
 *  Declarations
 *
 * */


/* *
 *
 *  Class
 *
 * */

/**
 * The Geo Heatmap series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.geoheatmap
 *
 * @augments Highcharts.Series
 */

class GeoHeatmapSeries extends HeatmapSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions: GeoHeatmapSeriesOptions =
        HeatmapSeries.defaultOptions;

    /* *
     *
     *  Properties
     *
     * */

    public options: GeoHeatmapSeriesOptions = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */


}

/* *
 *
 *  Class Prototype
 *
 * */

interface GeoHeatmapSeries {
//    pointClass: typeof GeoHeatmapPoint;
}

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        geoheatmap: typeof GeoHeatmapSeries;
    }
}
SeriesRegistry.registerSeriesType('geoheatmap', GeoHeatmapSeries);

/* *
 *
 *  Default Export
 *
 * */

export default GeoHeatmapSeries;

/* *
 *
 *  API Declarations
 *
 * */

/* *
 *
 *  API Options
 *
 * */

''; // adds doclets above to transpiled file
