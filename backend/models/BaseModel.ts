import { omitIdAndPick, RefreshDateOnUpdate, XMongoModel } from "xpress-mongo";
import { Obj } from "object-collection/exports";
import { XMongoStrictConfig } from "xpress-mongo/src/types";

import { escapeRegexp } from "xpress-mongo/fn/helpers";
import { $ } from "../../app";

class BaseModel extends XMongoModel {
    static strict: XMongoStrictConfig = true;

    // Array of publicFields
    static readonly publicFields: string[];

    // References
    static readonly referenceKeys: string[];

    static refreshUpdatedAt() {
        RefreshDateOnUpdate(this, "updatedAt", true);
    }

    /**
     * Returns mongodb projection query using public fields
     */
    static projectPublicFields(add: string[] = [], except: string[] = []) {
        let fields = this.publicFields;
        // If add concat fields
        if (add.length) fields = fields.concat(add);

        // If remove fields
        if (except.length) fields = fields.filter((v) => !except.includes(v));

        return omitIdAndPick(fields);
    }

    /**
     * Same as `projectPublicFields` but for making exceptions
     * @param except
     */
    static projectPublicFieldsExcept(except: string[] = []) {
        return this.projectPublicFields([], except);
    }

    static makeSearchQuery(
        query: string,
        fields: string | string[],
        options?: {
            where?: Record<string, any>;
            caseInsensitive?: boolean;
        }
    ) {
        const $options = Object.assign(
            {
                where: {},
                caseInsensitive: false,
                queryOptions: {}
            },
            options || {}
        );

        if (typeof fields === "string") fields = [fields];
        const $or: any[] = [];

        fields.forEach((field) => {
            $or.push({
                [field]: new RegExp(
                    `.*${escapeRegexp(query)}.*`,
                    $options.caseInsensitive ? "i" : undefined
                )
            });
        });

        return { $or, ...$options.where };
    }

    static createIndex(field: string | string[], unique: boolean = false) {
        let options;

        if (unique) {
            options = { unique };
        }

        if (typeof field === "string") {
            this.native()
                .createIndex({ [field]: 1 }, options || {})
                .catch($.log);
        } else {
            const fields = {} as Record<string, any>;
            field.forEach((f) => (fields[f] = 1));

            this.native()
                .createIndex(fields, options || {})
                .catch($.log);
        }
    }

    /**
     * Returns the public field defined in a model.
     */
    getPublicFields(add?: string[]) {
        let fields = this.$static<typeof BaseModel>().publicFields;
        if (add) fields = fields.concat(add);
        return this.toCollection().pick(fields);
    }

    uuid(): string {
        return this.data.uuid;
    }

    referenceKeys<Result extends Record<string, any>>(): Result {
        return this.toCollection().pick<Result, string[]>(
            this.$static<typeof BaseModel>().referenceKeys || []
        );
    }

    /**
     * Shortcut for `this.toCollection().pick()
     */
    pick<T = any>(pick: string[]): T {
        const o = Obj({} as T);

        for (const p of pick) {
            o.set(p, this.get(p));
        }

        return o.data;
    }

    /**
     * Shortcut for `this.toCollection().omit()
     */
    omit<T = any>(omit: string[]): T {
        return this.toCollection().omit(omit);
    }

    /**
     * Data Type Maker function
     */
    static dt<T>(data: T): T {
        return data;
    }

    /**
     * Partial Data Type Maker function
     */
    static pdt<T>(data: Partial<T>): Partial<T> {
        return data;
    }
}

export default BaseModel;
