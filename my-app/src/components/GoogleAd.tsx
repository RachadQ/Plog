import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from './Default/AuthProvider';

const GoogleAd: React.FC = () => {
  const [adKey, setAdKey] = useState(0); // Ensure re-renders have unique ad keys
  const [adConfig,setAdConfig] = useState({adClient: "", adSlot: ""})
  const adsInitializedRef = useRef(false); // Flag to track if ads have been initialized
  const { authToken,loginUserUserId,apiUrl} = useAuth();
 
  useEffect(() => {
    // Fetch ad client and slot from backend
    axios.get(`${apiUrl}/api/ads-config`)
    .then((res) => {
      console.log(JSON.stringify(res.data));
      setAdConfig(res.data);
     
      console.log("worked");
      
    })
      
    .catch((error) => console.error("Error fetching ad config:", error));
  }, [adConfig]);
  

  useEffect(() => {
    // Function to load Google Ads script
    const loadGoogleAdsScript = () => {
      if (!document.querySelector('script[src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) {
        const script = document.createElement('script');
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
        script.async = true;
        script.onload = () => {
          console.log("Google Ads script loaded.");
          initializeAds();
        };
        document.body.appendChild(script);
      } else {
        console.log("Google Ads script already exists.");
        initializeAds();
      }
    };

    // Function to initialize ads
    const initializeAds = () => {
      if (window.adsbygoogle && Array.isArray(window.adsbygoogle) && !adsInitializedRef.current) {
        console.log("Initializing ads...");
        window.adsbygoogle.push({});
        adsInitializedRef.current = true;
      } else {
        console.log("Ads already initialized or script not loaded yet.");
      }
    };

    if (adConfig.adClient && adConfig.adSlot) {
      loadGoogleAdsScript();
    } else {
      console.error("Ad client or slot ID is missing.");
    }

    return () => {
      adsInitializedRef.current = false;
    };
  }, [adConfig]);

  const handleAdRender = () => {
    // Force re-render by updating the adKey to ensure a new ad is rendered
    setAdKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="flex items-center justify-center ">
    <div 
    
      className="w-[1250px] h-[125px] p-3 m-1 border border-gray-200 rounded-md shadow-md"
      onClick={handleAdRender}
    >
       {adConfig.adClient && adConfig.adSlot ? (
      <ins
        key={adKey} // Ensure a unique key to force re-render in React
        style={{ display: 'block' }}
        data-ad-client={adConfig.adClient}  // Pass your ad client ID here
        data-ad-slot={adConfig.adSlot}      // Pass your ad slot ID here
        data-ad-format="auto"
        data-full-width-responsive="true"
        data-adtest="on"
        
      ></ins>
       ) : (
        <p>Loading Ads...</p>
       )}
      </div>
    </div>
  );
  
};

export default GoogleAd;
