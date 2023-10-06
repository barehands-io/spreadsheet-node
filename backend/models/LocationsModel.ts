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
export interface LocationsDataType {
    updatedAt?: Date;
    createdAt: Date;
    city: string;
    city_ascii: string;
    lat: number;
    lng: number;
    country: string;
    iso2: string;
    iso3: string;
    admin_name: string;
    capital: string;
    population: number;
    id: number;
}

class LocationsModel extends BaseModel {
    /**
     * Model Schema
     */
    static schema: XMongoSchema<LocationsDataType> = {
        updatedAt: is.Date(),
        createdAt: is.Date().required(),
        city: is.String().required(),
        city_ascii: is.String().required(),
        lat: is.Number().required(),
        lng: is.Number().required(),
        country: is.String().required(),
        iso2: is.String().required(),
        iso3: is.String().required(),
        admin_name: is.String().required(),
        capital: is.String().required(),
        population: is.Number().required(),
        id: is.Number().required()
    };

    // SET Type of this.data.
    public data!: LocationsDataType;
}

/**
 * Map Model to Collection: `locations_models`
 * .native() will be made available for use.
 */
UseCollection(LocationsModel, "locations");

LocationsModel.createIndex(
    [
        "city",
        "city_ascii",
        "lat",
        "lng",
        "country",
        "iso2",
        "iso3",
        "admin_name",
        "capital",
        "population",
        "id"
    ],
    true
);

// Export Model as Default
export default LocationsModel;
