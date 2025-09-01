import { model, Schema } from "mongoose";
import { Activity, IAuthProvider, IUser, Role } from "./user.interface";


const authProviderSchema = new Schema<IAuthProvider>({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }
})


const userSchema = new Schema<IUser>({
    
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    phone: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: String, enum: Object.values(Activity), default: Activity.ACTIVE },
    isVerified: { type: Boolean, default: false },
    auths: [authProviderSchema],

}, {
    versionKey: false,
    timestamps: true
})


export const User = model<IUser>("User", userSchema);