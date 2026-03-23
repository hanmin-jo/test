import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 앱 시작 시 토큰으로 사용자 복원
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }

    api.get("/api/auth/me")
      .then(({ data }) => { if (data) setUser(data); })
      .catch(() => { localStorage.removeItem("token"); })
      .finally(() => setLoading(false));
  }, []);

  // 다른 탭/401 이벤트로 로그아웃
  useEffect(() => {
    const handler = () => { setUser(null); };
    window.addEventListener("auth:logout", handler);
    return () => window.removeEventListener("auth:logout", handler);
  }, []);

  const login = useCallback(({ access_token, user: u }) => {
    localStorage.setItem("token", access_token);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
