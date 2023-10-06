import { getInstanceRouter } from "xpresser";

/**
 * See https://xpresserjs.com/router/
 */
const Route = getInstanceRouter();

/**
 * Url: "/" points to AppController@index
 * The index method of the controller.
 */
Route.get("/", "App@index").name("index");
Route.get("/process", "App@process").name("process");
Route.get("/all", "App@all").name("all");
Route.get("/raw", "App@raw").name("raw");
Route.get("/summary", "App@summary").name("summary");
Route.get("/world", "App@world").name("world");

/**
 * Add 404 routes after plugins are loaded.
 */
Route.routesAfterPlugins = () => {
    Route.get("*", "App@notFound").name("404");
};
