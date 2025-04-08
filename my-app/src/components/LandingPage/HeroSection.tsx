import React, { useEffect } from "react";
import { Mail, Users, PenSquare, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HeroSection: React.FC<{}> = () => {
  const navigate = useNavigate();

  const handleNavigate = () =>
    {
      
      navigate("/login");
    
    };
  return (
    <div>
      <section className="max-w-5xl mx-auto text-center py-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold mb-4"
        >
          Share Your Journey. Inspire the World.
        </motion.h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          Whether you're a nurse, developer, artist, mechanic, or doctor — Plog
          is the place to log your journey, share your knowledge, and grow your
          community.
        </p>
        <div className="flex justify-center gap-4">
          <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={handleNavigate}>
            Start Plogging
          </button>
          <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={handleNavigate}>
            Browse Posts
          </button>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
