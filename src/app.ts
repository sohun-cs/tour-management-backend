import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { router } from './app/routes';
import { globalErrorHandler } from './app/middlewares/global.error.handler';
import routeNotFound from './app/middlewares/routeNotFound';
import cookieParser from 'cookie-parser';
import express_session from "express-session";
import passport from 'passport';
import { envVars } from './app/config/env';
import './app/config/passport';


const app: Application = express();

app.use(express_session({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(express.json())
app.use("/api/v1", router);

app.use(cors())

app.get('/', (req: Request, res: Response) => {
    res.send('tour management api is working')
});



// Global Error Middleware
app.use(globalErrorHandler);

// Route not found
app.use(routeNotFound)

export default app;