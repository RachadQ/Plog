import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from './Default/AuthProvider';

// TypeScript declaration for Google AdSense
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const GoogleAd: React.FC = () => {
  const [adKey, setAdKey] = useState(0);
  const [adConfig, setAdConfig] = useState({ adClient: "", adSlot: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const adsInitializedRef = useRef(false);
  const { apiUrl } = useAuth();
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Fetch ad client and slot from backend
    const fetchAdConfig = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await axios.get(`${apiUrl}/api/ads-config`);
        const { adClient, adSlot } = res.data;
        if (adClient && adSlot) {
          setAdConfig({ adClient, adSlot });
        } else {
          setError("Ad client or slot ID is missing in the fetched data.");
          console.error("Ad client or slot ID is missing in the fetched data.");
        }
      } catch (error) {
        setError("Error fetching ad config");
        console.error("Error fetching ad config:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdConfig();
  }, [apiUrl]);

  useEffect(() => {
    if (!adConfig.adClient || !adConfig.adSlot) {
      return;
    }

    // Function to load Google Ads script
    const loadGoogleAdsScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (document.querySelector('script[src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) {
          console.log("Google Ads script already exists.");
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
        script.async = true;
        script.onload = () => {
          console.log("Google Ads script loaded successfully.");
          resolve();
        };
        script.onerror = () => {
          console.error("Failed to load Google Ads script.");
          reject(new Error("Failed to load Google Ads script"));
        };
        document.head.appendChild(script);
      });
    };

    // Function to initialize ads
    const initializeAds = () => {
      try {
        if (window.adsbygoogle && Array.isArray(window.adsbygoogle) && !adsInitializedRef.current) {
          console.log("Initializing Google Ads...");
          window.adsbygoogle.push({});
          adsInitializedRef.current = true;
        } else {
          console.log("Ads already initialized or script not ready.");
        }
      } catch (error) {
        console.error("Error initializing ads:", error);
        setError("Failed to initialize ads");
      }
    };

    // Load script and initialize ads
    const setupAds = async () => {
      try {
        if (!scriptLoadedRef.current) {
          await loadGoogleAdsScript();
          scriptLoadedRef.current = true;
        }
        
        // Small delay to ensure script is fully loaded
        setTimeout(() => {
          initializeAds();
        }, 100);
      } catch (error) {
        console.error("Error setting up ads:", error);
        setError("Failed to load ad script");
      }
    };

    setupAds();

    return () => {
      // Cleanup on unmount
      adsInitializedRef.current = false;
    };
  }, [adConfig.adClient, adConfig.adSlot]);

  const handleAdRender = () => {
    // Force re-render by updating the adKey
    setAdKey((prevKey) => prevKey + 1);
    
    // Re-initialize ads after a short delay
    setTimeout(() => {
      if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
        window.adsbygoogle.push({});
      }
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-full max-w-4xl h-[125px] p-3 m-1 border border-gray-200 rounded-md shadow-md flex items-center justify-center">
          <p>Loading Ads...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-full max-w-4xl h-[125px] p-3 m-1 border border-gray-200 rounded-md shadow-md flex items-center justify-center">
          <p className="text-red-500">Ad Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div 
        className="w-full max-w-4xl h-[125px] p-3 m-1 border border-gray-200 rounded-md shadow-md"
        onClick={handleAdRender}
      >
        {adConfig.adClient && adConfig.adSlot ? (
          <ins
            key={adKey}
            style={{ display: 'block' }}
            data-ad-client={adConfig.adClient}
            data-ad-slot={adConfig.adSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        ) : (
          <p>No ad configuration available</p>
        )}
      </div>
    </div>
  );
};

export default GoogleAd;
