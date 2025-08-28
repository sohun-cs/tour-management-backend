import { AppError } from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";


const createUserServices = async (payload: Partial<IUser>) => {

    const { email, password, ...rest } = payload;

    const isUserExists = await User.findOne({ email });

    if (isUserExists) {
        throw new AppError(httpStatus.BAD_REQUEST, "This user is already exists. stfu")
    }

    const hashedPassword = await bcrypt.hash(password as string, Number(envVars.SALT_ROUND));

    const authProvider: IAuthProvider = { provider: 'credentials', providerId: email as string }


    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    });

    return user;
}


const getAllUsers = async () => {
    const users = await User.find();

    const totalUsers = await User.countDocuments();

    return {
        data: users,
        meta: {
            total: totalUsers
        }
    };
}


const updateUser = async(userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    const isUserExists = await User.findById(userId);

    if(!isUserExists){
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }

    if(payload.email){
        throw new AppError(httpStatus.FORBIDDEN, "Email cannot be updated"); 
    }

    if(payload.role){
        if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE ){
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }

        if(payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN){
             throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    };

    if(payload.isVerified || payload.isActive || payload.isDeleted){
        if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
             throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, payload, {new: true, runValidators: true});

    return updatedUser;

}


export const UserServices = {
    createUserServices,
    getAllUsers,
    updateUser

}