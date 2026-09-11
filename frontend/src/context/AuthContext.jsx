import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem("shopfront_auth");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (auth) localStorage.setItem("shopfront_auth", JSON.stringify(auth));
    else localStorage.removeItem("shopfront_auth");
  }, [auth]);

  function login(user, token) {
    setAuth({ user, token });
  }

  function logout() {
    setAuth(null);
  }

  return <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
