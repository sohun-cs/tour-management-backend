/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";


type tryCatchHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const catchAsync = (fn: tryCatchHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error: any) => next(error))
}