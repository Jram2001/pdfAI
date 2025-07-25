import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../../lib/validation";
import type { LoginFormType } from "../../../lib/validation";
import { Input } from "../../../ui/Input";
import { Button } from "../../../ui/button";

export function LoginForm() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState<string>("");
    const { register, formState: { errors, isSubmitting, touchedFields }, handleSubmit } = useForm<LoginFormType>({
        resolver: zodResolver(loginSchema),
        mode: "onChange"
    });
    const onSubmit = async (data: LoginFormType) => {
        try {
            console.log('Data', data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error?.message || 'Login Failed')
            } else {
                console.log("Unknown error");
            }
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w mx-auto">
                <Input
                    id="email"
                    type="email"
                    label="Email"
                    variation={errors.email ? "error" : "normal"}
                    registration={register("email")}
                    error={errors.email?.message}
                    success={!!touchedFields.email && !errors.email}
                    iconPath={
                        <>
                            <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                            <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                        </>
                    }
                    placeholder="Enter your email"
                    className="px-3 py-2 w-full"
                />

                <Input
                    id="password"
                    type="password"
                    label="Password"
                    variation={errors.password ? "error" : "normal"}
                    registration={register("password")}
                    error={errors.password?.message}
                    success={!!touchedFields.password && !errors.password}
                    iconPath={
                        <>
                            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                        </>
                    }
                    placeholder="Password"
                    className="px-3 py-2 w-full"
                />
                <Button className="mt-3" disabled={isSubmitting} type="submit" variation="primary" isLoading={false} label={"Login"}></Button>
            </form>
        </>
    )
}

export default LoginForm;