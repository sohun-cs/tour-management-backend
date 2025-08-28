/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status-codes'
import { UserServices } from './user.services';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { verifyToken } from '../../utils/jwt';
import { envVars } from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';


const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userData = req.body
    const user = await UserServices.createUserServices(userData);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User created successfully",
        data: user
    })

});


const updatedUser = catchAsync(async (req: Request, res: Response, nest: NextFunction) => {

    const userId = req.params.id;
    // const token = req.headers.authorization;
    // const verifiedToken = await verifyToken(token as string, envVars.JWT_SECRET) as JwtPayload;
    const verifiedToken = req.user
    const payload = req.body;

    const user = await UserServices.updateUser(userId, payload, verifiedToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User updated successfully",
        data: user
    })


})


const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserServices.getAllUsers();

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "all users retrieved successfully",
        data: users.data,
        meta: users.meta
    })
})



export const UserController = {
    createUser,
    updatedUser,
    getAllUsers
}