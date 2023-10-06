import { is, XMongoModel, XMongoSchema } from "xpress-mongo";
import { UseCollection } from "@xpresser/xpress-mongo";
import BaseModel from "./BaseModel";

/**
 * Interface for Model's `this.data`. (For Typescript)
 * Optional if accessing data using model helper functions
 *
 * @example
 * this.data.updatedAt? // type Date
 * this.data.createdAt // type Date
 */
export interface SheetDataType {
    updatedAt?: Date;
    createdAt: Date;
    organization_name?: string;
    uuid?: string;
    town_city?: string;
    type_rating?: string;
    route?: String;
}

class SheetModel extends BaseModel {
    /**
     * Model Schema
     */
    static schema: XMongoSchema<SheetDataType> = {
        updatedAt: is.Date(),
        uuid: is.Uuid(4).required(),
        createdAt: is.Date().required(),
        organization_name: is.String().optional(),
        town_city: is.String().optional(),
        type_rating: is.String().optional(),
        route: is.String().optional()
    };

    // SET Type of this.data.
    public data!: SheetDataType;
}

/**
 * Map Model to Collection: `sponsor_models`
 * .native() will be made available for use.
 */
UseCollection(SheetModel, "sponsor");

// SheetModel.createIndex(["organization_name", "town_city", "type_rating", "route"], true);

// Export Model as Default
export default SheetModel;
