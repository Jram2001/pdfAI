import { Label } from "@radix-ui/react-label";
import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

type InputProps = {
    id: string; // For <Label htmlFor>
    className?: string;
    registration: Partial<UseFormRegisterReturn>;
    error?: string;
    success?: boolean;
    label: string;
    type: string;
    iconPath: React.ReactNode;
    variation: "normal" | "error" | "disabled";
} & React.InputHTMLAttributes<HTMLInputElement>;

const inputVariants = {
    normal:
        "bg-white text-gray-900 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-300 border border-gray-300 dark:border-gray-600 dark:bg-[#090909] dark:text-gray-200 dark:placeholder:text-gray-500 dark:focus:border-indigo-500",
    error:
        "border-red-500 bg-red-50 text-red-700 placeholder:text-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-red-500 dark:bg-red-900/20 dark:text-red-200 dark:placeholder:text-red-300",
    disabled:
        "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 opacity-80 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500",
} as const;

export const Input = ({
    id,
    className,
    registration,
    error,
    label,
    type,
    variation,
    success,
    iconPath,
    ...props
}: InputProps) => {
    return (
        <div className="w-full space-y-2 text-left relative">
            <div className="flex justify-between items-end">
                <Label
                    htmlFor={id}
                    className="text-sm font-bold text-gray-700 dark:text-gray-300"
                >
                    {label}
                </Label>

                {/* Icon display: Only show neutral in normal, error or success in those cases */}
                <div className={`group flex items-center ${error || success ? 'hidden' : ''}`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-4 w-4 h-4 text-gray-400 dark:text-gray-500"
                    >
                        {iconPath}
                    </svg>
                </div>

                {/* Error icon and tooltip */}
                <div className={`group flex items-center ${!error ? 'hidden' : ''}`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4 w-4 h-4 text-red-600 dark:text-red-500 cursor-pointer"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                        />
                    </svg>
                    <span className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-xs rounded px-2 py-1 z-10 whitespace-nowrap">
                        {error}
                    </span>
                </div>

                {/* Success icon */}
                <div className={`group flex items-center ${success ? '' : 'hidden'}`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-4 w-4 h-4 text-green-600 dark:text-green-500"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>

            <input
                id={id}
                type={type}
                {...registration}
                {...props}
                disabled={variation === "disabled"}
                className={`placeholder:text-sm block w-full rounded-sm px-3 py-2 text-base transition-colors duration-200 ease-in-out focus:outline-none ${inputVariants[variation]} ${className || ""}`}
            />
        </div>
    );
};
