import {z} from "zod"
const singin=z.object({
    identifier:z
    .string()
    .min(1, { message: "email is required" })
    .email({ message: "Invalid email address" }),
    password:z
    .string()
    .min(1, { message: "password is required" })
    .min(8, { message: "Must be 8 or more characters long" }),
})