// src/pages/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, googleLogin } from "../redux/slices/authSlice";
import { fetchPins } from "../redux/slices/pinSlice";
import { LoadingAnimation } from "../components/Loading";
import logo from "../assets/pinova.png";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { btnLoading } = useSelector((state) => state.auth);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(
            registerUser({
                name,
                email,
                password,
                navigate,
                fetchPins: () => dispatch(fetchPins()),
            })
        );
    };

    const handleGoogleLogin = () => {
        dispatch(googleLogin({ navigate }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-center mb-4">
                    <img src={logo} alt="Pinova" className="h-12" />
                </div>
                <h2 className="text-2xl font-semibold text-center mb-6">
                    Register to Pinova
                </h2>
                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="common-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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
                        {btnLoading ? <LoadingAnimation /> : "Register"}
                    </button>
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={btnLoading}
                        className="w-full mt-4 flex items-center justify-center gap-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-100 transition-all duration-200"
                    >
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google Logo"
                            className="w-5 h-5"
                        />
                        <span className="text-gray-700 font-medium">
                            {btnLoading ? "Processing..." : "Continue with Google"}
                        </span>
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <div className="relative mb-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 to-gray-50">OR</span>
                        </div>
                    </div>

                    <div className="mt-4 text-center text-sm">
                        <span>
                            Already have an account?
                            <Link
                                to="/login"
                                className="font-medium text-pinterest hover:underline"
                            >
                                Login
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;