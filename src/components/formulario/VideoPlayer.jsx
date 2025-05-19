import React, { useEffect, useRef } from "react";
import videos from "../../assets/videos"; // index.js que mapea los nombres a rutas

const VideoPlayer = ({ name }) => {
  const videoRef = useRef(null);
  const videoSrc = videos[name];
  console.log("Cargando video:", videoSrc);

  useEffect(() => {
    const initialHeight = window.innerHeight;
  
    const handleResize = () => {
      const heightDiff = initialHeight - window.innerHeight;
      setIsKeyboardOpen(heightDiff > 150); // si se reduce mucho, asumimos que hay teclado
    };
  
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.load(); // fuerza recarga del <source>

      const timeout = setTimeout(() => {
        // intenta reproducir solo una vez
        videoElement
          .play()
          .then(() => {
            console.log("✅ Autoplay exitoso");
          })
          .catch((error) => {
            console.warn("⚠️ Autoplay bloqueado por el navegador:", error);
          });
      }, 1500); // espera 2 segundos

      return () => {
        clearTimeout(timeout);
        videoElement.pause(); // pausa si sales de la pantalla
        videoElement.currentTime = 0;
      };
    }
  }, [name]);

  if (!videoSrc) {
    return <p>⚠️ Video "{name}" no encontrado.</p>;
  }

  const [isKeyboardOpen, setIsKeyboardOpen] = React.useState(false);

  return (
  <div className={`video-wrapper ${isKeyboardOpen ? 'keyboard-open' : ''}`}>
    <video
      ref={videoRef}
      controls
      playsInline
      webkit-playsinline
      className="video-js"
    >
      <source src={videoSrc} type="video/mp4" />
      Tu navegador no soporta el tag de video.
    </video>
  </div>
);

};

export default VideoPlayer;
