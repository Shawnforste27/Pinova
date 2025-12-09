import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PinCard from "../components/PinCard";
import { PinData } from "../context/PinContext";
import { UserData } from "../context/AuthContext";
import Masonry from "react-masonry-css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const UserProfile = ({ user: loggedInUser }) => {
    const params = useParams();
    const [user, setUser] = useState({});
    const [isFollow, setIsFollow] = useState(false);
    const { followUser } = UserData();
    const { pins } = PinData();

    async function fetchUser() {
        try {
            const { data } = await xios.get(`${API_BASE_URL}/api/user/${params.id}`);
            setUser(data.user);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchUser();
    }, [params.id]);

    useEffect(() => {
        if (user?.followers?.includes(loggedInUser._id)) setIsFollow(true);
    }, [user]);

    const followHandler = () => {
        setIsFollow(!isFollow);
        followUser(user._id, fetchUser);
    };

    const userPins = pins?.filter((pin) => pin.owner === user._id);

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
                        {user.name?.slice(0, 1)}
                    </div>

                    <h1 className="text-center text-2xl font-bold mt-4">{user.name}</h1>
                    <p className="text-center text-gray-600 mt-1">{user.email}</p>
                    <p className="flex justify-center gap-3 text-gray-600 mt-1">
                        {user.followers?.length} followers • {user.following?.length} following
                    </p>

                    {user._id !== loggedInUser._id && (
                        <button
                            onClick={followHandler}
                            className="bg-gray-200 px-6 py-2 rounded-md mt-4 hover:bg-gray-300 transition"
                        >
                            {isFollow ? "Unfollow" : "Follow"}
                        </button>
                    )}
                </div>

                <h2 className="text-xl font-semibold mt-8 mb-4 text-center">
                    {user.name}'s Pins
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
};

export default UserProfile;
