import { AppError } from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from 'http-status-codes';
import bcrypt from 'bcryptjs';

import jwt, { SignOptions } from 'jsonwebtoken'
import { envVars } from "../../config/env";



const credentialLogin = async (payload: Partial<IUser>) => {

    const { email, password } = payload;

    const isUserExits = await User.findOne({ email });



    if (!isUserExits) {
        throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exists");
    };

    const isPasswordMatched = await bcrypt.compare(password as string, isUserExits.password as string);

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Password incorrect");
    };

    const jwtPayload = {
        email: isUserExits.email,
        password: isUserExits.password,
        role: isUserExits.role
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password: userPass, ...rest} = isUserExits;

    // const accessToken = generateToken(jwtPayload, envVars.JWT_SECRET, envVars.JWT_EXPIRES)

    const accessToken = jwt.sign(jwtPayload, envVars.JWT_SECRET, {expiresIn: envVars.JWT_EXPIRES} as SignOptions)
    const refreshToken = jwt.sign(jwtPayload, envVars.JWT_REFRESH_SECRET, {expiresIn: envVars.JWT_REFRESH_EXPIRED} as SignOptions);

    return {
        accessToken,
        refreshToken,
        user: rest
    }

};

export const AuthServices = {
    credentialLogin
}