import { Router, Request, Response, NextFunction } from "express";

const routes = Router();

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.user && req.isAuthenticated()) {
    return next();
    }

    return res.redirect('/dashboard/login');
}

routes.get("/", isAuthenticated, (req: Request, res: Response) => {
    res.render('pages/dashboard');
});

export default routes;