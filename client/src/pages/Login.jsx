import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/AuthContext";
import { LoadingAnimation } from "../components/Loading";
import logo from "../assets/pinova.png"

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { loginUser, btnLoading } = UserData();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        loginUser(email, password, navigate);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-center mb-4">
                    <img
                        src={logo}
                        alt="Pinova"
                        className="h-12"
                    />
                </div>

                <h2 className="text-2xl font-semibold text-center mb-6">
                    Log in to see more
                </h2>

                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="common-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="common-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="common-btn" disabled={btnLoading}>
                        {btnLoading ? <LoadingAnimation /> : "Log In"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    Not on Pinterest yet?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-pinterest hover:underline"
                    >
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
