/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  Extenstion for 3d axes
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

import type Axis from './Axis';
import type AxisOptions from './AxisOptions';
import type { OptionsPosition3dValue } from '../Options';
import type Point from '../Series/Point';
import type Position3DObject from '../Renderer/Position3DObject';
import type SVGPath from '../Renderer/SVG/SVGPath';
import type VMLAxis3D from '../../Extensions/Oldie/VMLAxis3D';

import H from '../Globals.js';
const { deg2rad } = H;
import Math3D from '../../Extensions/Math3D.js';
const { perspective, perspective3D, shapeArea } = Math3D;
import Tick from './Tick.js';
import Tick3D from './Tick3D.js';
import U from '../Utilities.js';
const { addEvent, merge, pick, wrap } = U;

/* *
 *
 *  Declarations
 *
 * */

declare module './AxisComposition' {
    interface AxisComposition {
        axis3D?: Axis3D['axis3D'];
    }
}

declare module './AxisOptions' {
    interface AxisLabelOptions {
        position3d?: OptionsPosition3dValue;
        skew3d?: boolean;
    }
    interface AxisTitleOptions {
        position3d?: 'chart' | 'flap' | 'offset' | 'ortho' | null;
        skew3d?: boolean | null;
    }
}

declare module './AxisType' {
    interface AxisTypeRegistry {
        Axis3D: Axis3D;
    }
}

declare module '../Renderer/Position3DObject' {
    interface Position3DObject {
        matrix?: Array<number>;
    }
}

declare module '../Series/PointLike' {
    interface PointLike {
        crosshairPos?: number;
        axisXpos?: number;
        axisYpos?: number;
        axisZpos?: number;
    }
}

/* *
 *
 *  Classes
 *
 * */

/* eslint-disable valid-jsdoc */

/**
 * Adds 3D support to axes.
 * @private
 * @class
 */
class Axis3DAdditions {
    /* *
     *
     *  Constructors
     *
     * */

    /**
     * @private
     */
    public constructor(axis: Axis3D) {
        this.axis = axis;
    }

    /* *
     *
     *  Properties
     *
     * */

    public axis: Axis3D;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * @private
     * @param {Highcharts.Axis} axis
     * Related axis.
     * @param {Highcharts.Position3DObject} pos
     * Position to fix.
     * @param {boolean} [isTitle]
     * Whether this is a title position.
     * @return {Highcharts.Position3DObject}
     * Fixed position.
     */
    public fix3dPosition(
        pos: Position3DObject,
        isTitle?: boolean
    ): Position3DObject {
        const axis3D = this;
        const axis = axis3D.axis;
        const chart = axis.chart;

        // Do not do this if the chart is not 3D
        if (axis.coll === 'colorAxis' || !chart.chart3d || !chart.is3d()) {
            return pos;
        }

        const alpha = deg2rad * (chart.options.chart.options3d as any).alpha,
            beta = deg2rad * (chart.options.chart.options3d as any).beta,
            positionMode = pick(
                isTitle && (axis.options.title as any).position3d,
                axis.options.labels.position3d
            ),
            skew = pick(
                isTitle && (axis.options.title as any).skew3d,
                axis.options.labels.skew3d
            ),
            frame = chart.chart3d.frame3d,
            plotLeft = chart.plotLeft,
            plotRight = chart.plotWidth + plotLeft,
            plotTop = chart.plotTop,
            plotBottom = chart.plotHeight + plotTop;

        let offsetX = 0,
            offsetY = 0,
            vecX: Position3DObject,
            vecY = { x: 0, y: 1, z: 0 },
            // Indicates that we are labelling an X or Z axis on the "back" of
            // the chart
            reverseFlap = false;

        pos = axis.axis3D.swapZ({ x: pos.x, y: pos.y, z: 0 });

        if (axis.isZAxis) {
            // Z Axis
            if (axis.opposite) {
                if (frame.axes.z.top === null) {
                    return {} as any;
                }
                offsetY = pos.y - plotTop;
                pos.x = frame.axes.z.top.x;
                pos.y = frame.axes.z.top.y;
                vecX = frame.axes.z.top.xDir;
                reverseFlap = !frame.top.frontFacing;
            } else {
                if (frame.axes.z.bottom === null) {
                    return {} as any;
                }
                offsetY = pos.y - plotBottom;
                pos.x = frame.axes.z.bottom.x;
                pos.y = frame.axes.z.bottom.y;
                vecX = frame.axes.z.bottom.xDir;
                reverseFlap = !frame.bottom.frontFacing;
            }
        } else if (axis.horiz) {
            // X Axis
            if (axis.opposite) {
                if (frame.axes.x.top === null) {
                    return {} as any;
                }
                offsetY = pos.y - plotTop;
                pos.y = frame.axes.x.top.y;
                pos.z = frame.axes.x.top.z;
                vecX = frame.axes.x.top.xDir;
                reverseFlap = !frame.top.frontFacing;
            } else {
                if (frame.axes.x.bottom === null) {
                    return {} as any;
                }
                offsetY = pos.y - plotBottom;
                pos.y = frame.axes.x.bottom.y;
                pos.z = frame.axes.x.bottom.z;
                vecX = frame.axes.x.bottom.xDir;
                reverseFlap = !frame.bottom.frontFacing;
            }
        } else {
            // Y Axis
            if (axis.opposite) {
                if (frame.axes.y.right === null) {
                    return {} as any;
                }
                offsetX = pos.x - plotRight;
                pos.x = frame.axes.y.right.x;
                pos.z = frame.axes.y.right.z;
                vecX = frame.axes.y.right.xDir;
                // Rotate 90º on opposite edge
                vecX = { x: vecX.z, y: vecX.y, z: -vecX.x };
            } else {
                if (frame.axes.y.left === null) {
                    return {} as any;
                }
                offsetX = pos.x - plotLeft;
                pos.x = frame.axes.y.left.x;
                pos.z = frame.axes.y.left.z;
                vecX = frame.axes.y.left.xDir;
            }
        }

        if (positionMode === 'chart') {
            // Labels preserve their direction relative to the chart
            // nothing to do
        } else if (positionMode === 'flap') {
            // Labels are rotated around the axis direction to face the screen
            if (!axis.horiz) {
                // Y Axis
                vecX = { x: Math.cos(beta), y: 0, z: Math.sin(beta) };
            } else {
                // X and Z Axis
                let sin = Math.sin(alpha);
                const cos = Math.cos(alpha);

                if (axis.opposite) {
                    sin = -sin;
                }
                if (reverseFlap) {
                    sin = -sin;
                }
                vecY = { x: vecX.z * sin, y: cos, z: -vecX.x * sin };
            }
        } else if (positionMode === 'ortho') {
            // Labels will be rotated to be ortogonal to the axis
            if (!axis.horiz) {
                // Y Axis
                vecX = { x: Math.cos(beta), y: 0, z: Math.sin(beta) };
            } else {
                // X and Z Axis
                const sina = Math.sin(alpha);
                const cosa = Math.cos(alpha);
                const sinb = Math.sin(beta);
                const cosb = Math.cos(beta);
                const vecZ = { x: sinb * cosa, y: -sina, z: -cosa * cosb };

                vecY = {
                    x: vecX.y * vecZ.z - vecX.z * vecZ.y,
                    y: vecX.z * vecZ.x - vecX.x * vecZ.z,
                    z: vecX.x * vecZ.y - vecX.y * vecZ.x
                };
                let scale =
                    1 /
                    Math.sqrt(
                        vecY.x * vecY.x + vecY.y * vecY.y + vecY.z * vecY.z
                    );

                if (reverseFlap) {
                    scale = -scale;
                }
                vecY = {
                    x: scale * vecY.x,
                    y: scale * vecY.y,
                    z: scale * vecY.z
                };
            }
        } else {
            // positionMode  == 'offset'
            // Labels will be skewd to maintain vertical / horizontal offsets
            // from axis
            if (!axis.horiz) {
                // Y Axis
                vecX = { x: Math.cos(beta), y: 0, z: Math.sin(beta) };
            } else {
                // X and Z Axis
                vecY = {
                    x: Math.sin(beta) * Math.sin(alpha),
                    y: Math.cos(alpha),
                    z: -Math.cos(beta) * Math.sin(alpha)
                };
            }
        }
        pos.x += offsetX * vecX.x + offsetY * vecY.x;
        pos.y += offsetX * vecX.y + offsetY * vecY.y;
        pos.z += offsetX * vecX.z + offsetY * vecY.z;

        const projected = perspective([pos], axis.chart)[0];

        if (skew) {
            // Check if the label text would be mirrored
            const isMirrored =
                shapeArea(
                    perspective(
                        [
                            pos,
                            {
                                x: pos.x + vecX.x,
                                y: pos.y + vecX.y,
                                z: pos.z + vecX.z
                            },
                            {
                                x: pos.x + vecY.x,
                                y: pos.y + vecY.y,
                                z: pos.z + vecY.z
                            }
                        ],
                        axis.chart
                    )
                ) < 0;

            if (isMirrored) {
                vecX = { x: -vecX.x, y: -vecX.y, z: -vecX.z };
            }

            const pointsProjected = perspective(
                [
                    { x: pos.x, y: pos.y, z: pos.z },
                    { x: pos.x + vecX.x, y: pos.y + vecX.y, z: pos.z + vecX.z },
                    { x: pos.x + vecY.x, y: pos.y + vecY.y, z: pos.z + vecY.z }
                ],
                axis.chart
            );

            projected.matrix = [
                pointsProjected[1].x - pointsProjected[0].x,
                pointsProjected[1].y - pointsProjected[0].y,
                pointsProjected[2].x - pointsProjected[0].x,
                pointsProjected[2].y - pointsProjected[0].y,
                projected.x,
                projected.y
            ];
            projected.matrix[4] -=
                projected.x * projected.matrix[0] +
                projected.y * projected.matrix[2];
            projected.matrix[5] -=
                projected.x * projected.matrix[1] +
                projected.y * projected.matrix[3];
        }

        return projected;
    }

    /**
     * @private
     */
    public swapZ(
        p: Position3DObject,
        insidePlotArea?: boolean
    ): Position3DObject {
        const axis = this.axis;

        if (axis.isZAxis) {
            const plotLeft = insidePlotArea ? 0 : axis.chart.plotLeft;

            return {
                x: plotLeft + p.z,
                y: p.y,
                z: p.x - plotLeft
            };
        }
        return p;
    }
}

/**
 * Axis with 3D support.
 * @private
 * @class
 */
class Axis3D {
    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * @optionparent xAxis
     */
    public static defaultOptions: DeepPartial<AxisOptions> = {
        labels: {
            /**
             * Defines how the labels are be repositioned according to the 3D
             * chart orientation.
             *
             * - `'offset'`: Maintain a fixed horizontal/vertical distance from
             *   the tick marks, despite the chart orientation. This is the
             *   backwards compatible behavior, and causes skewing of X and Z
             *   axes.
             *
             * - `'chart'`: Preserve 3D position relative to the chart. This
             *   looks nice, but hard to read if the text isn't forward-facing.
             *
             * - `'flap'`: Rotated text along the axis to compensate for the
             *   chart orientation. This tries to maintain text as legible as
             *   possible on all orientations.
             *
             * - `'ortho'`: Rotated text along the axis direction so that the
             *   labels are orthogonal to the axis. This is very similar to
             *   `'flap'`, but prevents skewing the labels (X and Y scaling are
             *   still present).
             *
             * @sample highcharts/3d/skewed-labels/
             *         Skewed labels
             *
             * @since      5.0.15
             * @validvalue ['offset', 'chart', 'flap', 'ortho']
             * @product    highcharts
             * @requires   highcharts-3d
             */
            position3d: 'offset',

            /**
             * If enabled, the axis labels will skewed to follow the
             * perspective.
             *
             * This will fix overlapping labels and titles, but texts become
             * less legible due to the distortion.
             *
             * The final appearance depends heavily on `labels.position3d`.
             *
             * @sample highcharts/3d/skewed-labels/
             *         Skewed labels
             *
             * @since    5.0.15
             * @product  highcharts
             * @requires highcharts-3d
             */
            skew3d: false
        },
        title: {
            /**
             * Defines how the title is repositioned according to the 3D chart
             * orientation.
             *
             * - `'offset'`: Maintain a fixed horizontal/vertical distance from
             *   the tick marks, despite the chart orientation. This is the
             *   backwards compatible behavior, and causes skewing of X and Z
             *   axes.
             *
             * - `'chart'`: Preserve 3D position relative to the chart. This
             *   looks nice, but hard to read if the text isn't forward-facing.
             *
             * - `'flap'`: Rotated text along the axis to compensate for the
             *   chart orientation. This tries to maintain text as legible as
             *   possible on all orientations.
             *
             * - `'ortho'`: Rotated text along the axis direction so that the
             *   labels are orthogonal to the axis. This is very similar to
             *   `'flap'`, but prevents skewing the labels (X and Y scaling are
             *   still present).
             *
             * - `undefined`: Will use the config from `labels.position3d`
             *
             * @sample highcharts/3d/skewed-labels/
             *         Skewed labels
             *
             * @type     {"offset"|"chart"|"flap"|"ortho"|null}
             * @since    5.0.15
             * @product  highcharts
             * @requires highcharts-3d
             */
            position3d: null,

            /**
             * If enabled, the axis title will skewed to follow the perspective.
             *
             * This will fix overlapping labels and titles, but texts become
             * less legible due to the distortion.
             *
             * The final appearance depends heavily on `title.position3d`.
             *
             * A `null` value will use the config from `labels.skew3d`.
             *
             * @sample highcharts/3d/skewed-labels/
             *         Skewed labels
             *
             * @type     {boolean|null}
             * @since    5.0.15
             * @product  highcharts
             * @requires highcharts-3d
             */
            skew3d: null
        }
    };

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Extends axis class with 3D support.
     * @private
     */
    public static compose(AxisClass: typeof Axis): void {
        merge(true, AxisClass.defaultOptions, Axis3D.defaultOptions);
        AxisClass.keepProps.push('axis3D');

        addEvent(AxisClass, 'init', Axis3D.onInit);
        addEvent(AxisClass, 'afterSetOptions', Axis3D.onAfterSetOptions);
        addEvent(AxisClass, 'drawCrosshair', Axis3D.onDrawCrosshair);

        const axisProto = AxisClass.prototype as Axis3D;

        wrap(axisProto, 'getLinePath', Axis3D.wrapGetLinePath);
        wrap(axisProto, 'getPlotBandPath', Axis3D.wrapGetPlotBandPath);
        wrap(axisProto, 'getPlotLinePath', Axis3D.wrapGetPlotLinePath);
        wrap(axisProto, 'getSlotWidth', Axis3D.wrapGetSlotWidth);
        wrap(axisProto, 'getTitlePosition', Axis3D.wrapGetTitlePosition);

        Tick3D.compose(Tick);
    }

    /**
     * @private
     */
    public static onAfterSetOptions(this: Axis): void {
        const axis = this;
        const chart = axis.chart;
        const options = axis.options;

        if (chart.is3d && chart.is3d() && axis.coll !== 'colorAxis') {
            options.tickWidth = pick(options.tickWidth, 0);
            options.gridLineWidth = pick(options.gridLineWidth, 1);
        }
    }

    /**
     * @private
     */
    public static onDrawCrosshair(
        this: Axis,
        e: {
            e: PointerEvent;
            point: Point;
        }
    ): void {
        const axis = this;

        if (axis.chart.is3d() && axis.coll !== 'colorAxis') {
            if (e.point) {
                e.point.crosshairPos = axis.isXAxis
                    ? e.point.axisXpos
                    : axis.len - (e.point.axisYpos as any);
            }
        }
    }

    /**
     * @private
     */
    public static onInit(this: Axis): void {
        const axis = this;

        if (!axis.axis3D) {
            axis.axis3D = new Axis3DAdditions(axis as Axis3D);
        }
    }

    /**
     * Do not draw axislines in 3D.
     * @private
     */
    public static wrapGetLinePath(this: Axis3D, proceed: Function): SVGPath {
        const axis = this;

        // Do not do this if the chart is not 3D
        if (!axis.chart.is3d() || axis.coll === 'colorAxis') {
            return proceed.apply(axis, [].slice.call(arguments, 1));
        }

        return [];
    }

    /**
     * @private
     */
    public static wrapGetPlotBandPath(
        this: Axis3D,
        proceed: Function
    ): SVGPath {
        // Do not do this if the chart is not 3D
        if (!this.chart.is3d() || this.coll === 'colorAxis') {
            return proceed.apply(this, [].slice.call(arguments, 1));
        }

        const args = arguments,
            from = args[1],
            to = args[2],
            path: SVGPath = [],
            fromPath = this.getPlotLinePath({ value: from }),
            toPath = this.getPlotLinePath({ value: to });

        if (fromPath && toPath) {
            for (let i = 0; i < fromPath.length; i += 2) {
                const fromStartSeg = fromPath[i],
                    fromEndSeg = fromPath[i + 1],
                    toStartSeg = toPath[i],
                    toEndSeg = toPath[i + 1];
                if (
                    fromStartSeg[0] === 'M' &&
                    fromEndSeg[0] === 'L' &&
                    toStartSeg[0] === 'M' &&
                    toEndSeg[0] === 'L'
                ) {
                    path.push(
                        fromStartSeg,
                        fromEndSeg,
                        toEndSeg,
                        // lineTo instead of moveTo
                        ['L', toStartSeg[1], toStartSeg[2]],
                        ['Z']
                    );
                }
            }
        }

        return path;
    }

    /**
     * @private
     */
    public static wrapGetPlotLinePath(
        this: Axis3D,
        proceed: Function
    ): SVGPath {
        const axis = this,
            axis3D = axis.axis3D,
            chart = axis.chart,
            path: SVGPath = proceed.apply(axis, [].slice.call(arguments, 1));

        // Do not do this if the chart is not 3D
        if (axis.coll === 'colorAxis' || !chart.chart3d || !chart.is3d()) {
            return path;
        }

        if (path === null) {
            return path;
        }

        const options3d = chart.options.chart.options3d as any,
            d = axis.isZAxis ? chart.plotWidth : options3d.depth,
            frame = chart.chart3d.frame3d,
            startSegment = path[0],
            endSegment = path[1];

        let pArr,
            pathSegments: Array<Position3DObject> = [];

        if (startSegment[0] === 'M' && endSegment[0] === 'L') {
            pArr = [
                axis3D.swapZ({ x: startSegment[1], y: startSegment[2], z: 0 }),
                axis3D.swapZ({ x: startSegment[1], y: startSegment[2], z: d }),
                axis3D.swapZ({ x: endSegment[1], y: endSegment[2], z: 0 }),
                axis3D.swapZ({ x: endSegment[1], y: endSegment[2], z: d })
            ];

            if (!this.horiz) {
                // Y-Axis
                if (frame.front.visible) {
                    pathSegments.push(pArr[0], pArr[2]);
                }
                if (frame.back.visible) {
                    pathSegments.push(pArr[1], pArr[3]);
                }
                if (frame.left.visible) {
                    pathSegments.push(pArr[0], pArr[1]);
                }
                if (frame.right.visible) {
                    pathSegments.push(pArr[2], pArr[3]);
                }
            } else if (this.isZAxis) {
                // Z-Axis
                if (frame.left.visible) {
                    pathSegments.push(pArr[0], pArr[2]);
                }
                if (frame.right.visible) {
                    pathSegments.push(pArr[1], pArr[3]);
                }
                if (frame.top.visible) {
                    pathSegments.push(pArr[0], pArr[1]);
                }
                if (frame.bottom.visible) {
                    pathSegments.push(pArr[2], pArr[3]);
                }
            } else {
                // X-Axis
                if (frame.front.visible) {
                    pathSegments.push(pArr[0], pArr[2]);
                }
                if (frame.back.visible) {
                    pathSegments.push(pArr[1], pArr[3]);
                }
                if (frame.top.visible) {
                    pathSegments.push(pArr[0], pArr[1]);
                }
                if (frame.bottom.visible) {
                    pathSegments.push(pArr[2], pArr[3]);
                }
            }

            pathSegments = perspective(pathSegments, this.chart, false);
        }

        return chart.renderer.toLineSegments(pathSegments);
    }

    /**
     * Wrap getSlotWidth function to calculate individual width value for each
     * slot (#8042).
     * @private
     */
    public static wrapGetSlotWidth(
        this: Axis3D,
        proceed: Function,
        tick: Tick
    ): number {
        const axis = this,
            chart = axis.chart,
            ticks = axis.ticks,
            gridGroup = axis.gridGroup;

        if (
            axis.categories &&
            chart.frameShapes &&
            chart.is3d() &&
            gridGroup &&
            tick &&
            tick.label
        ) {
            const firstGridLine = (
                    gridGroup.element.childNodes[0] as any
                ).getBBox(),
                frame3DLeft = chart.frameShapes.left.getBBox(),
                options3d = chart.options.chart.options3d as any,
                origin = {
                    x: chart.plotWidth / 2,
                    y: chart.plotHeight / 2,
                    z: options3d.depth / 2,
                    vd:
                        pick(options3d.depth, 1) *
                        pick(options3d.viewDistance, 0)
                },
                tickId = tick.pos,
                prevTick = ticks[tickId - 1],
                nextTick = ticks[tickId + 1];

            let labelPos, prevLabelPos, nextLabelPos;

            // Check whether the tick is not the first one and previous tick
            // exists, then calculate position of previous label.
            if (
                tickId !== 0 &&
                prevTick &&
                prevTick.label &&
                prevTick.label.xy
            ) {
                prevLabelPos = perspective3D(
                    {
                        // #8621
                        x: prevTick.label.xy.x,
                        y: prevTick.label.xy.y,
                        z: null as any
                    },
                    origin,
                    origin.vd
                );
            }
            // If next label position is defined, then recalculate its position
            // basing on the perspective.
            if (nextTick && nextTick.label && nextTick.label.xy) {
                nextLabelPos = perspective3D(
                    {
                        x: nextTick.label.xy.x,
                        y: nextTick.label.xy.y,
                        z: null as any
                    },
                    origin,
                    origin.vd
                );
            }
            labelPos = {
                x: tick.label.xy.x,
                y: tick.label.xy.y,
                z: null as any
            };

            labelPos = perspective3D(labelPos, origin, origin.vd);

            // If tick is first one, check whether next label position is
            // already calculated, then return difference between the first and
            // the second label. If there is no next label position calculated,
            // return the difference between the first grid line and left 3d
            // frame.
            return Math.abs(
                prevLabelPos
                    ? labelPos.x - prevLabelPos.x
                    : nextLabelPos
                    ? nextLabelPos.x - labelPos.x
                    : firstGridLine.x - frame3DLeft.x
            );
        }
        return proceed.apply(axis, [].slice.call(arguments, 1));
    }

    /**
     * @private
     */
    public static wrapGetTitlePosition(
        this: Axis3D,
        proceed: Function
    ): Position3DObject {
        const pos: Position3DObject = proceed.apply(
            this,
            [].slice.call(arguments, 1)
        );

        return this.axis3D ? this.axis3D.fix3dPosition(pos, true) : pos;
    }
}

/**
 * Axis instance with 3D support.
 * @private
 */
interface Axis3D extends Axis {
    axis3D: Axis3DAdditions;
}

/* *
 *
 *  Default Export
 *
 * */

export default Axis3D;
