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
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    setError(null);
    
    try {
      // Make the POST request to the server's /login route
      const response = await axios.post(`${apiUrl}/login`, {
        email,
        password,
      }, {
        withCredentials: true,
        timeout: 10000, // 10 second timeout
      });

      if (response.status === 200) {
        // Save tokens to cookies
        Cookies.set('authToken', response.data.token, { expires: 1 });
        Cookies.set('refreshToken', response.data.refreshToken, { expires: 7 });

        // Set tokens in state
        setAuthToken(response.data.token);
        setAuthRefreshToken(response.data.refreshToken);

        // Extract user info from token for immediate UI update
        try {
          const base64Payload = response.data.token.split('.')[1];
          const decoded = JSON.parse(atob(base64Payload));
          const username = decoded.username || decoded.email || decoded.sub;
          const id = decoded.id;
          setLoginUserId(id);
          setUsername(username);
        } catch (error) {
          console.error("Error decoding token", error);
        }

        // Navigate immediately after successful login
        const redirectUrl = response.data.redirectUrl || '/';
        navigate(redirectUrl);
      } else {
        throw new Error('Login failed');
      }
    } catch (error: any) {
      let errorMessage = 'An error occurred during login';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Login request timed out. Please try again.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many login attempts. Please try again later.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      console.error("Login error:", error);
      throw error; // Re-throw to let the Login component handle it
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () =>{ 
    //clear auth and set token and remove cookies
    try{
      await axios.post(`${apiUrl}/logout`, {}, { 
        withCredentials: true,
        timeout: 5000 // 5 second timeout for logout
      });
    }
    catch(err)
    {
      console.warn("Logout request failed or not implemented:", err);
    }
    setAuthToken(null);
    setAuthRefreshToken(null);
    setLoginUserId(null);
    setUsername("");
    setError(null);
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
      isLoading,
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