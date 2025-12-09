

import React from "react";
import { useNavigate } from "react-router-dom";
import { PinData } from "../context/PinContext";
import { UserData } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import PinCard from "../components/PinCard";
import Masonry from "react-masonry-css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Account = ({ user }) => {
  const navigate = useNavigate();
  const { setIsAuth, setUser } = UserData(); 
  const { pins } = PinData();

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/user/logout`, {
        withCredentials: true,
      });

      toast.success(data.message);

      setIsAuth(false);
      setUser({});
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "Logout failed");

      setIsAuth(false);
      setUser({});
      navigate("/login");
    }
  };

  let userPins;

  if (pins) {
    userPins = pins.filter((pin) => pin.owner === user._id);

    const breakpointColumnsObj = {
      default: 4,
      1100: 3,
      700: 2,
      500: 1,
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 w-full max-w-5xl">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-3xl font-semibold text-gray-700">
              {user.name.slice(0, 1)}
            </div>

            <h1 className="text-center text-2xl font-bold mt-4">{user.name}</h1>
            <p className="text-center text-gray-600 mt-1">{user.email}</p>

            <button
              onClick={logoutHandler}
              className="bg-red-500 text-white px-6 py-2 rounded-md mt-4 hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4 text-center">
            Your Pins
          </h2>

          {userPins && userPins.length > 0 ? (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="flex w-auto gap-4"
              columnClassName="bg-clip-padding"
            >
              {userPins.map((pin) => (
                <PinCard key={pin._id} pin={pin} />
              ))}
            </Masonry>
          ) : (
            <p className="text-center text-gray-500 mt-6">No Pins Yet</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Loading your pins...</p>
    </div>
  );
};

export default Account;
