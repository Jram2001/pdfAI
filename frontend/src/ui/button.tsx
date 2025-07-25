import React from "react";

type ButtonProps = {
    label: string;
    variation?: "primary" | "secondary" | "error" | "disabled";
    icon?: React.ReactNode;
    error?: string;
    success?: boolean;
    isLoading: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const buttonVariants = {
    primary:
        "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-2 focus:ring-indigo-500",
    secondary:
        "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-2 focus:ring-gray-400",
    error:
        "bg-red-500 hover:bg-red-600 text-white focus:ring-2 focus:ring-red-400",
    disabled:
        "cursor-not-allowed bg-gray-300 text-gray-500 opacity-70 dark:bg-gray-800 dark:text-gray-400",
} as const;

export const Button = ({
    label,
    variation = "primary",
    icon,
    isLoading,
    className,
    error,
    success,
    disabled,
    ...props
}: ButtonProps) => {
    const isDisabled = variation === "disabled" || disabled;

    return (
        <div className="w-full space-y-1 text-left relative">
            <button
                disabled={isDisabled}
                {...props}
                className={
                    `w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-colors duration-200 focus:outline-none ` +
                    `${buttonVariants[variation]} ` +
                    `${className || ''}`
                }
            >
                {!isLoading && icon && !error && !success && <span className="text-lg">{icon}</span>}
                {success && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-4 text-green-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 21.75a9.75 9.75 0 100-19.5 9.75 9.75 0 000 19.5zm4.53-12.28a.75.75 0 00-1.06-1.06l-4.22 4.22-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.75-4.75z"
                        />
                    </svg>
                )}
                {!isLoading && error && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-4 text-red-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m0 3.75h.008v.008H12V16.5Zm9-4.5a9 9 0 11-18 0 9 9 0 0118 0Z"
                        />
                    </svg>
                )}
                {isLoading ? <div className="h-6 w-6 animate-spin rounded-full border-4 border-t-2 border-gray-300 border-t-gray-500"></div> : <span>{label}</span>}
            </button>

            {error && (
                <p className="text-xs text-red-500 mt-1 pl-1 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
};
