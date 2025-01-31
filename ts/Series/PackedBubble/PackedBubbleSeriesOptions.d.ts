/* *
 *
 *  (c) 2010-2024 Grzegorz Blachlinski, Sebastian Bochan
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type {
    BubbleSeriesOptions,
    BubbleSizeByValue
} from '../Bubble/BubbleSeriesOptions';
import type NetworkgraphSeriesOptions from '../Networkgraph/NetworkgraphSeriesOptions';
import type PackedBubbleDataLabelOptions from './PackedBubbleDataLabelOptions';
import type PackedBubbleLayout from './PackedBubbleLayout';
import type PackedBubblePointOptions from './PackedBubblePointOptions';
import type PackedBubbleSeries from './PackedBubbleSeries';
import type {
    SeriesEventsOptions,
    SeriesStatesOptions
} from '../../Core/Series/SeriesOptions';
import type {
    PointMarkerOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions';
import type TooltipOptions from '../../Core/TooltipOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * @optionparent series.packedbubble.parentNode
 */
export interface PackedBubbleParentNodeOptions {

    /**
     * Allow this series' parent nodes to be selected
     * by clicking on the graph.
     *
     * @since 8.1.1
     *
     * @apioption series.packedbubble.parentNode.allowPointSelect
     */
    allowPointSelect?: boolean;

}

/**
 * A packed bubble series is a two dimensional series type, where each point
 * renders a value in X, Y position. Each point is drawn as a bubble
 * where the bubbles don't overlap with each other and the radius
 * of the bubble relates to the value.
 *
 * A `packedbubble` series. If the [type](#series.packedbubble.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample highcharts/demo/packed-bubble/
 *         Packed bubble chart
 *
 * @sample highcharts/demo/packed-bubble-split/
 *         Split packed bubble chart
 *
 * @extends plotOptions.bubble
 *
 * @extends series,plotOptions.packedbubble
 *
 * @excluding connectEnds, connectNulls, cropThreshold, dragDrop, jitter,
 *            keys, pointPlacement, sizeByAbsoluteValue, step, xAxis,
 *            yAxis, zMax, zMin, dataSorting, boostThreshold,
 *            boostBlending
 *
 * @excluding cropThreshold, dataParser, dataSorting, dataURL, dragDrop, stack,
 *            boostThreshold, boostBlending
 *
 * @product highcharts
 *
 * @since 7.0.0
 *
 * @requires highcharts-more
 */
export interface PackedBubbleSeriesOptions
    extends BubbleSeriesOptions, NetworkgraphSeriesOptions {

    crisp?: boolean;

    /**
     * An array of data points for the series. For the `packedbubble` series
     *  type,
     * points can be given in the following ways:
     *
     * 1.  An array of `values`.
     *
     *  ```js
     *     data: [5, 1, 20]
     *  ```
     *
     * 2.  An array of objects with named values. The objects are point
     * configuration objects as seen below. If the total number of data points
     * exceeds the series' [turboThreshold](#series.packedbubble.turboThreshold),
     * this option is not available.
     *
     *  ```js
     *     data: [{
     *         value: 1,
     *         name: "Point2",
     *         color: "#00FF00"
     *     }, {
     *         value: 5,
     *         name: "Point1",
     *         color: "#FF00FF"
     *     }]
     *  ```
     *
     * @type {Array<Object|Array>}
     *
     * @extends series.line.data
     *
     * @excluding marker, x, y
     *
     * @sample {highcharts} highcharts/series/data-array-of-objects/
     *         Config objects
     *
     * @product highcharts
     */
    data?: Array<(PackedBubblePointOptions|PointShortOptions)>;

    /**
     * @declare Highcharts.SeriesPackedBubbleDataLabelsOptionsObject
     */
    dataLabels?: PackedBubbleDataLabelOptions;

    /**
     * Flag to determine if nodes are draggable or not. Available for
     * graph with useSimulation set to true only.
     *
     * @since 7.1.0
     */
    draggable?: boolean;

    events?: SeriesEventsOptions;

    /**
     * Options for layout algorithm when simulation is enabled. Inside there
     * are options to change the speed, padding, initial bubbles positions
     * and more.
     *
     * @extends plotOptions.networkgraph.layoutAlgorithm
     *
     * @excluding approximation, attractiveForce, repulsiveForce, theta
     *
     * @since 7.1.0
     */
    layoutAlgorithm?: PackedBubbleLayout.Options;

    /**
     * @excluding enabled,enabledThreshold,height,radius,width
     *
     * @product highcharts
     */
    marker?: PointMarkerOptions;

    /**
     * Maximum bubble size. Bubbles will automatically size between the
     * `minSize` and `maxSize` to reflect the value of each bubble.
     * Can be either pixels (when no unit is given), or a percentage of
     * the smallest one of the plot width and height, divided by the square
     * root of total number of points.
     *
     * @sample highcharts/plotoptions/bubble-size/
     *         Bubble size
     */
    maxSize?: (number|string);

    /**
     * Minimum bubble size. Bubbles will automatically size between the
     * `minSize` and `maxSize` to reflect the value of each bubble.
     * Can be either pixels (when no unit is given), or a percentage of
     * the smallest one of the plot width and height, divided by the square
     * root of total number of points.
     *
     * @sample highcharts/plotoptions/bubble-size/
     *         Bubble size
     */
    minSize?: (number|string);

    /**
     * Series options for parent nodes.
     *
     * @since 8.1.1
     */
    parentNode?: PackedBubbleParentNodeOptions;

    sizeBy?: BubbleSizeByValue;

    states?: SeriesStatesOptions<PackedBubbleSeries>;
    stickyTracking: false;
    tooltip?: Partial<TooltipOptions>;

    /**
     * An option is giving a possibility to choose between using simulation
     * for calculating bubble positions. These reflects in both animation
     * and final position of bubbles. Simulation is also adding options to
     * the series graph based on used layout. In case of big data sets, with
     * any performance issues, it is possible to disable animation and pack
     * bubble in a simple circular way.
     *
     * @sample highcharts/series-packedbubble/spiral/
     *         useSimulation set to false
     *
     * @since 7.1.0
     */
    useSimulation?: boolean;

    zoneAxis?: ('x'|'y'|'z'|undefined);

}

/* *
 *
 *  Default Export
 *
 * */

export default PackedBubbleSeriesOptions;
