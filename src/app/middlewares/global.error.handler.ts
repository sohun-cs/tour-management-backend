/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import { AppError } from "../errorHelpers/AppError";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleZodError } from "../helpers/handleZodError";
import { handleValidationError } from "../helpers/handleValidationError";
import { TErrorSources } from "../interfaces/error.types";



export const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode = 500;
    let message = `Something wend wrong.`;

    let errorSources: TErrorSources[] = [];


    // Duplicate Error
    if (err.code === 11000) {

        const duplicateError = handleDuplicateError(err);
        statusCode = duplicateError.statusCode;
        message = duplicateError.message;
    }

    // Cast Error
    else if (err.name === 'CastError') {
        statusCode = 400;
        message = "Cast Error"
    }

    // Zod Error
    else if (err.name === "ZodError") {

        const zodError = handleZodError(err)

        statusCode = zodError.statusCode;
        errorSources = zodError.errorSources as TErrorSources[];
        message = zodError.message;

    }

    // Validation Error
    else if (err.name === 'ValidationError') {

        const validationError = handleValidationError(err)

        statusCode = validationError.statusCode;
        errorSources = validationError.errorSources as TErrorSources[];
        message = validationError.message;
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
        err: envVars.NODE_ENV === "development" ? err : null,
        stack: envVars.NODE_ENV === 'development' ? err.stack : null
    })

}