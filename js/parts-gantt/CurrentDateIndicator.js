/* *
 *
 *  (c) 2016-2019 Highsoft AS
 *
 *  Author: Lars A. V. Cabrera
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../parts/Globals.js';

var addEvent = H.addEvent,
    Axis = H.Axis,
    PlotLineOrBand = H.PlotLineOrBand,
    merge = H.merge,
    wrap = H.wrap;

var defaultConfig = {
    /**
     * Show an indicator on the axis for the current date and time. Can be a
     * boolean or a configuration object similar to
     * [xAxis.plotLines](#xAxis.plotLines).
     *
     * @sample gantt/current-date-indicator/demo
     *         Current date indicator enabled
     * @sample gantt/current-date-indicator/object-config
     *         Current date indicator with custom options
     *
     * @type      {boolean|*}
     * @default   true
     * @extends   xAxis.plotLines
     * @excluding value
     * @product   gantt
     * @apioption xAxis.currentDateIndicator
     */
    currentDateIndicator: true,
    color: '${palette.highlightColor20}',
    width: 2,
    label: {
        /**
         * Format of the label. This options is passed as the fist argument to
         * [dateFormat](/class-reference/Highcharts#dateFormat) function.
         *
         * @type      {string}
         * @default   '%a, %b %d %Y, %H:%M'
         * @product   gantt
         * @apioption xAxis.currentDateIndicator.label.format
         */
        format: '%a, %b %d %Y, %H:%M',
        formatter: function (value, format) {
            return H.dateFormat(format, value);
        },
        rotation: 0,
        style: {
            fontSize: '10px'
        }
    }
};

addEvent(Axis, 'afterSetOptions', function () {
    var options = this.options,
        cdiOptions = options.currentDateIndicator;

    if (cdiOptions) {
        cdiOptions = typeof cdiOptions === 'object' ?
            merge(defaultConfig, cdiOptions) : merge(defaultConfig);

        cdiOptions.value = new Date();

        if (!options.plotLines) {
            options.plotLines = [];
        }

        options.plotLines.push(cdiOptions);
    }

});

addEvent(PlotLineOrBand, 'render', function () {
    // If the label already exists, update its text
    if (this.label) {
        this.label.attr({
            text: this.getLabelText(this.options.label)
        });
    }
});

wrap(PlotLineOrBand.prototype, 'getLabelText', function (defaultMethod,
    defaultLabelOptions) {
    var options = this.options;

    if (options.currentDateIndicator && options.label &&
        typeof options.label.formatter === 'function') {

        options.value = new Date();
        return options.label.formatter
            .call(this, options.value, options.label.format);
    }
    return defaultMethod.call(this, defaultLabelOptions);
});
