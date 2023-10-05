import { Controller } from "xpresser/types/http";
import { processXls, refineData } from "../Utilities";
import SheetModel from "../models/SheetModel";
import sheetModel from "../models/SheetModel";
import { $ } from "../../app";

interface DataItem {
    "Organisation Name": string;
    "Town/City"?: string;
    "Type & Rating"?: string;
    Route?: string;
    // ... any other properties
}

const AppController = <Controller.Object>{
    /**
     * Controller name.
     * @type {string}
     */
    name: "AppController",

    /**
     * Index Method for "/"
     * @returns {string}
     */
    index: () => "<h1>My xpresser Typescript lite project</h1>",

    async process() {
        const startTime = Date.now();
        const data = processXls() as DataItem[];

        try {
            for (const item of data) {
                const refined = sheetModel.make({
                    organization_name: String(item["Organisation Name"]),
                    town_city: item["Town/City"],
                    type_rating: item["Type & Rating"],
                    route: item["Route"]
                });

                console.log(refined);
                await refined.save();
            }
        } catch (e) {
            console.log(e);
        }

        const endTime = Date.now();

        // Calculate the elapsed time in seconds
        const elapsedTime = (endTime - startTime) / 1000;

        console.log(`The process took ${elapsedTime} seconds.`);
        return {
            message: `The process took ${elapsedTime} seconds.`
        };
    },

    // refined.validate();

    async all(http) {
        const { page, perPage } = http.paginationQuery();

        const { organization_name, type_rating, town_city, route, search } =
            http.$query.all() as {
                organization_name?: string;
                town_city?: string;
                type_rating?: string;
                route?: string;
                search?: string;
            };

        // Base aggregation pipeline
        const baseAggregate: any[] = [];

        // Filtering based on query parameters
        const matchCriteria: any = {};
        if (organization_name) matchCriteria.organization_name = organization_name;
        if (town_city) matchCriteria.town_city = town_city;
        if (type_rating) matchCriteria.type_rating = type_rating;
        if (route) matchCriteria.route = route;

        // Search functionality for organization_name
        if (search) {
            matchCriteria.organization_name = { $regex: search, $options: "i" }; // 'i' for case-insensitive
        }

        if (Object.keys(matchCriteria).length) {
            baseAggregate.push({ $match: matchCriteria });
        }

        const data = await SheetModel.paginateAggregate(page, perPage, baseAggregate);

        return {
            data
        };
    },

    /**
     * 404 Page handler
     * @param http
     */
    notFound: (http) => http.notFound()
};
export = AppController;
