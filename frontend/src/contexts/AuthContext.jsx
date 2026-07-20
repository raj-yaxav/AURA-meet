import axios from "axios";
import { useMemo, useState } from "react";
import { status } from "http-status";
import { AuthContext } from "./auth-context";
import { apiUrl } from "../config/api";

const client = axios.create({
  baseURL: apiUrl,
});

export function AuthProvider({ children }) {
  const [userData, setUserData] = useState(null);

  const handleRegister = async (name, username, email, password) => {
    const request = await client.post("/register", { name, username, email, password });
    if (request.status === status.CREATED) return request.data.message;
    return "Account created";
  };

  const handleLogin = async (username, password) => {
    const request = await client.post("/login", { username, password });
    if (request.status === status.OK) {
      localStorage.setItem("token", request.data.token);
      return request.data.message;
    }
    return "Signed in";
  };

  const value = useMemo(
    () => ({ userData, setUserData, handleRegister, handleLogin }),
    [userData],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
