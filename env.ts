import { Env } from "@xpresser/env";
import { resolve } from "path";

const env = Env(
    resolve(".env"),
    {
        NODE_ENV: Env.is.enum(["development", "production"] as const),

        APP_NAME: Env.is.string("View Sponsors"),
        APP_PORT: Env.is.number(3800),
        APP_HOST: Env.optional.string("localhost"),

        DB_SERVER: Env.is.string("mongodb://127.0.0.1:27017"),
        DB_NAME: Env.is.string(),
        DB_PASSWORD: Env.optional.string()
    },
    { expose: true }
);

export default env;
