/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import Axis from './Axis.js';
import U from './Utilities.js';
const {
    addEvent,
    getMagnitude,
    normalizeTickInterval,
    pick
} = U;

/* eslint-disable valid-jsdoc */

class LogarithmicAxisAdditions {

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(axis: LogarithmicAxis) {
        this.axis = axis;
    }

    /* *
     *
     *  Properties
     *
     * */

    axis: LogarithmicAxis;
    minorAutoInterval?: number;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Set the tick positions of a logarithmic axis.
     *
     * @private
     */
    public getTickPositions(
        interval: number,
        min: number,
        max: number,
        minor?: boolean
    ): Array<number> {
        const logarithmic = this;
        const axis = logarithmic.axis;
        const options = axis.options;
        const axisLength = axis.len;

        // Since we use this method for both major and minor ticks,
        // use a local variable and return the result
        let positions = [];

        // Reset
        if (!minor) {
            logarithmic.minorAutoInterval = void 0;
        }

        // First case: All ticks fall on whole logarithms: 1, 10, 100 etc.
        if (interval >= 0.5) {
            interval = Math.round(interval);
            positions = axis.getLinearTickPositions(interval, min, max);

        // Second case: We need intermediary ticks. For example
        // 1, 2, 4, 6, 8, 10, 20, 40 etc.
        } else if (interval >= 0.08) {
            var roundedMin = Math.floor(min),
                intermediate,
                i,
                j,
                len,
                pos,
                lastPos,
                break2;

            if (interval > 0.3) {
                intermediate = [1, 2, 4];

            // 0.2 equals five minor ticks per 1, 10, 100 etc
            } else if (interval > 0.15) {
                intermediate = [1, 2, 4, 6, 8];
            } else { // 0.1 equals ten minor ticks per 1, 10, 100 etc
                intermediate = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            }

            for (i = roundedMin; i < max + 1 && !break2; i++) {
                len = intermediate.length;
                for (j = 0; j < len && !break2; j++) {
                    pos = logarithmic.log2lin(logarithmic.lin2log(i) * intermediate[j]);
                    // #1670, lastPos is #3113
                    if (
                        pos > min &&
                        (!minor || (lastPos as any) <= max) &&
                        typeof lastPos !== 'undefined'
                    ) {
                        positions.push(lastPos);
                    }

                    if ((lastPos as any) > max) {
                        break2 = true;
                    }
                    lastPos = pos;
                }
            }

        // Third case: We are so deep in between whole logarithmic values that
        // we might as well handle the tick positions like a linear axis. For
        // example 1.01, 1.02, 1.03, 1.04.
        } else {
            var realMin = logarithmic.lin2log(min),
                realMax = logarithmic.lin2log(max),
                tickIntervalOption = minor ?
                    axis.getMinorTickInterval() :
                    options.tickInterval,
                filteredTickIntervalOption = tickIntervalOption === 'auto' ?
                    null :
                    tickIntervalOption,
                tickPixelIntervalOption =
                    (options.tickPixelInterval as any) / (minor ? 5 : 1),
                totalPixelLength = minor ?
                    axisLength / axis.tickPositions.length :
                    axisLength;

            interval = pick(
                filteredTickIntervalOption,
                logarithmic.minorAutoInterval,
                (realMax - realMin) *
                    tickPixelIntervalOption / (totalPixelLength || 1)
            );

            interval = normalizeTickInterval(
                interval,
                null as any,
                getMagnitude(interval)
            );

            positions = axis.getLinearTickPositions(
                interval,
                realMin,
                realMax
            ).map(logarithmic.log2lin);

            if (!minor) {
                logarithmic.minorAutoInterval = interval / 5;
            }
        }

        // Set the axis-level tickInterval variable
        if (!minor) {
            axis.tickInterval = interval;
        }
        return positions;
    }

    public lin2log(num: number): number {
        return Math.pow(10, num);
    }

    public log2lin(num: number): number {
        return Math.log(num) / Math.LN10;
    }

}

class LogarithmicAxis {

    /* *
     *
     *  Static Functions
     *
     * */

    public static compose(AxisClass: typeof Axis): void {

        /* eslint-disable no-invalid-this */

        addEvent(AxisClass, 'init', function (): void {
            const axis = this as LogarithmicAxis;

            // extend logarithmic axis
            axis.logarithmic = new LogarithmicAxisAdditions(axis);
        });

        addEvent(AxisClass, 'afterInit', function (): void {
            const axis = this as LogarithmicAxis;
            const logarithmic = axis.logarithmic;

            const lin2log = function (this: LogarithmicAxis): number {
                const linearToLogConverter = axis.options.linearToLogConverter;

                if (typeof linearToLogConverter === 'function') {
                    return linearToLogConverter.apply(axis, arguments);
                }

                return logarithmic.lin2log.apply(logarithmic, arguments);
            };
            const log2lin = function (this: LogarithmicAxis): number {
                const logToLinearConverter = axis.options.logToLinearConverter;

                if (typeof logToLinearConverter === 'function') {
                    return logToLinearConverter.apply(axis, arguments);
                }

                return logarithmic.log2lin.apply(logarithmic, arguments);
            };

            if (axis.isLog) {
                axis.val2lin = log2lin;
                axis.lin2val = lin2log;
            }
        }, { order: 0 });

        /* eslint-enable no-invalid-this */

    }

}

interface LogarithmicAxis extends Axis {
    logarithmic: LogarithmicAxisAdditions;
    options: Axis['options'] & LogarithmicAxisOptions;
}

interface LogarithmicAxisOptions {
    linearToLogConverter?: LogarithmicAxisAdditions['lin2log'];
    logToLinearConverter?: LogarithmicAxisAdditions['log2lin'];
}

LogarithmicAxis.compose(Axis); // @todo move to factory

export default LogarithmicAxis;
