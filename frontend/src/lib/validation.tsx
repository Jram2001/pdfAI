import z from "zod";

export const loginSchema = z.object({
    email: z.email("Invalid email"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
            "Password must include uppercase, lowercase, number, and special character"
        ),
});

export type LoginFormType = z.infer<typeof loginSchema>;
