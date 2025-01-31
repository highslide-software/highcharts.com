/* *
 *
 *  (c) 2010-2024 Grzegorz Blachlinski, Sebastian Bochan
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

import type { GraphIntegrationObject } from '../GraphLayoutComposition';
import type PackedBubbleLayout from './PackedBubbleLayout';
import type PackedBubblePoint from './PackedBubblePoint';

import H from '../../Core/Globals.js';
const { noop } = H;
import VerletIntegration from '../Networkgraph/VerletIntegration.js';

/* *
 *
 *  Functions
 *
 * */

/**
 * @private
 */
function barycenter(this: PackedBubbleLayout): void {
    const layout = this,
        gravitationalConstant = layout.options.gravitationalConstant || 0,
        box = layout.box,
        nodes = layout.nodes as Array<PackedBubblePoint>,
        nodeCountSqrt = Math.sqrt(nodes.length);

    let centerX: number,
        centerY: number;

    for (const node of nodes) {

        if (!node.fixedPosition) {
            const massTimesNodeCountSqrt = node.mass * nodeCountSqrt,
                plotX = node.plotX || 0,
                plotY = node.plotY || 0,
                series = node.series,
                parentNode = series.parentNode;

            if (
                layout.options.splitSeries &&
                parentNode &&
                !node.isParentNode
            ) {
                centerX = parentNode.plotX || 0;
                centerY = parentNode.plotY || 0;
            } else {
                centerX = box.width / 2;
                centerY = box.height / 2;
            }

            node.plotX = plotX - (
                (plotX - centerX) *
                gravitationalConstant /
                massTimesNodeCountSqrt
            );

            node.plotY = plotY - (
                (plotY - centerY) *
                gravitationalConstant /
                massTimesNodeCountSqrt
            );

            if (
                series.chart.hoverPoint === node &&

                // If redrawHalo exists we know its a draggable series and any
                // halo present should be redrawn to update its visual position
                series.redrawHalo && series.halo
            ) {
                series.redrawHalo(node);
            }
        }
    }
}

/**
 * @private
 */
function repulsive(
    this: PackedBubbleLayout,
    node: PackedBubblePoint,
    force: number,
    distanceXY: Record<string, number>,
    repNode: PackedBubblePoint
): void {
    const factor = (
            force * (this.diffTemperature as any) / (node.mass as any) /
            (node.degree as any)
        ),
        x = distanceXY.x * factor,
        y = distanceXY.y * factor;

    if (!node.fixedPosition) {
        (node.plotX as any) += x;
        (node.plotY as any) += y;
    }
    if (!repNode.fixedPosition) {
        (repNode.plotX as any) -= x;
        (repNode.plotY as any) -= y;
    }
}

/**
 * @private
 */
function repulsiveForceFunction(
    d: number,
    k: number,
    node: PackedBubblePoint,
    repNode: PackedBubblePoint
): number {
    return Math.min(
        d,
        ((node.marker as any).radius +
        (repNode.marker as any).radius) / 2
    );
}

/* *
 *
 *  Default Export
 *
 * */

const PackedBubbleIntegration: GraphIntegrationObject = {
    barycenter,
    getK: noop,
    integrate: VerletIntegration.integrate,
    repulsive,
    repulsiveForceFunction
};

export default PackedBubbleIntegration;
