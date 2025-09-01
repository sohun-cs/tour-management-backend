/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../errorHelpers/AppError";
import { setCookie } from "../../utils/setCookie";



const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const data = req.body;

    const loginInfo = await AuthServices.credentialLogin(data);

    setCookie(res, loginInfo)

    sendResponse(res, {
        statusCode: httpStatus.ACCEPTED,
        success: true,
        message: "User logged in successfully",
        data: loginInfo
    })

});


const getRefreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No Refreshed Token has been received.")
    }

    const login = await AuthServices.getRefreshToken(refreshToken);

    setCookie(res, login)


    sendResponse(res, {
        statusCode: httpStatus.ACCEPTED,
        success: true,
        message: "User logged in successfully",
        data: login
    })

});


export const AuthControllers = {
    credentialLogin,
    getRefreshToken
}