import JobHelper from "xpresser/src/Console/JobHelper";
import { $ } from "../../app";
import XLSX from "xlsx";
import LocationsModel from "../models/LocationsModel";
import { processXlsFile } from "./functions";

const world = $.path.storage("uploads/worldcities.xlsx");

/**
 *  Job: World
 */
export = {
    // Job Handler
    async handler(args: string[], job: JobHelper): Promise<any> {
        // Your Job Here
        const data = processXlsFile(world);

        // insert many

        const refined = await LocationsModel.native().insertMany(data);

        console.log("Job Done!", refined.insertedCount);
        // End current job process.
        return job.end();
    }
};

// Print the data
