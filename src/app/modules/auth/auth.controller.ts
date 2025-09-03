/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../errorHelpers/AppError";
import { setCookie } from "../../utils/setCookie";
import { GetUserToken } from "../../utils/GetUserToken";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";



// const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

//     const data = req.body;

//     const loginInfo = await AuthServices.credentialLogin(data);

//     setCookie(res, loginInfo)

//     sendResponse(res, {
//         statusCode: httpStatus.ACCEPTED,
//         success: true,
//         message: "User logged in successfully",
//         data: loginInfo
//     })

// });


const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {


        if (err) {
            return next(new AppError(401, info.message))
        }

        if (!user) {
            return next(new AppError(404, info.message));
        }

        const userToken = GetUserToken(user)

        // delete user.toObject().password

        const { password, ...rest } = user.toObject();

        setCookie(res, userToken);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "user logged in successfully",
            data: {
                accessToken: userToken.accessToken,
                refreshToken: userToken.refreshToken,
                user: rest
            }
        })


    })(req, res, next)
})

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

    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password Reset Successfully",
        data: null
    })

})


const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    let redirectTo = req.query.state ? req.query.state as string : "";

    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }

    const user = req.user;

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }

    const tokenInfo = GetUserToken(user);

    setCookie(res, tokenInfo);

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)

})




export const AuthControllers = {
    credentialLogin,
    getRefreshToken,
    logout,
    resetPassword,
    googleCallbackController
}