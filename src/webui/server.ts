import crypto from "crypto";
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import webui_routes from "./routes";
import expressLayouts from "express-ejs-layouts";
import { WebuiAuth } from "./auth";

export class WebuiServer {
    constructor(private config: any, private app: express.Application) {
        // Body parser
        app.use(bodyParser.urlencoded({ extended: true }));

        // Views engine
        app.set("views", "src/webui/views");
        app.set("view engine", "ejs");
        app.use(expressLayouts);

        // Initialize session
        app.use(session({
            secret: crypto.randomBytes(64).toString('hex'),
            saveUninitialized: false,
            resave: true
        }));

        // Auth
        new WebuiAuth(config, app);

        // Routes
        app.use("/dashboard", webui_routes);
    }
}
