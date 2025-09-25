"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";


export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Gọi API đăng nhập (thay URL API bằng backend )
            const res = await fetch("", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                throw new Error("Sai email hoặc mật khẩu");
            }

            const data = await res.json();
            // console.log("Login successful:", data);

            // Lưu token vào localStorage (hoặc cookie nếu cần bảo mật hơn)
            localStorage.setItem("token", data.access_token);

            // Chuyển hướng sau khi đăng nhập thành công
            router.push("/admin");
        } catch (err) {
            setError("Đăng nhập thất bại");
            console.log("loi")
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-red-500 ">
                    <img className="w-8 h-8 mr-2" src="#" alt="logo" />
                    EV-SHOP
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                            Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                                    Your email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg 
                             focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg 
                             focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm text-gray-500">
                                    <input type="checkbox" className="w-4 h-4 border border-gray-300 rounded" />
                                    Remember me
                                </label>
                                <a href="#" className="text-sm font-medium text-primary-600 hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full text-white bg-blue-500 hover:bg-blue-600 
                           focus:ring-4 focus:outline-none focus:ring-primary-300 
                           font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
                            >
                                {loading ? "Signing in..." : "Sign in"}
                            </button>
                            <p className="text-sm font-light text-gray-500">
                                Don’t have an account yet?{" "}
                                <a href="#" className="font-medium text-primary-600 hover:underline">
                                    Sign up
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
