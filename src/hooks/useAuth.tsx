import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://10.0.2.2:5000/users";

interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
}

interface UseAuthReturn {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  authenticate: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const useAuth = (endpoint: "login" | "register"): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("auth_token");
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  const authenticate = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok || !data.success || !data.token) {
        throw new Error(data.message || `${endpoint} failed`);
      }

      if (endpoint === "login") {
        await AsyncStorage.setItem("auth_token", data.token);
        await AsyncStorage.setItem("user_email", email);
        setIsAuthenticated(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("auth_token");
    await AsyncStorage.removeItem("user_email");
    setIsAuthenticated(false);
  };

  return { isAuthenticated, error, loading, authenticate, logout };
};

export const useLogin = () => useAuth("login");
export const useRegister = () => useAuth("register");
