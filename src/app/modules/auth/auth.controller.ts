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
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully",
        data: login
    })

});


const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })


    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged out successfully",
        data: null
    })

});


const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodedToken = req.user

    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password Reset Successfully",
        data: null
    })

})



export const AuthControllers = {
    credentialLogin,
    getRefreshToken,
    logout,
    resetPassword
}