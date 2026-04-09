import { useEffect,useRef } from "react";

const AdsterraAd = () => {
  const adRef = useRef<HTMLDivElement | null>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (!adRef.current) return;

    // Prevent duplicate script injection
    if (scriptLoadedRef.current) return;

    const script = document.createElement("script");
    script.src =
      "https://pl29109328.profitablecpmratenetwork.com/7dffd173cad6cc98685aa7355df1875b/invoke.js";
    script.async = true;
    script.setAttribute("data-cfasync", "false");

    document.body.appendChild(script);
    scriptLoadedRef.current = true;

    return () => {
      script.remove();
      scriptLoadedRef.current = false;
    };
  }, []);

  return (
    <div
      ref={adRef}
      id="container-7dffd173cad6cc98685aa7355df1875b"
    />
  );
};

export default AdsterraAd;