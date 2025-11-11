import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const PinContext = createContext();


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const PinProvider = ({ children }) => {
    const [pins, setPins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pin, setPin] = useState([]);


    async function fetchPins() {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/pin/all`);
            setPins(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }


    async function fetchPin(id) {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/pin/${id}`);
            setPin(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

   
    async function updatePin(id, title, pin, setEdit) {
        try {
            const { data } = await axios.put(`${API_BASE_URL}/api/pin/${id}`, { title, pin });
            toast.success(data.message);
            fetchPin(id);
            setEdit(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update pin");
        }
    }

    
    async function addComment(id, comment, setComment) {
        try {
            const { data } = await axios.post(`${API_BASE_URL}/api/pin/comment/${id}`, { comment });
            toast.success(data.message);
            fetchPin(id);
            setComment("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add comment");
        }
    }

   
    async function deleteComment(id, commentId) {
        try {
            const { data } = await axios.delete(
                `${API_BASE_URL}/api/pin/comment/${id}?commentId=${commentId}`
            );
            toast.success(data.message);
            fetchPin(id);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete comment");
        }
    }


    async function deletePin(id, navigate) {
        setLoading(true);
        try {
            const { data } = await axios.delete(`${API_BASE_URL}/api/pin/${id}`);
            toast.success(data.message);
            navigate("/");
            fetchPins();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete pin");
        } finally {
            setLoading(false);
        }
    }

    async function addPin(formData, setFilePrev, setFile, setTitle, setPin, navigate) {
        try {
            const { data } = await axios.post(`${API_BASE_URL}/api/pin/new`, formData , { withCredentials: true });
            toast.success(data.message);
            setFile([]);
            setFilePrev("");
            setPin("");
            setTitle("");
            fetchPins();
            navigate("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create pin");
        }
    }

    useEffect(() => {
        fetchPins();
    }, []);

    return (
        <PinContext.Provider
            value={{
                pins,
                loading,
                fetchPin,
                pin,
                updatePin,
                addComment,
                deleteComment,
                deletePin,
                addPin,
                fetchPins,
            }}
        >
            {children}
        </PinContext.Provider>
    );
};

export const PinData = () => useContext(PinContext);
