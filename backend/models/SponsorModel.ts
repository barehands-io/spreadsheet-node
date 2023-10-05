import { is, XMongoModel, XMongoSchema } from "xpress-mongo";
import { UseCollection } from "@xpresser/xpress-mongo";

/**
 * Interface for Model's `this.data`. (For Typescript)
 * Optional if accessing data using model helper functions
 *
 * @example
 * this.data.updatedAt? // type Date
 * this.data.createdAt // type Date
 */
export interface SponsorModelDataType {
    updatedAt?: Date;
    createdAt: Date;
}


class SponsorModel extends XMongoModel {
    /**
     * Model Schema
     */
    static schema: XMongoSchema<SponsorModelDataType> = {
        updatedAt: is.Date(),
        createdAt: is.Date().required()
    };

    // SET Type of this.data.
    public data!: SponsorModelDataType;
}

/**
 * Map Model to Collection: `sponsor_models`
 * .native() will be made available for use.
 */
UseCollection(SponsorModel, "sponsor");

// Export Model as Default
export default SponsorModel;
