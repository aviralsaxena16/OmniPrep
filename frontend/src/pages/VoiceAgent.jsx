import { useEffect } from "react";

function VoiceAgent({ jobRole }) { // Assume jobRole is passed as a prop
  useEffect(() => {
    const script = document.createElement("script");
    script.src = import.meta.env.VITE_OMNIDIMENSION_WIDGET_URL;
    script.async = true;
    script.id = "omnidimension-web-widget";

    script.onload = () => {
      // Ensure OmniDimension object is available
      if (window.OmniDimension && typeof window.OmniDimension.init === 'function') {
        window.OmniDimension.init({
          dynamic_variables: {
            job_role: jobRole || "Software Engineer" // Pass your dynamic job role here
          }
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      // Clean up OmniDimension instance if necessary
      if (window.OmniDimension && typeof window.OmniDimension.destroy === 'function') {
        window.OmniDimension.destroy();
      }
    };
  }, [jobRole]); // Re-run effect if jobRole changes

  return (
    <div>
      <h2>Voice Agent Ready</h2>
    </div>
  );
}

export default VoiceAgent;