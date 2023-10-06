import { Controller } from "xpresser/types/http";
import { processXls, refineData } from "../Utilities";
import SheetModel from "../models/SheetModel";
import sheetModel from "../models/SheetModel";
import { $ } from "../../app";
import { PaginatedMetaData } from "xpress-mongo/src/types/pagination";
import { SponsorLooseData } from "../models/types";
import LocationsModel from "../models/LocationsModel";

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
        const data = processXls() as SponsorLooseData[];

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

        console.log(http.$query.all());

        // Base aggregation pipeline
        const baseAggregate: any[] = [];

        // Filtering based on query parameters
        const matchCriteria: any = {};
        if (organization_name) matchCriteria.organization_name = organization_name;
        if (town_city) matchCriteria.town_city = town_city;
        if (type_rating) matchCriteria.type_rating = type_rating;
        if (route) matchCriteria.route = route;

        if (Object.keys(matchCriteria).length) {
            baseAggregate.push({ $match: matchCriteria });
        }

        const data = await SheetModel.paginateAggregate(page, perPage, baseAggregate);

        return {
            data: PaginatedMetaData(data)
        };
    },

    async raw(http) {
        const { page, perPage } = http.paginationQuery();

        const pipeline = [
            {
                $group: {
                    _id: "type_rating" // Group by route
                }
            },
            {
                $project: {
                    type_rating: "$_id", // Project the route value
                    _id: 0 // Exclude the default _id field
                }
            }
        ];

        const data = await SheetModel.paginateAggregate(page, perPage, pipeline);

        const all_type_rating = await SheetModel.native()
            .aggregate([
                {
                    $group: {
                        _id: "$type_rating"
                    }
                }
            ])
            .toArray();

        const stats = {
            all_type_rating
        };
        return {
            stats
        };
    },

    async summary(http) {
        const { page, perPage } = http.paginationQuery();

        const total_companies = await SheetModel.count({});
        const total_routes = await SheetModel.native()
            .aggregate([
                {
                    $group: {
                        _id: "$route"
                    }
                }
            ])
            .toArray();

        const skilled_worker = await SheetModel.native()
            .aggregate([
                {
                    $match: {
                        route: "Skilled Worker" // Filter by Skilled Worker route
                    }
                }
            ])
            .toArray();

        const total_locations = await SheetModel.native()
            .aggregate([
                {
                    $group: {
                        _id: "$town_city"
                    }
                }
            ])
            .toArray();

        const locations = await SheetModel.paginateAggregate(30, perPage, [
            {
                $group: {
                    _id: "$town_city"
                }
            }
        ]);

        const routes = await SheetModel.native()
            .aggregate([
                {
                    $group: {
                        _id: "$route",
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: {
                        count: -1
                    }
                },
                {
                    $project: {
                        label: "$_id",
                        count: 1,
                        _id: 0
                    }
                }
            ])
            .toArray();

        const summary = {
            total_companies,
            total_routes: total_routes.length,
            skilled_worker: skilled_worker.length,
            total_locations: total_locations.length,
            routes

            // locations: PaginatedMetaData(locations),
        };

        return {
            summary
        };
    },

    async location(http) {
        const { page, perPage } = http.paginationQuery();

        const orgs_location_summary = await SheetModel.paginateAggregate(page, perPage, [
            {
                $group: {
                    _id: "$town_city", // Group by town/city
                    numberOfOrganizations: { $sum: 1 } // Count the number of organizations for each town/city
                }
            },
            {
                $sort: { numberOfOrganizations: -1 } // Optional: Sort by the number of organizations in descending order
            }
        ]);

        return {
            data: PaginatedMetaData(orgs_location_summary)
        };
    },

    async routes_locations(http) {
        const { page, perPage } = http.paginationQuery();

        const routes_locations = await SheetModel.paginateAggregate(page, perPage, [
            {
                $group: {
                    _id: {
                        route: "$route",
                        town_city: "$town_city"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    count: -1
                }
            },
            {
                $project: {
                    route: "$_id.route",
                    location: "$_id.town_city",
                    count: 1,
                    _id: 0
                }
            }
        ]);

        return {
            data: PaginatedMetaData(routes_locations)
        };
    },

    async world(http) {
        const { page, perPage } = http.paginationQuery();

        const { search } = http.$query.all() as {
            search?: string;
        };

        let aggregatePipeline = [];

        // If there's a search query, add a match stage to the aggregation pipeline
        if (search) {
            aggregatePipeline.push({
                $match: {
                    city: new RegExp(search, "i") // This will perform a case-insensitive search on the city field
                }
            });
        }

        const data = await LocationsModel.paginateAggregate(
            page,
            perPage,
            aggregatePipeline
        );

        const stats = {
            data
        };
        return {
            stats
        };
    },
    /**
     * 404 Page handler
     * @param http
     */
    notFound: (http) => http.notFound()
};
export = AppController;
