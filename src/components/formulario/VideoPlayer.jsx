import React, { useEffect, useRef } from "react";
import videos from "../../assets/videos"; // Carga index.js automáticamente

const VideoPlayer = ({ name }) => {
  const videoRef = useRef(null);
  const videoSrc = videos[name];
  console.log("Cargando video:", videoSrc);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.load(); // fuerza recarga del <source>
      videoElement.play().catch((error) => {
        console.warn("No se pudo hacer autoplay:", error);
      });
    }
  }, [name]); // corre tanto al inicio como al cambiar el nombre

  if (!videoSrc) {
    return <p>⚠️ Video "{name}" no encontrado.</p>;
  }

  return (
    <video ref={videoRef} controls className="video-js">
      <source src={videoSrc} type="video/mp4" />
      Tu navegador no soporta el tag de video.
    </video>
  );
};

export default VideoPlayer;
