import z from "zod";
import { Activity, Role } from "./user.interface";


export const createUserZodSchema = z.object({
    name: z.string({ message: "Name must be string" })
        .min(2, { message: "Name must be at least two character long" })
        .max(50, { message: "Name cannot exceed 50 characters" }).optional(),

    email: z.string({ message: "Email must be string" }).optional(),

    password: z.string().min(8)
        .regex(/^.{8,}$/, "Min 8 chars")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, "Must include upper, lower & number")
        .regex(/^(?=.*[@$!%*?&]).*$/, "Must include special char").optional(),

    phone: z.string({ message: "Invalid type" }).regex(
        /^(?:\+88|88)?01[3-9]\d{8}$/,
        "Invalid phone number"
    ).optional(),

    address: z.string({ message: "Address must be string" }).max(200, { message: "Address cannot exceed 200 characters long" }).optional(),
});


export const updateUserZodSchema = z.object({
    name: z.string({ message: "Name must be string" })
        .min(2, { message: "Name must be at least two character long" })
        .max(50, { message: "Name cannot exceed 50 characters" }).optional(),

    password: z.string().min(8)
        .regex(/^.{8,}$/, "Min 8 chars")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, "Must include upper, lower & number")
        .regex(/^(?=.*[@$!%*?&]).*$/, "Must include special char").optional(),

    phone: z.string({ message: "Inva;id type" }).regex(
        /^(?:\+88|88)?01[3-9]\d{8}$/,
        "Invalid phone number"
    ).optional(),

    address: z.string({ message: "Address must be string" }).max(200, { message: "Address cannot exceed 200 characters long" }).optional(),

    role: z.enum(Object.values(Role)).optional(),
    isDeleted: z.boolean({ message: "isDeleted must be true or false" }).optional(),
    isActive: z.enum(Object.values(Activity)).optional(),
    isVerified: z.boolean({ message: "isVerified must be true or false" }).optional(),
    
})