import React from 'react';
import './App.css';
import UserProfile from './components/userProfile';
import { Route, Routes  } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/Login'
import SignUp from './components/SignUp';
import EmailVerification from "./components/EmailVerification";
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import BaseLayout from './components/Default/BaseLayout';
import { useAuth } from './components/Default/AuthProvider';
import LandingPage from './components/LandingPage/LandingPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import About from './components/About';
import ContactForm from './components/Default/ContactForm';
import TermsOfService from './components/TermsOfService';

// Loading overlay component
const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg">Loading...</p>
    </div>
  </div>
);

function App() {
  const { authToken, isLoading } = useAuth();
   
  return (
    <div className="App">
      {isLoading && <LoadingOverlay />}
      
      <BaseLayout>
        <Routes>
          {/*<UserProfile profile={profileData} />*/}
          <Route path="/"  element={authToken ? <HomePage/> : <LandingPage/>} />
          <Route path="/user/:username" element={<UserProfile />} />
          {/* New route for login page */}
          <Route path="/login" element={<LoginPage />} />
           {/* New route for SignUp page */}
          <Route path="/signUp" element={<SignUp/>} />
          {/* New route for verifying email page */}
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="create-account" element={<SignUp/>}/>
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactForm />} />

        </Routes>
        </BaseLayout>
      
    </div>
  );
}

export default App;
