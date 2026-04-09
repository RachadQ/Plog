import { useEffect, useState } from "react";
import AdsterraMobile from "./AdsterraMobile";
import AdsterraDesktop from "./AdsterraDesktop";

const AdWrapper = () => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    // Detect mobile using BOTH width + userAgent (more reliable)
    const checkDevice = () => {
      const isMobileWidth = window.innerWidth < 768;
      const isMobileUA = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

      setIsMobile(isMobileWidth || isMobileUA);
    };

    checkDevice();

    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Prevent rendering until we know device
  if (isMobile === null) return null;

  return (
    <div className="flex justify-center my-4">
      {isMobile ? <AdsterraMobile /> : <AdsterraDesktop />}
    </div>
  );
};

export default AdWrapper;