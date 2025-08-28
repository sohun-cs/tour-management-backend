import { NextFunction, Request, Response } from "express";
import { AppError } from "../errorHelpers/AppError";
import httpStatus from 'http-status-codes';
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";




export const CheckAuth = (...allowedRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {

    try {

        const accessToken = req.headers.authorization;

        if (!accessToken) {
            throw new AppError(httpStatus.BAD_REQUEST, "Unauthorized access");
        }

        const verifiedToken = verifyToken(accessToken, envVars.JWT_SECRET) as JwtPayload;  // --> approach-1
        // const verifiedToken = verifyToken(accessToken, envVars.JWT_SECRET) as {role: string};  // --> approach-2

        if (!allowedRoles.includes(verifiedToken.role)) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not permitted to this route")
        }

        req.user = verifiedToken;
        next()

    } catch (error) {

        next(error)

    }

}