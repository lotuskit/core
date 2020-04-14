import bcrypt from "bcrypt";
import { Request, Response } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Operator } from "../models/Operator";
import logger from "../lib/logger";

export class WebuiAuth {
    constructor(private config: any, private app: any) {
        app.use(passport.initialize());
        app.use(passport.session());

        passport.serializeUser((operator: Operator, cb) => {
            cb(null, operator.username);
        });

        passport.deserializeUser((username, cb) => {
            cb(null, this.fetchOperator(`${username}`));
        });

        // Authenticate operator
        passport.use(new LocalStrategy(
            (username, password, done) => {
                const operator = this.fetchOperator(username);

                // Operator not found
                if (!operator) {
                    logger.warn(`Failed operator sign in ("${username}", not found)`);
                    return done(null, false);
                }

                // Check password
                bcrypt.compare(password, operator.password, (err, is_success) => {
                    if (is_success) {
                        logger.info(`Succeeded operator sign in ("${username}")`);
                        done(null, operator);
                    } else {
                        logger.warn(`Failed operator sign in ("${username}", invalid password)`);
                        done(null, false);
                    }
                });
            }
        ));

        // Auth routes
        app.get("/dashboard/login", (req: Request, res: Response) => {
            res.render('pages/login');
        });
        
        app.post("/dashboard/login",
                 passport.authenticate('local', { failureRedirect: '/dashboard/login' }),
                 (req: Request, res: Response) => {
            res.redirect('/dashboard');
        });

        app.get('/dashboard/logout', (req: Request, res: Response) => {
            req.logout();
            res.redirect('/dashboard/login');
        });
    }

    fetchOperator(username: string): Operator | null {
        for (const operator of this.config.webui.operators) {
            if (operator.username === username) {
                return operator;
            }
        }

        return null;
    }
}