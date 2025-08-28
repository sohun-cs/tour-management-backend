import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { router } from './app/routes';
import { globalErrorHandler } from './app/middlewares/global.error.handler';
import routeNotFound from './app/middlewares/routeNotFound';

const app: Application = express();

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