import React, { useEffect} from 'react';
import { Mail, Users, PenSquare, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

const CallToActionSection: React.FC<{}>  = () => {
  const navigate = useNavigate();

  const handleNavigate = () =>
    {
      
      navigate("/login");
    
    };
  
  return (
        
        <div>
        {/* Call To Action */}
        <section className="bg-gray-100 py-12 mt-16">
            <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-4">Ready to share your story?</h2>
            <p className="text-gray-600 mb-6">Join thousands of people building in public and inspiring others every day.</p>
            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={handleNavigate}>Create Your Profilo Blog</button>
            </div>
        </section>
        </div>
     )
};

export default CallToActionSection;
