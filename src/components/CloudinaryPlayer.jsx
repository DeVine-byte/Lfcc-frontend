import { useEffect, useRef } from "react";

function CloudinaryPlayer({

  publicId,

  width = "100%",

  height = "500px",

}) {

  const videoRef = useRef(null);

  const playerRef = useRef(null);

  useEffect(() => {

    if (!window.cloudinary) return;

    if (playerRef.current) return;

    playerRef.current = window.cloudinary.videoPlayer(
      videoRef.current,
      {
        cloud_name: "dbsup8wb8",

        controls: true,

        fluid: true,

        muted: false,

        autoplay: false,

        colors: {
          base: "#a855f7",
          accent: "#ffffff",
          text: "#ffffff",
        },

        controlBar: {
          volumePanel: true,
        },
      }
    );

    playerRef.current.source(publicId);

  }, [publicId]);

  return (
    <div
      style={{
        width,
        height,
      }}
    >
      <video
        ref={videoRef}
        className="cld-video-player cld-fluid"
      />
    </div>
  );
}

export default CloudinaryPlayer;
