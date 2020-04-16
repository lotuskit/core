import bcrypt from "bcrypt";
import { Router, Request, Response, NextFunction } from "express";
import { LotuServer } from "../../lotuserver";

export default (lotuserver: LotuServer) => {
    const routes = Router();

    function isAuthenticated(req: Request, res: Response, next: NextFunction) {
        if (req.user && req.isAuthenticated()) {
            res.locals.user = req.user;
            res.locals.version = process.env.npm_package_version;
            return next();
        }

        return res.redirect('/dashboard/login');
    }

    routes.get("/", isAuthenticated, (req: Request, res: Response) => {
        // Fetch active leafs
        const leafs = lotuserver.getLeafs();
        const active_leafs_count = leafs.handshake.length + leafs.message.length;

        // Fetch stats
        const stats = lotuserver.stats();

        // Get all stats keys associated to leafs metrics
        let process_total_time = 0;
        const leaf_stats = Object.keys(stats.metrics)
            .filter(key => key.substring(0,5) === 'leaf:')
            .reduce((obj: any, key) => {
                const metric = stats.metrics[key];
                obj[key.substring(5)] = metric.count ? metric.avg : '-';
                process_total_time += metric.avg;
                return obj;
            }, {});

        res.locals.stats = {
            connexions_count: stats.connexions_count,
            messages_count: stats.metrics['messages']?.count || 0,
            process_sessionFetch: stats.metrics['process:sessionFetch']?.avg || 0,
            leafs: leaf_stats,
            active_leafs_count
        };

        // Add Redis session fetch to total process time
        res.locals.stats.process_total_time = process_total_time + res.locals.stats.process_sessionFetch;

        res.render('pages/dashboard');
    });

    routes.get("/leafs", isAuthenticated, (req: Request, res: Response) => {
        // Fetch leafs
        res.locals.leafs = lotuserver.getLeafs();

        res.render('pages/leafs');
    });

    routes.get("/plugins", isAuthenticated, (req: Request, res: Response) => {
        // Fetch plugins
        res.locals.plugins = lotuserver.getPlugins();

        res.render('pages/plugins');
    });

    routes.get("/operators", isAuthenticated, (req: Request, res: Response) => {
        const config = lotuserver.getConfig();
        res.locals.operators = config.webui.operators;
        res.render('pages/operators');
    });

    routes.post("/operators", isAuthenticated, (req: Request, res: Response) => {
        const config = lotuserver.getConfig();

        bcrypt.hash(req.body.password, 6, function(err, hash) {
            const operator = {username: req.body.username, password: hash};
            
            // Add operator to config & save it
            config.webui.operators.push(operator);
            lotuserver.saveConfig(config);

            res.redirect('/dashboard/operators');
        });
    });

    routes.post("/operators/remove", isAuthenticated, (req: Request, res: Response) => {
        const username = req.body.username;
        const config = lotuserver.getConfig();

        // Remove operator
        config.webui.operators = config.webui.operators.filter(
            (operator: any) => operator.username !== username
        );

        // Save new configuration
        lotuserver.saveConfig(config);

        res.redirect('/dashboard/operators');
    });

    return routes;
};