import LoginForm from "../../../fetures/auth/components/login-form";

export default function LoginPage() {
    return (
        <div className="dark:bg-[#090909] rounded-2xl border-1 dark:border-gray-500 p-13 transition-shadow duration-300 focus-within:shadow-[0_0_10px_rgba(99,102,241,0.6)]">
            <p className="mb-8 text-left text-3xl  font-bold align-text-top  ">Sign <span className="text-indigo-500">In</span> </p>
            <LoginForm />
        </div>
    )
}