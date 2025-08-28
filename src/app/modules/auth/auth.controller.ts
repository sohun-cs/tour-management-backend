/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";



const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const loginInfo = req.body;
    const login = await AuthServices.credentialLogin(loginInfo);

    sendResponse(res, {
        statusCode: httpStatus.ACCEPTED,
        success: true,
        message: "User logged in successfully",
        data: login
    })

});


export const AuthControllers = {
    credentialLogin
}