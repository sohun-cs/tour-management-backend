import { envVars } from "../config/env"
import { User } from "../modules/user/user.model"
import bcrypt from 'bcryptjs';
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { AppError } from "../errorHelpers/AppError";
import httpStatus from 'http-status-codes';


const seedSuperAdmin = async () => {

    try {

        let superAdmin;

        superAdmin = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL });

        if (superAdmin) {
            return 'Super Admin Already Exists'
        }

        const superAdminPass = await bcrypt.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.SALT_ROUND))
        const authProvider: IAuthProvider = {
            provider: 'credentials',
            providerId: envVars.SUPER_ADMIN_EMAIL
        }


        const payload: IUser = {
            email: envVars.SUPER_ADMIN_EMAIL,
            password: superAdminPass,
            role: Role.SUPER_ADMIN,
            isVerified: true,
            auths: [authProvider]
        }

        superAdmin = await User.create(payload);

        console.log(superAdmin)


    } catch (error) {
        throw new AppError(httpStatus.BAD_REQUEST, `Super Admin is not created. ${error}`)
    }

}

export default seedSuperAdmin;

