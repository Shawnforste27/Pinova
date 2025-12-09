import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { auth, provider } from "../firebase"
import { signInWithPopup } from "firebase/auth"
const UserContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  async function registerUser(name, email, password, navigate, fetchPins) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
        name,
        email,
        password,
      }, { withCredentials: true });

      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      navigate("/");
      fetchPins();
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setBtnLoading(false);
    }
  }

  async function loginUser(email, password, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/signin`, {
        email,
        password,
      }, { withCredentials: true });

      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setBtnLoading(false);
    }
  }

  async function googleLogin(navigate) {
    setBtnLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;

      const { data } = await axios.post(
        `${API_BASE_URL}/api/auth/google`,
        {
          name: googleUser.displayName,
          email: googleUser.email,
          googleId: googleUser.uid,
        },
        { withCredentials: true }
      );

      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Google Login Failed");
    } finally {
      setBtnLoading(false);
    }
  }

  async function fetchUser() {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/user/me`, {
        withCredentials: true,
      });



      setUser(data.user);
      setIsAuth(true);
    } catch (error) {
      console.log("User not authenticated:", error.message);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        loginUser,
        registerUser,
        user,
        setUser,
        isAuth,
        setIsAuth,
        btnLoading,
        loading,
        googleLogin,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};



export const UserData = () => useContext(UserContext);

