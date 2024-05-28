import { useState, useEffect } from "react";

const useOpenCV = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const scriptId = "opencv-script";
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://docs.opencv.org/4.x/opencv.js"; // URL to the OpenCV.js file
      script.async = true;

      script.onload = () => {
        console.log("OpenCV.js script loaded");
      };

      document.body.appendChild(script);
    }

    const onOpenCVReady = () => {
      setIsReady(true);
      console.log("OpenCV.js is ready");
    };

    window.Module = {
      onRuntimeInitialized: onOpenCVReady,
    };

    return () => {
      window.Module = null;
    };
  }, []);

  return isReady;
};

export default useOpenCV;
