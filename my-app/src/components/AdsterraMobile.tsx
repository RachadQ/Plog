import { useEffect, useRef } from "react";

const AdsterraMobile = () => {
  const loadedRef = useRef(false);
const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (loadedRef.current) return;
    if (!containerRef.current) return;
    loadedRef.current = true;

    (window as any).atOptions = {
      key: "e2a458df4ebf20c0fbff632fdc0edbdc",
      format: "iframe",
      height: 250,
      width: 300,
      params: {},
    };

    const script = document.createElement("script");
    script.src =
      "https://www.highperformanceformat.com/e2a458df4ebf20c0fbff632fdc0edbdc/invoke.js";
    script.setAttribute("data-cfasync", "false");

    containerRef.current.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);
  console.log("MOBILE AD LOADED");

  return (
    <div
      ref={containerRef}
      id="e2a458df4ebf20c0fbff632fdc0edbdc"
    />);
};

export default AdsterraMobile;