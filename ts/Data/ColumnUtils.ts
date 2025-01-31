/* *
 *
 *  (c) 2020-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */


/* *
*
*  Imports
*
* */

import type DataTable from './DataTable';


/**
 * Utility functions for columns that can be either arrays or typed arrays.
 * @private
 */
namespace ColumnUtils {

    /* *
    *
    *  Declarations
    *
    * */

    /**
     * A typed array.
     */
    export type TypedArray = (
        Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|
        Int32Array|Uint32Array|Float32Array|Float64Array
    );

    /**
     * Result of the `shift` function.
     */
    export interface ShiftResult {
        value: DataTable.CellType
        array: DataTable.Column
    }

    /**
     * Result of the `splice` function.
     */
    export interface SpliceResult<T extends DataTable.Column> {
        removed: T
        array: T
    }

    /**
     * Constructor of a typed array.
     */
    export interface TypedArrayConstructor {
        new (length: number): TypedArray;
    }


    /* *
    *
    * Functions
    *
    * */

    /**
     * Sets the length of the column array.
     *
     * @param {DataTable.Column} column
     * Column to be modified.
     *
     * @param {number} length
     * New length of the column.
     *
     * @param {boolean} asSubarray
     * If column is a typed array, return a subarray instead of a new array. It
     * is faster `O(1)`, but the entire buffer will be kept in memory until all
     * views to it are destroyed. Default is `false`.
     *
     * @return {DataTable.Column}
     * Modified column.
     *
     * @private
     */
    export function setLength(
        column: DataTable.Column,
        length: number,
        asSubarray: boolean = false
    ): DataTable.Column {
        if (Array.isArray(column)) {
            column.length = length;
            return column;
        }

        return column[asSubarray ? 'subarray' : 'slice'](0, length);
    }

    /**
     * Shifts first element of a column array and returns it and the rest of the
     * array.
     *
     * If the column is a typed array, it will be not modified, but a subarray
     * will be returned.
     *
     * @param {Highcharts.DataTableColumn} column
     * Column to be shifted.
     *
     * @param {boolean} asSubarray
     * If column is a typed array, return a subarray instead of a new array. It
     * is faster `O(1)`, but the entire buffer will be kept in memory until all
     * views to it are destroyed. Default is `false`.
     *
     * @return {ShiftResult}
     * Object containing shifted value and the rest of the column.
     *
     * @private
     */
    export function shift(
        column: DataTable.Column,
        asSubarray: boolean = false
    ): ShiftResult {
        if (Array.isArray(column)) {
            return {
                value: column.shift(),
                array: column
            };
        }

        return {
            value: column[0],
            array: column[asSubarray ? 'subarray' : 'slice'](1)
        };
    }

    /**
     * Splices a column array.
     *
     * @param {DataTable.Column} column
     * Column to be modified.
     *
     * @param {number} start
     * Index at which to start changing the array.
     *
     * @param {number} deleteCount
     * An integer indicating the number of old array elements to remove.
     *
     * @param {boolean} removedAsSubarray
     * If column is a typed array, return a subarray instead of a new array. It
     * is faster `O(1)`, but the entire buffer will be kept in memory until all
     * views to it are destroyed. Default is `true`.
     *
     * @param {Array<number>|TypedArray} items
     * The elements to add to the array, beginning at the start index. If you
     * don't specify any elements, `splice()` will only remove elements from the
     * array.
     *
     * @return {SpliceResult}
     * Object containing removed elements and the modified column.
     *
     * @private
     */
    export function splice(
        column: DataTable.Column,
        start: number,
        deleteCount: number,
        removedAsSubarray: boolean = true,
        items: DataTable.CellType[]|TypedArray = []
    ): SpliceResult<DataTable.Column> {
        if (Array.isArray(column)) {
            if (!Array.isArray(items)) {
                items = Array.from(items);
            }

            return {
                removed: column.splice(start, deleteCount, ...items),
                array: column
            };
        }

        const Constructor = Object.getPrototypeOf(column)
            .constructor as TypedArrayConstructor;

        const removed = column[
            removedAsSubarray ? 'subarray' : 'slice'
        ](start, start + deleteCount);

        const newLength = column.length - deleteCount + items.length;
        const result = new Constructor(newLength);

        result.set(column.subarray(0, start), 0);
        result.set(items as (number[]|TypedArray), start);
        result.set(column.subarray(start + deleteCount), start + items.length);

        return {
            removed: removed,
            array: result
        };
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default ColumnUtils;
