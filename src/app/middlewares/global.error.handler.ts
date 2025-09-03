/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import { AppError } from "../errorHelpers/AppError";


export const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode = 500;
    let message = `Something wend wrong.`;

    const errorSources: any = [];

    if (err.code === 11000) {

        const matchedArray = err.message.match(/"([^"]*)"/)
        statusCode = 400;
        message = `${matchedArray[1]} already exists!!`
    }

    else if (err.name === 'CastError') {
        statusCode = 400;
        message = "Cast Error"
    }

    else if (err.name === "ZodError") {

        statusCode = 400;
        message = "Zod Error";

        err.issues.forEach((issue: any) => {
            errorSources.push({
                path: issue.path[issue.path.length - 1],
                message: issue.message
            })
        })

    }

    else if (err.name === 'ValidationError') {
        statusCode = 400;
        const errors = Object.values(err.errors);

        errors.forEach((errorObject: any) => errorSources.push({
            path: errorObject.path,
            message: errorObject.message
        }));

        message = err.message
    }

    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    }

    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message
    }


    res.status(statusCode).json({
        success: false,
        message: message,
        errorSources,
        stack: envVars.NODE_ENV === 'development' ? err.stack : null
    })

}