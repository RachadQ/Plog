import React,{createContext,useState,ReactNode, useEffect, useContext, useCallback} from "react";
import {AuthContextType } from "../../interface/AuthContext"
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import axios from "axios";


/// Create the context
export const AuthContext = createContext<AuthContextType | null>(null);


interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authRefreshToken, setAuthRefreshToken] = useState<string | null>(null);
  const [loginUserUserId, setLoginUserId] = useState<string | null>(null);
  const [username,setUsername] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState<string>(process.env.REACT_APP_API_URL || "");

  const navigate = useNavigate();

  

   // Memoized function to get the auth token from cookies
   const getAuthToken = useCallback(() => {
    return Cookies.get("authToken") || null;
  }, []);
  
  const getRefreshToken = useCallback(() => {
    return Cookies.get("refreshToken") || null;
  }, []);

  useEffect(() => {
    const storedToken = getAuthToken();
    if (storedToken) {
      setAuthToken(storedToken);
      try {
        const base64Payload = storedToken.split('.')[1];
        const decoded = JSON.parse(atob(base64Payload));
        const username = decoded.username || decoded.email || decoded.sub;
        const id = decoded.id;
        setLoginUserId(id);
        setUsername(username);
      } catch (error) {
        console.error("Error decoding token", error);
      }
    }


  }, [getAuthToken]);


  const refreshAuthToken = async () => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      logout(); // Log the user out if there's no refresh token
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/refresh-token`, {
        refreshToken
      }, {
        withCredentials: true,
      });

      if (response.status === 200) {
        // Save the new tokens to cookies
        Cookies.set('authToken', response.data.token, { expires: 1 });
        Cookies.set('refreshToken', response.data.refreshToken, { expires: 7 });

        // Set the new tokens in state
        setAuthToken(response.data.token);
        setAuthRefreshToken(response.data.refreshToken);
      } else {
        logout(); // Log the user out if refresh fails
      }
    } catch (error) {
      console.error("Error refreshing token", error);
      logout(); // Log the user out if the refresh token request fails
    }
  };


  const login = async (email: string, password: string) => {
    try {
      // Make the POST request to the server's /login route
      const response = await axios.post(`${apiUrl}/login`, {
        email,
        password,
      }, {
        withCredentials: true,
      });

      if (response.status === 200) {
        // Save tokens to cookies
        Cookies.set('authToken', response.data.token, { expires: 1 });
        Cookies.set('refreshToken', response.data.refreshToken, { expires: 7 });

        // Set tokens in state
        setAuthToken(response.data.token);
        setAuthRefreshToken(response.data.refreshToken);

        // Redirect to the provided URL or home page
        const redirectUrl = response.data.redirectUrl || '/';
        navigate(redirectUrl);
      } else {
        throw new Error('Login failed');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred');
      console.error("Login error:", error);
    }
  };

  
  const logout = async () =>{ 
    //clear auth and set token and remove cookies

    try{
      await axios.post(`${apiUrl}/logout`, {}, { withCredentials: true });
    }
    catch(err)
    {
      console.warn("Logout request failed or not implemented:", err);
    }
    setAuthToken(null);
    setAuthRefreshToken(null);
    Cookies.remove('authToken');
    Cookies.remove('refreshToken');
    navigate('/login');
  }



  
  return (
    <AuthContext.Provider value={{
      authToken,
      username,
      authRefreshToken,
      setAuthToken,
      setAuthRefreshToken,
      loginUserUserId,
      setLoginUserId,
      login,
      logout,
      error,
      apiUrl, // Provide apiUrl in context if needed in other components
      }}>
      {children} {/* Ensure this exists and is properly passed */}
    </AuthContext.Provider>
  );
};



// Custom hook to access the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};