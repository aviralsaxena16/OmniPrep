import { useEffect } from "react";

function VoiceAgent({ jobRole }) { // Assume jobRole is passed as a prop
  useEffect(() => {
    const script = document.createElement("script");
    script.src = import.meta.env.VITE_OMNIDIMENSION_WIDGET_URL;
    script.async = true;
    script.id = "omnidimension-web-widget";

    script.onload = () => {
      if (window.OmniDimension && typeof window.OmniDimension.init === 'function') {
        window.OmniDimension.init({
          dynamic_variables: {
            job_role: jobRole || "Software Engineer" 
          }
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      
      if (window.OmniDimension && typeof window.OmniDimension.destroy === 'function') {
        window.OmniDimension.destroy();
      }
    };
  }, [jobRole]); 

  return (
    <div>
      <h2></h2>
    </div>
  );
}

export default VoiceAgent;