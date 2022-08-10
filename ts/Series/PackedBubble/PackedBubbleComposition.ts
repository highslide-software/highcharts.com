/* *
 *
 *  (c) 2010-2021 Grzegorz Blachlinski, Sebastian Bochan
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

import type PackedBubbleLayout from './PackedBubbleLayout';
import type PackedBubblePoint from './PackedBubblePoint';

import H from '../../Core/Globals.js';
import VerletIntegration from '../Networkgraph/VerletIntegration.js';

/* *
 *
 *  Declarations
 *
 * */


/* *
 *
 *  Composition
 *
 * */


const PBC = {
    packedbubble: {
        repulsiveForceFunction: function (
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
        },
        barycenter: function (this: PackedBubbleLayout): void {
            let layout = this,
                gravitationalConstant = layout.options.gravitationalConstant,
                box = layout.box,
                nodes = layout.nodes,
                centerX,
                centerY;

            nodes.forEach(function (node): void {
                if (layout.options.splitSeries && !node.isParentNode) {
                    centerX = (node.series.parentNode as any).plotX;
                    centerY = (node.series.parentNode as any).plotY;
                } else {
                    centerX = box.width / 2;
                    centerY = box.height / 2;
                }
                if (!node.fixedPosition) {
                    (node.plotX as any) -=
                        ((node.plotX as any) - (centerX as any)) *
                        (gravitationalConstant as any) /
                        (node.mass * Math.sqrt(nodes.length));

                    (node.plotY as any) -=
                        ((node.plotY as any) - (centerY as any)) *
                        (gravitationalConstant as any) /
                        (node.mass * Math.sqrt(nodes.length));
                }
            });
        },

        repulsive: function (
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
        },
        integrate: VerletIntegration.integrate,
        getK: H.noop
    }
};

export default PBC;
