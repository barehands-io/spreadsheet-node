import JobHelper from "xpresser/src/Console/JobHelper";
import { processXlsFile } from "./functions";
import LocationsModel from "../models/LocationsModel";
import { $ } from "../../app";
import SheetModel from "../models/SheetModel";
import { processXls } from "../Utilities";
import sheetModel from "../models/SheetModel";
import { SponsorLooseData } from "../models/types";

const sponsor = $.path.storage("uploads/sponsor.xlsx");

/**
 *  Job: Sponsor
 */
export = {
    // Job Handler
    async handler(args: string[], job: JobHelper): Promise<any> {
        const startTime = Date.now();

        // Your Job Here
        const data = processXlsFile(sponsor) as SponsorLooseData[];

        // insert many

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
        // End current job process.
        return job.end();
    }
};
