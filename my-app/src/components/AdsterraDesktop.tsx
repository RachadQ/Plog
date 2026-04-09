import { useEffect, useRef } from "react";

const AdsterraDesktop = () => {
  const loadedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (loadedRef.current) return;
    if (!containerRef.current) return;
    loadedRef.current = true;

    (window as any).atOptions = {
      key: "da6278f1da04e9c0dfac115fd28f8979",
      format: "iframe",
      height: 90,
      width: 728,
      params: {},
    };

    const script = document.createElement("script");
    script.src =
      "https://www.highperformanceformat.com/da6278f1da04e9c0dfac115fd28f8979/invoke.js";
    script.async = true;
    script.setAttribute("data-cfasync", "false");

    containerRef.current.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

   console.log("Desktop AD LOADED");
  return (
    <div
      ref={containerRef}
      id="da6278f1da04e9c0dfac115fd28f8979"
    />
  );
};

export default AdsterraDesktop;