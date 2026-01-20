// src/pages/Account.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import PinCard from "../components/PinCard";
import Masonry from "react-masonry-css";

const Account = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pins } = useSelector((state) => state.pin);

  const logoutHandler = async () => {
    dispatch(logoutUser({ navigate }));
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