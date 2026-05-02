import React, { createContext, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const AuthContext = createContext(null);

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("cookCartUser") || "null");
  } catch (error) {
    localStorage.removeItem("cookCartUser");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  const saveUser = (data) => {
    localStorage.setItem("cookCartUser", JSON.stringify(data));
    setUser(data);
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    saveUser(data);
    toast.success("Welcome back");
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    saveUser(data);
    toast.success("Account created");
  };

  const logout = () => {
    localStorage.removeItem("cookCartUser");
    setUser(null);
    toast.success("Signed out");
  };

  const value = useMemo(() => ({ user, login, register, logout, isAdmin: user?.role === "admin" }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
