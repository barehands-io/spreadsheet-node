import { Controller } from "xpresser/types/http";
import {processXls} from "../Utilities";
import SponsorModel from "../models/SponsorModel";

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


    async view (){


     const  data =   processXls();

     // dave to datta base

        const data_ =  await SponsorModel.native().insertMany(data);





     //

        console.log(data_);





        return {
            message:"here i am",
        }

    },


    async all (http     ){

        const { page, perPage } = http.paginationQuery();

        const data = await SponsorModel.paginateAggregate(page,perPage,[]);



        return {
            data
        }
    },
    /**
     * 404 Page handler
     * @param http
     */
    notFound: (http) => http.notFound()
};

export = AppController;
