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

        const { organization_name, type_rating, town_city, route } =
            http.$query.all() as {
                organization_name?: string;
                town_city?: string;
                type_rating?: string;
                route?: string;
                search?: string;
            };

        const routeAggregate = [
            {
                $group: {
                    _id: "$route", // Group by route
                    count: { $sum: 1 } // Count occurrences
                }
            },
            {
                $sort: { count: -1 } // Sort by count in descending order (optional)
            }
        ];

        const duplicateAggregate = [
            {
                $group: {
                    _id: "$organization_name", // Group by organization_name
                    count: { $sum: 1 } // Count occurrences
                }
            },
            {
                $match: {
                    count: { $gt: 1 } // Filter for counts greater than 1 (duplicates)
                }
            }
        ];

        console.log("town_city ---{PP", http.$query.all());

        const data = await SheetModel.paginateAggregate(page, perPage, [
            {
                $match: {
                    town_city: town_city || { $exists: true },
                    type_rating: type_rating || { $exists: true },
                    route: route || { $exists: true },
                    organization_name: organization_name || { $exists: true }
                }
            }
        ]);

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
