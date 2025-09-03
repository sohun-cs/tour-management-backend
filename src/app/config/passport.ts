/* eslint-disable no-console */
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Activity, Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";


passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, async (email: string, password: string, done) => {

        try {

            const isUserExist = await User.findOne({ email });

            if (!isUserExist) {
                return done(null, false, { message: `${httpStatus.NOT_FOUND}: User not found` })
            }

            if (isUserExist.isActive === Activity.BLOCKED || isUserExist.isActive === Activity.INACTIVE) {
                return done(null, false, { message: `This user is ${isUserExist.isActive}` })
            }

            if (isUserExist.isDeleted) {
                return done(null, false, { message: 'This user is blocked' })
            }

            const isGoogleAuthenticated = isUserExist.auths?.some(objects => objects.provider === "google");

            if (isGoogleAuthenticated) {
                return done(null, false, { message: "This user is google authenticated" })
            }

            const isPasswordMatched = await bcrypt.compare(password, isUserExist.password as string);

            console.log("isPasswordMatched: ", isPasswordMatched)

            if (!isPasswordMatched) {
                return done(null, false, { message: `${httpStatus.BAD_REQUEST}: Password does not matched` })
            }

            return done(null, isUserExist)

        } catch (error) {
            done(error);
        }


    })
)



passport.use((
    new GoogleStrategy({
        clientID: envVars.GOOGLE_CLIENT_ID,
        clientSecret: envVars.GOOGLE_CLIENT_SECRET,
        callbackURL: envVars.GOOGLE_CALLBACK_API
    }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {

        try {

            const email = profile.emails?.[0].value

            if (!email) {
                return done(null, false, { message: "Email not found" })
            };

            let user = await User.findOne({ email });

            if (!user) {

                user = await User.create({

                    email: email,
                    name: profile.displayName,
                    photo: profile.photos?.[0].value,
                    role: Role.USER,
                    isVerified: true,
                    auths: [
                        {
                            provider: 'google',
                            providerId: profile.id
                        }
                    ]

                })
            }

            return done(null, user)

        } catch (error) {
            console.log("Unable to google authenticate: ", error);
            return done(error)
        }
    })
))


// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id)
})


// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser(async (id: string, done: any) => {
    try {

        const user = await User.findById(id);

        done(null, user)

    } catch (error) {
        done(error)
    }
})

