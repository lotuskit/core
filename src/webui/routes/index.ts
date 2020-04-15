import { Router, Request, Response, NextFunction } from "express";
import { LotuServer } from "../../lotuserver";

export default (lotuserver: LotuServer) => {
    const routes = Router();

    function isAuthenticated(req: Request, res: Response, next: NextFunction) {
        if (req.user && req.isAuthenticated()) {
        return next();
        }

        return res.redirect('/dashboard/login');
    }

    routes.get("/", isAuthenticated, (req: Request, res: Response) => {
        res.locals.user = req.user;

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
            leafs: leaf_stats
        };

        // Add Redis session fetch to total process time
        res.locals.stats.process_total_time = process_total_time + res.locals.stats.process_sessionFetch;

        res.render('pages/dashboard');
    });

    return routes;
};