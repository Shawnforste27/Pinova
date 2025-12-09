import { Link } from "react-router-dom";

const PinCard = ({ pin }) => {
    if (!pin || !pin.image?.url) return null;

    return (
        <div className="mb-4 break-inside-avoid">
            <div className="relative bg-white overflow-hidden shadow rounded-lg group cursor-pointer">
                <img
                    src={pin.image.url}
                    alt={pin.title || "Pin"}
                    className="w-full object-cover rounded-lg"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all duration-300 z-10">
                    <Link
                        to={`/pin/${pin._id}`}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                        View Pin
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PinCard;
