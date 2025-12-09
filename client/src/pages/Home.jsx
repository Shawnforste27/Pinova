import React from "react";
import Masonry from "react-masonry-css";
import { PinData } from "../context/PinContext";
import { Loading } from "../components/Loading";
import PinCard from "../components/PinCard";

const Home = () => {
    const { pins, loading } = PinData();

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1,
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {loading ? (
                <Loading />
            ) : (
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="flex w-auto gap-4"
                    columnClassName="bg-clip-padding"
                >
                    {pins && pins.length > 0 ? (
                        pins.map((pin) => <PinCard key={pin._id} pin={pin} />)
                    ) : (
                        <p className="text-center w-full text-gray-500">No Pins Yet</p>
                    )}
                </Masonry>
            )}
        </div>
    );
};

export default Home;
