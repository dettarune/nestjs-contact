import { Injectable } from "@nestjs/common";
import { z, ZodType } from "zod";

export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        username: z.string().min(8).max(100),
        password: z.string().min(8).max(100),
        name: z.string().min(8).max(100),
        email: z.string().max(100).email({message: `Format Email Tidak Valid`})
    })

    static readonly LOGIN: ZodType = z.object({
        username: z.string().min(8).max(100),
        password: z.string().min(8).max(100),
    })

    // static readonly VERIFY: ZodType = z.object({
    //     username: z.string().min(8).max(100),
    //     token: z.string().min(8).max(100),
    // })

    static readonly UPDATE: ZodType = z.object({
        username: z.string().min(8).max(100),
        password: z.string().min(8).max(100),
        name: z.string().min(8).max(100),
    })

    // static readonly : ZodType = z.object({
    //     username: z.string().min(8).max(100),
    //     password: z.string().min(8).max(100)
    //     name: z.string().min(8).max(100),
    // })
}
