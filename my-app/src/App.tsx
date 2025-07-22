import React from 'react';
import logo from './logo.svg';
import './App.css';
import UserProfile from './components/userProfile';
import { BrowserRouter as Router, Route, Routes,useLocation  } from 'react-router-dom';
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

function App() {

  const { authToken } = useAuth();
  const location = useLocation(); 
  return (
    <div className="App">
      
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
