import {z} from "zod";
export const signupSchema=z.object({
    email:z
    .string()
    .min(1, { message: "email is required" })
    .min(8, { message: "Must be 8 or more characters long" })
    .email({ message: "Invalid email address" }),
    password:z
    .string()
    .min(1, { message: "password is required" })
    .min(8, { message: "Must be 8 or more characters long" }),
    passwordconfirmation:z
    .string()
    .min(1, { message: "confirmation password is required" })
})
.refine((data)=>data.password==data.passwordconfirmation,
{
    message:"password do not match",
    path:["passwordconfirmation"]
})