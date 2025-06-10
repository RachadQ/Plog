import React, { useEffect} from 'react';
import { Mail, Users, PenSquare, Globe } from "lucide-react";
import { motion } from "framer-motion";
import CallToActionSection from './CallToActionSection';
import HeroSection from './HeroSection';
import FeatureSection from './FeaturesSection';

const LandingPage: React.FC<{}>  = () => {

  
  return (
        
        <div>
          <HeroSection/>
          <FeatureSection/>
          <CallToActionSection/>
        </div>
     )
};

export default LandingPage;
