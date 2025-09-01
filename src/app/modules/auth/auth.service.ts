import { AppError } from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from 'http-status-codes';
import bcrypt from 'bcryptjs';
import { getNewAccessTokenWithRefreshToken, GetUserToken } from "../../utils/GetUserToken";


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


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPass, ...rest } = isUserExits.toObject();

    const getUserToken = GetUserToken(isUserExits)


    return {
        accessToken: getUserToken.accessToken,
        refreshToken: getUserToken.refreshToken,
        user: rest
    }

};


const getRefreshToken = async (refreshToken: string) => {

    const getNewAccessToken = await getNewAccessTokenWithRefreshToken(refreshToken);

    return {
        accessToken: getNewAccessToken
    }

}



export const AuthServices = {
    credentialLogin,
    getRefreshToken
}