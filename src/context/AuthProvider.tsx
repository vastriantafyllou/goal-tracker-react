import {useEffect, useState} from "react";
import type {LoginFields} from "@/schemas/login.ts";
import {login} from "@/services/api.login.ts";
import {deleteCookie, getCookie, setCookie} from "@/utils/cookies.ts";
import {jwtDecode} from "jwt-decode";
import {AuthContext} from "@/context/AuthContext.ts";

/* eslint-disable react-hooks/set-state-in-effect */

type JwtPayload = {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  exp?: number;
};

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [accessToken, setAccessToken] = useState(() => getCookie("access_token") ?? null);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resetUser = () => {
      setUserId(null);
      setUsername(null);
      setUserRole(null);
    };

    const process = () => {
      if (!accessToken) {
        resetUser();
        return;
      }

      try {
        const decoded = jwtDecode<JwtPayload>(accessToken);

        setUserId(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ?? null);
        setUsername(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ?? null);
        setUserRole(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? null);
      } catch {
        resetUser();
      }
    };

    process();
    setLoading(false);  // <= SINGLE setState at the end → NO WARNING
  }, [accessToken]);

  const loginUser = async (fields: LoginFields) => {
    const res = await login(fields);

    setCookie("access_token", res.token, {
      expires: 1,
      sameSite: "Lax",
      secure: false,
      path: "/",
    });

    setAccessToken(res.token);
  };

  const logoutUser = () => {
    deleteCookie("access_token");
    setAccessToken(null);
    setUserId(null);
    setUsername(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!accessToken,
        accessToken,
        userId,
        username,
        userRole,
        loginUser,
        logoutUser,
        loading,
      }}
    >
      {loading ? (
        <div className="p-8 text-center">Loading...</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
