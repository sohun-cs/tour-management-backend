import { envVars } from "../config/env";
import { Activity, IUser } from "../modules/user/user.interface";
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import { AppError } from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";



export const GetUserToken = (user: Partial<IUser>) => {

    const jwtPayload = {
        _id: user._id,
        email: user.email,
        password: user.password,
        role: user.role
    }

    // const accessToken = generateToken(jwtPayload, envVars.JWT_SECRET, envVars.JWT_EXPIRES)

    const accessToken = jwt.sign(jwtPayload, envVars.JWT_SECRET, { expiresIn: envVars.JWT_EXPIRES } as SignOptions)
    const refreshToken = jwt.sign(jwtPayload, envVars.JWT_REFRESH_SECRET, { expiresIn: envVars.JWT_REFRESH_EXPIRED } as SignOptions);

    return {
        accessToken,
        refreshToken
    }
}



export const getNewAccessTokenWithRefreshToken = async (refreshToken: string) => {

    const verifiedToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;

    const isUserExits = await User.findOne({ email: verifiedToken.email });

    if (!isUserExits) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }

    if (isUserExits.isActive === Activity.BLOCKED || isUserExits.isActive === Activity.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, `This is ${isUserExits.isActive}`)
    }

    if (isUserExits.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
    }

    const jwtPayload = {
        _id: isUserExits._id,
        email: isUserExits.email,
        role: isUserExits.role
    }

    const accessToken = generateToken(jwtPayload, envVars.JWT_SECRET, envVars.JWT_EXPIRES);

    return accessToken;

}