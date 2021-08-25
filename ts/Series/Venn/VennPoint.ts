/* *
 *
 *  Experimental Highcharts module which enables visualization of a Venn
 *  diagram.
 *
 *  (c) 2016-2021 Highsoft AS
 *  Authors: Jon Arild Nygard
 *
 *  Layout algorithm by Ben Frederickson:
 *  https://www.benfrederickson.com/better-venn-diagrams/
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

import type VennPointOptions from './VennPointOptions';
import type VennSeries from './VennSeries';
import DrawPointComposition from '../DrawPointComposition.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        scatter: ScatterSeries
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    extend,
    isNumber
} = U;

/* *
 *
 *  Class
 *
 * */

class VennPoint extends ScatterSeries.prototype.pointClass implements Highcharts.DrawPoint {

    /* *
     *
     *  Properties
     *
     * */

    public options: VennPointOptions = void 0 as any;

    public series: VennSeries = void 0 as any;

    public sets?: Array<string>;

    public value?: number;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    public isValid(): boolean {
        return isNumber(this.value);
    }

    public shouldDraw(): boolean {
        const point = this;

        // Only draw points with single sets.
        return !!point.shapeArgs;
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Prototype Properties
 *
 * */

interface VennPoint {
    draw: typeof DrawPointComposition.drawPoint;
}
extend(VennPoint.prototype, {
    draw: DrawPointComposition.drawPoint
});

/* *
 *
 *  Default Export
 *
 * */

export default VennPoint;
