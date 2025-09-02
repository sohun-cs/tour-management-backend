import dotenv from 'dotenv';

dotenv.config();


interface envTypes {
    DB_API: string
    PORT: string
    NODE_ENV: string
    SALT_ROUND: string
    JWT_SECRET: string
    JWT_EXPIRES: string
    SUPER_ADMIN_EMAIL: string
    SUPER_ADMIN_PASSWORD: string
    JWT_REFRESH_SECRET: string
    JWT_REFRESH_EXPIRED: string
    GOOGLE_CLIENT_ID: string,
    GOOGLE_CLIENT_SECRET: string,
    GOOGLE_CALLBACK_API: string,
    EXPRESS_SESSION_SECRET: string,
    FRONTEND_URL: string,
}


const envConfigFunc = (): envTypes => {

    const envVarsArray: string[] = [
        "DB_API", "PORT", "NODE_ENV", "SALT_ROUND", "JWT_SECRET", "JWT_EXPIRES", "SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PASSWORD", "JWT_REFRESH_SECRET", "JWT_REFRESH_EXPIRED",
        "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_CALLBACK_API", "EXPRESS_SESSION_SECRET", "FRONTEND_URL"
    ]

    envVarsArray.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`The environment variable: ${key} is missing`)
        }
    })

    return {
        DB_API: process.env.DB_API as string,
        PORT: process.env.PORT as string,
        NODE_ENV: process.env.NODE_ENV as string,
        SALT_ROUND: process.env.SALT_ROUND as string,
        JWT_SECRET: process.env.JWT_SECRET as string,
        JWT_EXPIRES: process.env.JWT_EXPIRES as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        JWT_REFRESH_EXPIRED: process.env.JWT_REFRESH_EXPIRED as string,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
        GOOGLE_CALLBACK_API: process.env.GOOGLE_CALLBACK_API as string,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
        FRONTEND_URL: process.env.FRONTEND_URL as string,
    }
}


export const envVars: envTypes = envConfigFunc()
